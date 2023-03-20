import cn from 'classnames';
import React, {
  ComponentType,
  PropsWithChildren,
  useCallback,
  useState,
} from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useRouteGroup, useGroup } from '@/state/groups';
import { ViewProps } from '@/types/groups';
import CaretLeft16Icon from '@/components/icons/CaretLeft16Icon';
import useHarkState from '@/state/hark';
import useRequestState from '@/logic/useRequestState';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import { useIsMobile } from '@/logic/useMedia';
import { randomElement, randomIntInRange } from '@/logic/utils';
import { Bin, useNotifications } from './useNotifications';

export interface NotificationsProps {
  child: ComponentType<{ bin: Bin }>;
  title?: ViewProps['title'];
}

export function MainWrapper({
  isMobile,
  title,
  children,
}: PropsWithChildren<{ title: string; isMobile: boolean }>) {
  if (!isMobile) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  return (
    <>
      <header className="flex h-14 items-center justify-between px-5 py-4">
        <h1 className="text-base font-bold">{title}</h1>
      </header>
      <nav className="h-full flex-1 overflow-y-auto">{children}</nav>
    </>
  );
}

export function GroupWrapper({
  isMobile,
  children,
}: PropsWithChildren<{ isMobile: boolean }>) {
  if (!isMobile) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  return (
    <>
      <header className="flex-none px-2 py-1">
        <Link
          to="../"
          className="default-focus inline-flex items-center rounded-lg p-2 text-base font-semibold text-gray-800 hover:bg-gray-50"
        >
          <CaretLeft16Icon className="mr-1 h-4 w-4 text-gray-400" />
          Activity
        </Link>
      </header>
      <div className="h-full w-full flex-1 overflow-y-scroll p-2 pr-0">
        {children}
      </div>
    </>
  );
}

function NotificationPlaceholder() {
  const background = `bg-gray-${randomElement([100, 200, 400])}`;
  const isMobile = useIsMobile();
  return (
    <div className="flex w-full animate-pulse flex-col rounded-lg">
      <div className="flex w-full flex-1 space-x-3 rounded-lg p-2">
        <div className="flex h-6 w-24 justify-center rounded-md bg-gray-100 text-sm" />
      </div>
      <div className="flex w-full flex-1 space-x-3 rounded-lg p-2">
        <div
          className={cn(background, 'h-12 w-full rounded-md')}
          style={{
            width: `${randomIntInRange(300, isMobile ? 300 : 900)}px`,
          }}
        />
      </div>
    </div>
  );
}

export default function Notifications({
  child: Notification,
  title,
}: NotificationsProps) {
  const flag = useRouteGroup();
  const loaded = useHarkState((s) => s.loaded);
  const group = useGroup(flag);
  const isMobile = useIsMobile();
  const {
    isPending: isMarkReadPending,
    setPending: setMarkReadPending,
    setReady: setMarkReadReady,
  } = useRequestState();
  const [showMentionsOnly, setShowMentionsOnly] = useState(false);
  const { notifications, mentions, count } = useNotifications(
    flag,
    showMentionsOnly
  );

  const hasUnreads = count > 0;

  const markAllRead = useCallback(async () => {
    setMarkReadPending();
    if (showMentionsOnly) {
      await Promise.all(
        mentions.map(async (m, index) =>
          useHarkState
            .getState()
            .sawRope(m.topYarn.rope, index === mentions.length - 1)
        )
      );
    } else {
      await useHarkState
        .getState()
        .sawSeam(flag ? { group: flag } : { desk: 'groups' });
    }
    setMarkReadReady();
  }, [setMarkReadPending, setMarkReadReady, mentions, showMentionsOnly, flag]);

  const MarkAsRead = (
    <button
      disabled={isMarkReadPending || !hasUnreads}
      className={cn('small-button whitespace-nowrap', {
        'bg-gray-400 text-gray-800': isMarkReadPending || !hasUnreads,
        'bg-blue text-white': !isMarkReadPending && hasUnreads,
      })}
      onClick={markAllRead}
    >
      {isMarkReadPending ? (
        <LoadingSpinner className="h-4 w-4" />
      ) : (
        `Mark ${showMentionsOnly ? 'Mentions' : 'All'} as Read`
      )}
    </button>
  );

  return (
    <section className="h-full w-full overflow-y-scroll bg-gray-50 p-6 pr-4">
      <Helmet>
        <title>
          {group
            ? `All Notifications for ${group?.meta?.title} ${title}`
            : title}
        </title>
      </Helmet>
      <div className="flex w-full items-center justify-between">
        <div
          className={cn('flex flex-row', {
            'w-full justify-center': isMobile,
          })}
        >
          <button
            onClick={() => setShowMentionsOnly(false)}
            className={cn('small-button rounded-r-none', {
              'bg-gray-800 text-white': !showMentionsOnly,
              'bg-white text-gray-800 ': showMentionsOnly,
              'grow whitespace-nowrap': isMobile,
            })}
          >
            All Notifications{hasUnreads ? ` • ${count} New` : null}
          </button>
          <button
            onClick={() => setShowMentionsOnly(true)}
            className={cn('small-button rounded-l-none', {
              'bg-gray-800 text-white': showMentionsOnly,
              'bg-white text-gray-800': !showMentionsOnly,
              'grow whitespace-nowrap': isMobile,
            })}
          >
            Mentions Only
            {mentions.length ? ` • ${mentions.length} New` : null}
          </button>
        </div>

        {!isMobile && hasUnreads && MarkAsRead}
      </div>
      <div className="flex flex-row justify-end pt-2">
        {isMobile && hasUnreads && MarkAsRead}
      </div>
      {loaded ? (
        notifications.length === 0 ? (
          <div className="mt-3 flex w-full items-center justify-center">
            <span className="text-base font-semibold text-gray-400">
              No notifications from {group ? 'this' : 'any'} group.
            </span>
          </div>
        ) : (
          notifications.map((grouping) => (
            <div key={grouping.date}>
              <h2 className="my-4 text-lg font-bold text-gray-400">
                {grouping.date}
              </h2>
              <ul className="space-y-2">
                {grouping.bins.map((b) => (
                  <li key={b.time}>
                    <Notification bin={b} />
                  </li>
                ))}
              </ul>
            </div>
          ))
        )
      ) : (
        new Array(30)
          .fill(true)
          .map((_, i) => <NotificationPlaceholder key={i} />)
      )}
    </section>
  );
}
