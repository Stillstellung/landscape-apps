import * as api from '../api';
import * as db from '../db';
import { createDevLogger } from '../debug';

const logger = createDevLogger('ContactActions', false);

export async function addContact(contactId: string) {
  // Optimistic update
  // await db.addContact({ id: contactId });
  await db.updateContact({ id: contactId, isContact: true });

  try {
    await api.addContact(contactId);
  } catch (e) {
    console.error('Error adding contact', e);
    // Rollback the update
    await db.updateContact({ id: contactId, isContact: false });
  }
}

export async function removeContact(contactId: string) {
  // Optimistic update
  await db.updateContact({ id: contactId, isContact: false });

  try {
    await api.removeContact(contactId);
  } catch (e) {
    console.error('Error removing contact', e);
    // Rollback the update
    await db.updateContact({ id: contactId, isContact: true });
  }
}

export async function updateCurrentUserProfile(update: api.ProfileUpdate) {
  const currentUserId = api.getCurrentUserId();
  const currentUserContact = await db.getContact({ id: currentUserId });
  const startingValues: Partial<db.Contact> = {};
  if (currentUserContact) {
    for (const key in update) {
      if (key in currentUserContact) {
        startingValues[key as keyof api.ProfileUpdate] =
          currentUserContact[key as keyof api.ProfileUpdate];
      }
    }
  }

  // Optimistic update
  await db.updateContact({ id: currentUserId, ...update });

  try {
    await api.updateCurrentUserProfile(update);
  } catch (e) {
    console.error('Error updating profile', e);
    // Rollback the update
    await db.updateContact({ id: currentUserId, ...startingValues });
  }
}

export async function addPinnedGroupToProfile(groupId: string) {
  // Optimistic update
  await db.addPinnedGroup({ groupId });

  try {
    await api.addPinnedGroup(groupId);
  } catch (e) {
    console.error('Error adding pinned group', e);
    // Rollback the update
    await db.removePinnedGroup({ groupId });
  }
}

export async function removePinnedGroupFromProfile(groupId: string) {
  // Optimistic update
  await db.removePinnedGroup({ groupId });

  try {
    await api.removePinnedGroup(groupId);
  } catch (e) {
    console.error('Error removing pinned group', e);
    // Rollback the update
    await db.addPinnedGroup({ groupId });
  }
}

export async function updateProfilePinnedGroups(newPinned: db.Group[]) {
  const currentUserId = api.getCurrentUserId();
  const currentUserContact = await db.getContact({ id: currentUserId });
  const startingPinnedIds =
    currentUserContact?.pinnedGroups.map((pg) => pg.groupId) ?? [];

  const additions = [];
  const deletions = [];

  for (const group of newPinned) {
    if (!startingPinnedIds.includes(group.id)) {
      additions.push(group.id);
    }
  }

  for (const groupId of startingPinnedIds) {
    if (!newPinned.find((g) => g.id === groupId)) {
      deletions.push(groupId);
    }
  }

  logger.log(
    'Updating pinned groups [additions, deletions]',
    additions,
    deletions
  );

  const additionPromises = additions.map((groupId) =>
    addPinnedGroupToProfile(groupId)
  );
  const deletionPromises = deletions.map((groupId) =>
    removePinnedGroupFromProfile(groupId)
  );

  return Promise.all([...additionPromises, ...deletionPromises]);
}
