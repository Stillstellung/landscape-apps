import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router';
<<<<<<< HEAD
import { Virtuoso } from 'react-virtuoso';
||||||| 0c006213
import bigInt from 'big-integer';
import { Virtuoso } from 'react-virtuoso';
import { unixToDa } from '@urbit/api';
=======
import bigInt from 'big-integer';
import { StateSnapshot, Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { unixToDa } from '@urbit/api';
>>>>>>> develop
import * as Toast from '@radix-ui/react-toast';
import Layout from '@/components/Layout/Layout';
import { useRouteGroup } from '@/state/groups/groups';
import {
  useDisplayMode,
  useSortMode,
  useMarkReadMutation,
  useArrangedPosts,
  useInfinitePosts,
} from '@/state/channel/channel';
import {
  useUserDiarySortMode,
  useUserDiaryDisplayMode,
} from '@/state/settings';
import { useConnectivityCheck } from '@/state/vitals';
import { PageTuple } from '@/types/channel';
import useDismissChannelNotifications from '@/logic/useDismissChannelNotifications';
import { ViewProps } from '@/types/groups';
import DiaryGridView from '@/diary/DiaryList/DiaryGridView';
import { useFullChannel } from '@/logic/channel';
import DiaryListItem from './DiaryList/DiaryListItem';
import useDiaryActions from './useDiaryActions';
import DiaryChannelListPlaceholder from './DiaryChannelListPlaceholder';
import DiaryHeader from './DiaryHeader';

const virtuosoStateByFlag: Record<string, StateSnapshot> = {};

function DiaryChannel({ title }: ViewProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { chShip, chName } = useParams();
  const chFlag = `${chShip}/${chName}`;
  const nest = `diary/${chFlag}`;
  const { data } = useConnectivityCheck(chShip ?? '');
  const groupFlag = useRouteGroup();
  const {
    posts: notes,
    isLoading,
    hasPreviousPage,
    fetchPreviousPage,
  } = useInfinitePosts(nest);
  const { mutateAsync: markRead, isLoading: isMarking } = useMarkReadMutation();
  const loadOlderNotes = useCallback(
    (atBottom: boolean) => {
      if (atBottom && hasPreviousPage) {
        fetchPreviousPage();
      }
    },
    [hasPreviousPage, fetchPreviousPage]
  );

  const {
    group,
    groupChannel: channel,
    canWrite,
  } = useFullChannel({
    groupFlag,
    nest,
  });

  const newNote = new URLSearchParams(location.search).get('new');
  const [showToast, setShowToast] = useState(false);
  const { didCopy, onCopy } = useDiaryActions({
    flag: chFlag,
    time: newNote || '',
  });

  // user can override admin-set display and sort mode for this channel type
  const userDisplayMode = useUserDiaryDisplayMode(chFlag);
  const userSortMode = useUserDiarySortMode(chFlag);
  const displayMode = useDisplayMode(nest);
  const sortMode = useSortMode(nest);
  const arrangedNotes = useArrangedPosts(nest);
  const lastArrangedNote = arrangedNotes[arrangedNotes.length - 1];

  useEffect(() => {
    let timeout: any;

    if (newNote) {
      setShowToast(true);
      timeout = setTimeout(() => {
        setShowToast(false);
        navigate(location.pathname, { replace: true });
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [newNote, location, navigate]);

  useDismissChannelNotifications({
    nest,
    markRead: useCallback(
      () => markRead({ nest: `diary/${chFlag}` }),
      [markRead, chFlag]
    ),
    isMarking,
  });

  const sortedNotes = notes
    .filter(([k, v]) => v !== null)
    .sort(([a], [b]) => {
      if (sortMode === 'arranged') {
        // if only one note is arranged, put it first
        if (
          arrangedNotes.includes(a.toString()) &&
          !arrangedNotes.includes(b.toString())
        ) {
          return -1;
        }

        // if both notes are arranged, sort by their position in the arranged list
        if (
          arrangedNotes.includes(a.toString()) &&
          arrangedNotes.includes(b.toString())
        ) {
          return arrangedNotes.indexOf(a.toString()) >
            arrangedNotes.indexOf(b.toString())
            ? 1
            : -1;
        }
      }

      if (userSortMode === 'time-dsc') {
        return b.compare(a);
      }
      if (userSortMode === 'time-asc') {
        return a.compare(b);
      }

      return b.compare(a);
    });

  const itemContent = (i: number, [time, outline]: PageTuple) => (
    <div className="my-6 mx-auto max-w-[600px] px-6">
      <DiaryListItem note={outline!} time={time} />
      {lastArrangedNote === time.toString() && (
        <div className="mt-6 flex justify-center">
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="h-1 w-1 rounded-full bg-gray-500" />
          </div>
        </div>
      )}
    </div>
  );

<<<<<<< HEAD
||||||| 0c006213
  const loadOlderNotes = useCallback(
    (load: boolean) => {
      if (!loadingOlderNotes && load) {
        setShouldLoadOlderNotes(true);
      }
      setShouldLoadOlderNotes(false);
    },
    [loadingOlderNotes]
  );

=======
  const loadOlderNotes = useCallback(
    (load: boolean) => {
      if (!loadingOlderNotes && load) {
        setShouldLoadOlderNotes(true);
      }
      setShouldLoadOlderNotes(false);
    },
    [loadingOlderNotes]
  );

  const virtuosoRef = useRef<VirtuosoHandle>(null);

  useEffect(() => {
    const currentVirtuosoRef = virtuosoRef.current;
    return () => {
      currentVirtuosoRef?.getState((state) => {
        virtuosoStateByFlag[chFlag] = state;
      });
    };
  }, [chFlag]);

>>>>>>> develop
  return (
    <Layout
      stickyHeader
      className="flex-1 bg-white sm:pt-0"
      aside={<Outlet />}
      header={
        <DiaryHeader
          groupFlag={groupFlag}
          nest={nest}
          canWrite={canWrite}
          display={userDisplayMode ?? displayMode}
          sort={userSortMode ?? sortMode === 'time' ? 'time-dsc' : 'arranged'}
        />
      }
    >
      <Helmet>
        <title>
          {channel && group
            ? `${channel.meta.title} in ${group.meta.title} ${title}`
            : title}
        </title>
      </Helmet>
      <Toast.Provider>
        <div className="relative flex flex-col items-center">
          <Toast.Root duration={3000} defaultOpen={false} open={showToast}>
            <Toast.Description asChild>
              <div className="absolute z-10 flex w-[415px] -translate-x-2/4 items-center justify-between space-x-2 rounded-lg bg-white font-semibold text-black shadow-xl dark:bg-gray-200">
                <span className="py-2 px-4">Note successfully published</span>
                <button
                  onClick={onCopy}
                  className="-mx-4 -my-2 w-[135px] rounded-r-lg bg-blue py-2 px-4 text-white dark:text-black"
                >
                  {didCopy ? 'Copied' : 'Copy Note Link'}
                </button>
              </div>
            </Toast.Description>
          </Toast.Root>
          <Toast.Viewport label="Note successfully published" />
        </div>
      </Toast.Provider>
      <div className="h-full bg-gray-50">
        {isLoading ? (
          <DiaryChannelListPlaceholder count={4} />
        ) : (displayMode === 'grid' && userDisplayMode === undefined) ||
          userDisplayMode === 'grid' ? (
          <DiaryGridView
            outlines={sortedNotes}
            loadOlderNotes={loadOlderNotes}
          />
        ) : (
          <div className="h-full">
            <div className="mx-auto flex h-full w-full flex-col">
              <Virtuoso
                ref={virtuosoRef}
                style={{ height: '100%', width: '100%' }}
                data={sortedNotes}
                itemContent={itemContent}
                overscan={200}
                atBottomStateChange={loadOlderNotes}
                components={{
                  Header: () => <div />,
                  Footer: () => <div className="h-4 w-full" />,
                }}
                restoreStateFrom={virtuosoStateByFlag[chFlag]}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default DiaryChannel;
