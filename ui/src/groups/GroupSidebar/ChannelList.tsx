import cn from 'classnames';
import { useLocation } from 'react-router';
<<<<<<< HEAD
import React, { ReactNode, useState } from 'react';
import { channelHref, canReadChannel } from '@/logic/channel';
||||||| 0c006213
import React, { ReactNode, useState } from 'react';
import {
  channelHref,
  canReadChannel,
  nestToFlag,
  getFlagParts,
  isChannelImported,
} from '@/logic/utils';
=======
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StateSnapshot, Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import {
  channelHref,
  canReadChannel,
  nestToFlag,
  getFlagParts,
  isChannelImported,
} from '@/logic/utils';
>>>>>>> develop
import { useIsMobile } from '@/logic/useMedia';
import {
  useGroup,
  useGroupConnection,
  useGroupFlag,
  useVessel,
} from '@/state/groups';
import SortIcon from '@/components/icons/SortIcon';
import SidebarItem from '@/components/Sidebar/SidebarItem';
import { DEFAULT } from '@/logic/useSidebarSort';
import { GroupChannel } from '@/types/groups';
import Divider from '@/components/Divider';
import ChannelIcon from '@/channels/ChannelIcon';
import {
  useChannelSections,
  useChannelSort,
  useCheckChannelJoined,
  useCheckChannelUnread,
} from '@/logic/channel';
import UnreadIndicator from '@/components/Sidebar/UnreadIndicator';
import HashIcon from '@/components/icons/HashIcon';
import InviteIcon from '@/components/icons/InviteIcon';
import PeopleIcon from '@/components/icons/PeopleIcon';
import useFilteredSections from '@/logic/useFilteredSections';
import GroupListPlaceholder from '@/components/Sidebar/GroupListPlaceholder';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import ActionMenu, { Action } from '@/components/ActionMenu';
import FilterIconMobileNav from '@/components/icons/FilterIconMobileNav';

const UNZONED = 'default';

type ChannelSorterProps = {
  isMobile?: boolean;
};

export function ChannelSorter({ isMobile }: ChannelSorterProps) {
  const { sortFn, sortOptions, setSortFn } = useChannelSort();
  const [open, setOpen] = useState(false);

  function sortLabel() {
    switch (sortFn) {
      case 'Arranged':
        return 'Arranged Channels';
      case 'Recent':
        return 'Recent Activity';
      case 'A → Z':
        return 'Channels A → Z';
      default:
        return 'Channels';
    }
  }

  const actions: Action[] = [];

  if (!isMobile) {
    actions.push({
      key: 'ordering',
      type: 'disabled',
      content: 'Channel Ordering',
    });
  }

  Object.keys(sortOptions).forEach((k) => {
    actions.push({
      key: k,
      type: k === sortFn ? 'prominent' : 'default',
      onClick: () => setSortFn(k),
      content: k,
    });
  });

  return (
    <div className="border-gray-50 sm:flex sm:w-full sm:items-center sm:justify-between sm:border-t-2 sm:p-2 sm:py-3">
      {!isMobile && (
        <h2 className="px-2 pb-0 text-sm font-semibold text-gray-400">
          {sortLabel()}
        </h2>
      )}
      <ActionMenu
        open={open}
        onOpenChange={setOpen}
        actions={actions}
        asChild={false}
        triggerClassName="default-focus flex items-center rounded-lg text-base font-semibold hover:bg-gray-50 dark:mix-blend-screen sm:p-1"
        contentClassName="w-56"
        ariaLabel="Groups Sort Options"
      >
        {isMobile ? (
          <FilterIconMobileNav className="h-8 w-8 text-gray-900" />
        ) : (
          <SortIcon className="h-6 w-6 text-gray-400 sm:h-4 sm:w-4" />
        )}
      </ActionMenu>
    </div>
  );
}

<<<<<<< HEAD
export default function ChannelList({ className }: ChannelListProps) {
||||||| 0c006213
interface UnmigratedChannelProps {
  icon: ReactNode | ((active: boolean) => React.ReactNode);
  title: string;
  host: string;
  isMobile: boolean;
}

function UnmigratedChannel({
  icon,
  host,
  title,
  isMobile,
}: UnmigratedChannelProps) {
  return (
    <MigrationTooltip ship={host} side="right">
      <SidebarItem
        icon={icon}
        actions={
          <Bullet16Icon className="m-2 h-4 w-4 text-orange opacity-60" />
        }
      >
        <span className="opacity-60">{title}</span>
      </SidebarItem>
    </MigrationTooltip>
  );
}

export default function ChannelList({ className }: ChannelListProps) {
=======
interface UnmigratedChannelProps {
  icon: ReactNode | ((active: boolean) => React.ReactNode);
  title: string;
  host: string;
}

function UnmigratedChannel({ icon, host, title }: UnmigratedChannelProps) {
  return (
    <MigrationTooltip ship={host} side="right">
      <SidebarItem
        icon={icon}
        actions={
          <Bullet16Icon className="m-2 h-4 w-4 text-orange opacity-60" />
        }
      >
        <span className="opacity-60">{title}</span>
      </SidebarItem>
    </MigrationTooltip>
  );
}

type ListItem =
  | {
      type: 'static-top';
    }
  | {
      type: 'section-header';
      section: string;
    }
  | {
      type: 'channel';
      channel: [string, GroupChannel];
    };

const virtuosoStateByFlag: Record<string, StateSnapshot> = {};

export default function ChannelList() {
>>>>>>> develop
  const flag = useGroupFlag();
  const group = useGroup(flag);
  const connected = useGroupConnection(flag);
  const { sortFn, sortChannels } = useChannelSort();
  const isDefaultSort = sortFn === DEFAULT;
  const { sectionedChannels } = useChannelSections(flag);
  const filteredSections = useFilteredSections(flag, true);
  const isMobile = useIsMobile();
  const vessel = useVessel(flag, window.our);
  const isChannelJoined = useCheckChannelJoined();
  const isChannelUnread = useCheckChannelUnread();
  const location = useLocation();

  const virtuosoRef = useRef<VirtuosoHandle>(null);

  useEffect(() => {
    const currentVirtuosoRef = virtuosoRef.current;
    return () => {
      currentVirtuosoRef?.getState((state) => {
        virtuosoStateByFlag[flag] = state;
      });
    };
  }, [flag]);

  const items: ListItem[] = useMemo(() => {
    if (!group) {
      return [];
    }

    const arr: ListItem[] = [{ type: 'static-top' }];

    const shouldShowChannel = ([nest, channel]: [string, GroupChannel]) =>
      (isChannelJoined(nest) && canReadChannel(channel, vessel, group.bloc)) ||
      nest in pendingImports;

    if (isDefaultSort) {
      filteredSections.forEach((s) => {
        if (s !== UNZONED) {
          const title = s in group.zones ? group.zones[s].meta.title : '';
          arr.push({
            type: 'section-header',
            section: title,
          });
        }

        sectionedChannels[s].forEach((channel) => {
          if (shouldShowChannel(channel)) {
            arr.push({ type: 'channel', channel });
          }
        });
      });
    } else {
      sortChannels(group.channels).forEach((channel) => {
        if (shouldShowChannel(channel)) {
          arr.push({ type: 'channel', channel });
        }
      });
    }

    return arr;
  }, [
    group,
    isDefaultSort,
    isChannelJoined,
    vessel,
    pendingImports,
    filteredSections,
    sectionedChannels,
    sortChannels,
  ]);

  const renderStaticTop = useCallback(() => {
    if (!isMobile) {
      return <ChannelSorter isMobile={false} />;
    }

    return (
      <div className="mx-4 sm:mx-2">
        <SidebarItem
          icon={
            <div className="flex h-12 w-12 items-center justify-center rounded-full">
              <PeopleIcon className="m-1 h-6 w-6 text-gray-400" />
            </div>
          }
          to="./members"
        >
          Members
        </SidebarItem>
        <SidebarItem
          icon={
            <div className="flex h-12 w-12 items-center justify-center rounded-full">
              <HashIcon className="m-1 h-6 w-6 text-gray-400" />
            </div>
          }
          to={`/groups/${flag}/channels`}
        >
          All Channels
        </SidebarItem>
        <SidebarItem
          color="text-blue"
          highlight="bg-blue-soft"
          icon={
            <div className="flex h-12 w-12 items-center justify-center rounded-full">
              <InviteIcon className="h-6 w-6" />
            </div>
          }
          to={`/groups/${flag}/invite`}
          state={{ backgroundLocation: location }}
        >
          Invite People
        </SidebarItem>
      </div>
    );
  }, [isMobile, flag, location]);

  const renderSectionHeader = useCallback(
    (section: string) => <Divider isMobile={isMobile}>{section}</Divider>,
    [isMobile]
  );

  const renderChannel = useCallback(
    ([nest, channel]: [string, GroupChannel]) => {
      const [, chFlag] = nestToFlag(nest);
      const { ship } = getFlagParts(chFlag);
      const imported =
        isChannelImported(nest, pendingImports) && hasStarted(ship);
      const icon = (active: boolean) =>
        isMobile ? (
          <span
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-md',
              !imported && 'opacity-60',
              active && 'bg-white'
            )}
          >
            <ChannelIcon nest={nest} className="h-6 w-6 text-gray-400" />
          </span>
        ) : (
          <ChannelIcon
            nest={nest}
            className={cn('h-6 w-6', !imported && 'opacity-60')}
          />
        );

      if (!imported) {
        return (
          <UnmigratedChannel
            icon={icon}
            title={channel.meta.title || nest}
            host={ship}
          />
        );
      }

      return (
        <SidebarItem
          inexact
          key={nest}
          icon={icon}
          to={channelHref(flag, nest)}
          actions={
            isChannelUnread(nest) ? (
              <UnreadIndicator className="m-0.5 h-5 w-5 text-blue" />
            ) : null
          }
        >
          {channel.meta.title || nest}
        </SidebarItem>
      );
    },
    [pendingImports, hasStarted, flag, isChannelUnread, isMobile]
  );

  const renderItem = useCallback(
    (_index: number, item: ListItem) => {
      switch (item.type) {
        case 'static-top':
          return renderStaticTop();
        case 'section-header':
          return (
            <div className="mx-4 sm:mx-2">
              {renderSectionHeader(item.section)}
            </div>
          );
        case 'channel':
          return (
            <div className="mx-4 sm:mx-2">{renderChannel(item.channel)}</div>
          );
        default:
          return null;
      }
    },
    [renderStaticTop, renderSectionHeader, renderChannel]
  );

  const computeItemKey = useCallback((_index: number, item: ListItem) => {
    switch (item.type) {
      case 'static-top':
        return 'static-top';
      case 'section-header':
        return item.section;
      case 'channel':
        return item.channel[0];
      default:
        return '';
    }
  }, []);

  if (!group || group.meta.title === '') {
    return (
      <div className={cn('h-full w-full flex-1 overflow-y-auto')}>
        <h2 className="px-4 pb-0 text-sm font-semibold text-gray-400">
          <div className="flex justify-between">
            {!connected ? (
              'Host is Offline.'
            ) : (
              <>
                Loading Channels
                <LoadingSpinner className="h-4 w-4 text-gray-400" />
              </>
            )}
          </div>
        </h2>
        <GroupListPlaceholder count={15} pulse={connected} />;
      </div>
    );
  }

<<<<<<< HEAD
  const renderChannels = (channels: [string, GroupChannel][]) =>
    channels
      .filter(
        ([nest, chan]) =>
          isChannelJoined(nest) && canReadChannel(chan, vessel, group?.bloc)
      )
      .map(([nest, channel]) => {
        const icon = (active: boolean) =>
          isMobile ? (
            <span
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-md',
                active && 'bg-white'
              )}
            >
              <ChannelIcon nest={nest} className="h-6 w-6 text-gray-400" />
            </span>
          ) : (
            <ChannelIcon nest={nest} className="h-6 w-6" />
          );

        return (
          <SidebarItem
            inexact
            key={nest}
            icon={icon}
            to={channelHref(flag, nest)}
            actions={
              isChannelUnread(nest) ? (
                <UnreadIndicator className="m-0.5 h-5 w-5 text-blue" />
              ) : null
            }
          >
            {channel.meta.title || nest}
          </SidebarItem>
        );
      });

  const unsectionedChannels = sortChannels(group.channels).filter(([n]) =>
    isChannelJoined(n)
  );

||||||| 0c006213
  const renderChannels = (channels: [string, GroupChannel][]) =>
    channels
      .filter(
        ([nest, chan]) =>
          (isChannelJoined(nest) &&
            canReadChannel(chan, vessel, group?.bloc)) ||
          nest in pendingImports
      )
      .map(([nest, channel]) => {
        const [, chFlag] = nestToFlag(nest);
        const { ship } = getFlagParts(chFlag);
        const imported =
          isChannelImported(nest, pendingImports) && hasStarted(ship);
        const icon = (active: boolean) =>
          isMobile ? (
            <span
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-md',
                !imported && 'opacity-60',
                active && 'bg-white'
              )}
            >
              <ChannelIcon nest={nest} className="h-6 w-6 text-gray-400" />
            </span>
          ) : (
            <ChannelIcon
              nest={nest}
              className={cn('h-6 w-6', !imported && 'opacity-60')}
            />
          );

        if (!imported) {
          return (
            <UnmigratedChannel
              icon={icon}
              title={channel.meta.title || nest}
              host={ship}
              isMobile={isMobile}
            />
          );
        }

        return (
          <SidebarItem
            inexact
            key={nest}
            icon={icon}
            to={channelHref(flag, nest)}
            actions={
              isChannelUnread(nest) ? (
                <UnreadIndicator className="m-0.5 h-5 w-5 text-blue" />
              ) : null
            }
          >
            {channel.meta.title || nest}
          </SidebarItem>
        );
      });

  const unsectionedChannels = sortChannels(group.channels).filter(([n]) =>
    isChannelJoined(n)
  );

=======
>>>>>>> develop
  return (
    <Virtuoso
      ref={virtuosoRef}
      data={items}
      computeItemKey={computeItemKey}
      itemContent={renderItem}
      restoreStateFrom={virtuosoStateByFlag[flag]}
      className="h-full w-full flex-1 space-y-0.5 overflow-x-hidden"
    />
  );
}
