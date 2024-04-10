import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { JSONContent } from '@tiptap/core';
import { sync } from '@tloncorp/shared';
import { sendPost } from '@tloncorp/shared/dist/api';
import * as db from '@tloncorp/shared/dist/db';
import { Channel, ChannelSwitcherSheet, View } from '@tloncorp/ui';
import React, { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useShip } from '../contexts/ship';
import type { HomeStackParamList } from '../types';

type ChannelScreenProps = NativeStackScreenProps<HomeStackParamList, 'Channel'>;

export default function ChannelScreen(props: ChannelScreenProps) {
  const [open, setOpen] = React.useState(false);
  const [currentChannel, setCurrentChannel] = React.useState<db.Channel | null>(
    props.route.params.channel ?? null
  );
  const { group } = props.route.params;
  const {
    result: groupWithRelations,
    isLoading,
    error,
  } = db.useGroup({ id: group.id });

  const { result: posts } = db.useChannelPosts({
    channelId: currentChannel?.id ?? '',
  });
  const { result: aroundPosts } = db.useChannelPostsAround({
    channelId: currentChannel?.id ?? '',
    postId: props.route.params.selectedPost?.id ?? '',
  });

  const { result: contacts } = db.useContacts();
  const { top, bottom } = useSafeAreaInsets();
  const { ship } = useShip();

  const messageSender = async (content: JSONContent, channelId: string) => {
    if (!ship) {
      return;
    }
    await sendPost(channelId, content, ship);
  };
  const hasSelectedPost = !!props.route.params.selectedPost;

  useEffect(() => {
    if (groupWithRelations) {
      const firstChatChannel = groupWithRelations.channels.find(
        (c) => c.type === 'chat'
      );
      if (firstChatChannel) {
        setCurrentChannel(firstChatChannel);
      }
    }
  }, [groupWithRelations]);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  useEffect(() => {
    const syncChannel = async (id: string) => {
      if (props.route.params.selectedPost) {
        sync.syncPostsAround(props.route.params.selectedPost);
      } else {
        sync.syncChannel(id, Date.now());
      }
    };

    if (currentChannel) {
      syncChannel(currentChannel.id);
    }
  }, [currentChannel, props.route.params.selectedPost]);

  if (isLoading || !groupWithRelations || !currentChannel) {
    return null;
  }

  return (
    <View paddingTop={top} backgroundColor="$background" flex={1}>
      <Channel
        channel={currentChannel}
        calmSettings={{
          disableAppTileUnreads: false,
          disableAvatars: false,
          disableNicknames: false,
          disableRemoteContent: false,
          disableSpellcheck: false,
        }}
        group={groupWithRelations ?? []}
        contacts={contacts ?? []}
        posts={hasSelectedPost ? aroundPosts : posts}
        selectedPost={
          hasSelectedPost && aroundPosts?.length
            ? props.route.params.selectedPost?.id
            : undefined
        }
        goBack={props.navigation.goBack}
        goToChannels={() => setOpen(true)}
        messageSender={messageSender}
        goToSearch={() =>
          props.navigation.push('ChannelSearch', { channel: currentChannel })
        }
      />
      <ChannelSwitcherSheet
        open={open}
        onOpenChange={(open) => setOpen(open)}
        group={groupWithRelations}
        channels={groupWithRelations.channels || []}
        contacts={contacts ?? []}
        paddingBottom={bottom}
        onSelect={(channel: db.Channel) => {
          setCurrentChannel(channel);
          setOpen(false);
        }}
      />
    </View>
  );
}
