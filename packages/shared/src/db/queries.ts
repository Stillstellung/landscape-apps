import {
  AnyColumn,
  Column,
  SQLWrapper,
  Table,
  and,
  count,
  desc,
  eq,
  getTableColumns,
  gt,
  isNull,
  lt,
  not,
  or,
  sql,
} from 'drizzle-orm';

import { createDevLogger } from '../debug';
import { client } from './client';
import { createQuery } from './query';
import {
  channels as $channels,
  contactGroups as $contactGroups,
  contacts as $contacts,
  groupMemberRoles as $groupMemberRoles,
  groupMembers as $groupMembers,
  groupRoles as $groupRoles,
  groups as $groups,
  pins as $pins,
  posts as $posts,
  unreads as $unreads,
} from './schema';
import {
  ChannelInsert,
  ContactInsert,
  GroupInsert,
  Insertable,
  Pin,
  PostInsert,
  Unread,
} from './types';

const logger = createDevLogger('query', true);
let counter = 0;

export interface GetGroupsOptions {
  sort?: 'pinIndex';
  includeUnjoined?: boolean;
}

export const getGroups = createQuery(
  async ({ sort, includeUnjoined }: GetGroupsOptions = {}) => {
    return client.query.groups.findMany({
      where: includeUnjoined ? undefined : eq($groups.isJoined, true),
      orderBy: sort === 'pinIndex' ? ascNullsLast($groups.pinIndex) : undefined,
    });
  }
);

export const insertGroup = async (group: GroupInsert) => {
  await client.transaction(async (tx) => {
    await tx
      .insert($groups)
      .values(group)
      .onConflictDoUpdate({
        target: [$groups.id],
        set: conflictUpdateSet(
          $groups.iconImage,
          $groups.coverImage,
          $groups.title,
          $groups.description,
          $groups.isSecret,
          $groups.isJoined
        ),
      });
    if (group.roles) {
      await client
        .insert($groupRoles)
        .values(group.roles)
        .onConflictDoUpdate({
          target: [$groupRoles.groupId, $groupRoles.id],
          set: conflictUpdateSet(
            $groupRoles.groupId,
            $groupRoles.iconImage,
            $groupRoles.coverImage,
            $groupRoles.title,
            $groupRoles.description
          ),
        });
    }
    if (group.members) {
      await client
        .insert($contacts)
        .values(group.members.map((m) => ({ id: m.contactId })))
        .onConflictDoNothing();
      await client
        .insert($groupMembers)
        .values(group.members)
        .onConflictDoNothing();
      const validRoleNames = group.roles?.map((r) => r.id);
      const memberRoles = group.members.flatMap((m) => {
        return (m.roles ?? []).flatMap((r) => {
          // TODO: This is here because I've seen at least one instance (in
          // Galen's TD group) where a member is assigned a role that doesn't
          // exist in the group's cabals. Should figure out if this is expected
          // behavior if we should try retain the role.
          if (!validRoleNames?.includes(r.roleId)) {
            console.warn('discarding invalid role', r.contactId, r.roleId);
            return [];
          }
          return {
            groupId: group.id,
            contactId: m.contactId,
            roleId: r.roleId,
          };
        });
      });
      if (memberRoles.length) {
        await client
          .insert($groupMemberRoles)
          .values(memberRoles)
          .onConflictDoNothing();
      }
    }
    if (group.channels?.length) {
      await client
        .insert($channels)
        .values(group.channels)
        .onConflictDoUpdate({
          target: [$channels.id],
          set: conflictUpdateSet(
            $channels.iconImage,
            $channels.coverImage,
            $channels.title,
            $channels.description,
            $channels.addedToGroupAt,
            $channels.currentUserIsMember
          ),
        });
    }
    if (group.posts) {
    }
  });
};

export const getGroupRoles = createQuery(async (groupId: string) => {
  return client.query.groupRoles.findMany();
});

export const getUnreadsCount = createQuery(
  async ({ type }: { type?: Unread['type'] }) => {
    const result = await client
      .select({ count: count() })
      .from($unreads)
      .where(() =>
        and(
          gt($unreads.totalCount, 0),
          type ? eq($unreads.type, type) : undefined
        )
      );
    return result[0].count;
  }
);

export const getUnreads = createQuery(
  async ({
    orderBy = 'updatedAt',
    includeFullyRead = false,
  }: { orderBy?: 'updatedAt'; includeFullyRead?: boolean } = {}) => {
    return client.query.unreads.findMany({
      where: includeFullyRead ? undefined : gt($unreads.totalCount, 0),
      orderBy: orderBy === 'updatedAt' ? desc($unreads.updatedAt) : undefined,
    });
  },
  {
    tableDependencies: ['unreads'],
  }
);

export const getAllUnreadsCounts = async () => {
  const [channelUnreadCount, dmUnreadCount] = await Promise.all([
    getUnreadsCount({ type: 'channel' }),
    getUnreadsCount({ type: 'dm' }),
  ]);
  return {
    channels: channelUnreadCount ?? 0,
    dms: dmUnreadCount ?? 0,
    total: (channelUnreadCount ?? 0) + (dmUnreadCount ?? 0),
  };
};

export const getChannel = createQuery(
  async (id: string) => {
    return client.query.channels.findFirst({ where: eq($channels.id, id) });
  },
  {
    tableDependencies: ['channels'],
  }
);

export const updateChannel = createQuery(
  (update: ChannelInsert) => {
    return client
      .update($channels)
      .set(update)
      .where(eq($channels.id, update.id));
  },
  {
    tableEffects: ['channels'],
  }
);

export const insertChannelPosts = createQuery(
  async (channelId: string, posts: PostInsert[]) => {
    return client.transaction(async (tx) => {
      const lastPost = posts[posts.length - 1];
      // Update last post meta for the channel these posts belong to,
      // Also grab that channels groupId for updating the group's lastPostAt and
      // associating the posts with the group.
      const updatedChannels = await tx
        .update($channels)
        .set({ lastPostId: lastPost.id, lastPostAt: lastPost.receivedAt })
        .where(
          and(
            eq($channels.id, channelId),
            or(
              isNull($channels.lastPostAt),
              lt($channels.lastPostAt, lastPost.receivedAt ?? 0)
            )
          )
        )
        .returning({ groupId: $channels.groupId });
      // Update group if we found one.
      const groupId = updatedChannels[0]?.groupId;
      if (groupId) {
        await tx
          .update($groups)
          .set({ lastPostAt: lastPost.receivedAt })
          .where(eq($groups.id, groupId));
      }
      // Actually insert posts, overwriting any existing posts with the same id.
      await tx
        .insert($posts)
        .values(posts.map((p) => ({ ...p, groupId, channelId })))
        .onConflictDoUpdate({
          target: $posts.id,
          set: conflictUpdateSetAll($posts),
        });
    });
  },
  {
    tableEffects: ['posts', 'groups', 'channels'],
  }
);

export const insertGroups = createQuery(async (groupData: GroupInsert[]) => {
  for (let group of groupData) {
    await insertGroup(group);
  }
});

export const getGroup = createQuery(async (id: string) => {
  return client.query.groups.findFirst({
    where: (groups, { eq }) => eq(groups.id, id),
  });
});

export const getContacts = createQuery(async () => {
  return client.query.contacts.findMany({
    with: {
      pinnedGroups: {
        with: {
          group: true,
        },
      },
    },
  });
});

export const getContactsCount = createQuery(async () => {
  const result = await client.select({ count: count() }).from($contacts);
  return result[0].count;
});

export const getContact = createQuery(
  async (id: string) => {
    return client.query.contacts.findFirst({
      where: (contacts, { eq }) => eq(contacts.id, id),
    });
  },
  {
    tableDependencies: ['contacts'],
  }
);

export const insertContact = createQuery(
  async (contact: ContactInsert) => {
    return client.insert($contacts).values(contact);
  },
  {
    tableEffects: ['contacts'],
  }
);

export const insertContacts = createQuery(
  async (contactsData: ContactInsert[]) => {
    const contactGroups = contactsData.flatMap(
      (contact) => contact.pinnedGroups || []
    );
    const targetGroups = contactGroups.map(
      (g): GroupInsert => ({
        id: g.groupId,
        isSecret: false,
      })
    );
    await client.insert($contacts).values(contactsData).onConflictDoNothing();
    await client.insert($groups).values(targetGroups).onConflictDoNothing();
    // TODO: Remove stale pinned groups
    await client
      .insert($contactGroups)
      .values(contactGroups)
      .onConflictDoNothing();
  }
);

export const insertUnreads = createQuery(
  async (unreads: Insertable<'unreads'>[]) => {
    return client.transaction(() => {
      return client
        .insert($unreads)
        .values(unreads)
        .onConflictDoUpdate({
          target: [$unreads.channelId],
          set: {
            totalCount: sql.raw(`excluded.totalCount + unreads.totalCount`),
          },
        });
    });
  }
);

export const insertPinnedItems = createQuery(async (pinnedItems: Pin[]) => {
  return client.transaction(async (tx) => {
    await Promise.all([
      tx.delete($pins),
      tx
        .update($groups)
        .set({ pinIndex: null })
        .where(not(isNull($groups.pinIndex))),
    ]);
    await tx.insert($pins).values(pinnedItems);
    const groups: GroupInsert[] = pinnedItems.flatMap((p) => {
      if (!p.itemId) {
        return [];
      }
      return [
        {
          id: p.itemId,
          pinIndex: p.index,
        },
      ];
    });
    await tx
      .insert($groups)
      .values(groups)
      .onConflictDoUpdate({
        target: [$groups.id],
        set: {
          pinIndex: sql`excluded.pin_index`,
        },
      });
  });
});

export const getPinnedItems = createQuery(
  async (params?: { orderBy?: keyof Pin; direction?: 'asc' | 'desc' }) => {
    return client.query.pins.findMany({
      orderBy: params?.orderBy
        ? (pins, { asc, desc }) => [
            (params.direction === 'asc' ? asc : desc)(pins[params.orderBy!]),
          ]
        : undefined,
    });
  }
);

// Helpers

export function conflictUpdateSetAll(table: Table) {
  const columns = getTableColumns(table);
  return conflictUpdateSet(...Object.values(columns));
}

export function conflictUpdateSet(...columns: Column[]) {
  return Object.fromEntries(
    columns.map((c) => [c.name, sql.raw(`excluded.${c.name}`)])
  );
}

export function ascNullsLast(column: SQLWrapper | AnyColumn) {
  return sql`${column} ASC NULLS LAST`;
}
