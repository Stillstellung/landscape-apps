import React from 'react';
import { Helmet } from 'react-helmet';
import { ViewProps } from '@/types/groups';
import { useRouteGroup, useGroup } from '@/state/groups/groups';
import { useIsMobile } from '@/logic/useMedia';
import MobileHeader from '@/components/MobileHeader';
// import HostConnection from '@/channels/HostConnection';
import Layout from '@/components/Layout/Layout';
import ChannelsList from './ChannelsList';
import { ChannelSearchProvider } from './useChannelSearch';
import GroupAvatar from '../GroupAvatar';

export default function GroupChannelManager({ title }: ViewProps) {
  const flag = useRouteGroup();
  const group = useGroup(flag);
  const isMobile = useIsMobile();

  return (
    <section className="flex h-full flex-col overflow-hidden bg-red">
      <Helmet>
        <title>
          {group ? `Channels in ${group.meta.title} ${title}` : title}
        </title>
      </Helmet>

      {isMobile && (
        <MobileHeader
          title={<GroupAvatar image={group?.meta.image} />}
          secondaryTitle={
            <div className="flex w-full items-center justify-center space-x-1">
              <h1 className="text-[18px] text-gray-800 line-clamp-1">
                All Channels
              </h1>
            </div>
          }
          pathBack={`/groups/${flag}`}
        />
      )}
      <div className="flex grow flex-col overflow-auto bg-gray-50 px-2 sm:px-6">
        <ChannelSearchProvider>
          <ChannelsList />
        </ChannelSearchProvider>
      </div>
    </section>
  );
}
