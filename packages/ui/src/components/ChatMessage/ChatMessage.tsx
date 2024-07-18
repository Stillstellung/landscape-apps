import { utils } from '@tloncorp/shared';
import * as db from '@tloncorp/shared/dist/db';
import { Story } from '@tloncorp/shared/dist/urbit';
import { isEqual } from 'lodash';
import { memo, useCallback, useMemo } from 'react';

import { Text, View, XStack, YStack } from '../../core';
import AuthorRow from '../AuthorRow';
import ContentRenderer from '../ContentRenderer';
import { MessageInput } from '../MessageInput';
import { ChatMessageReplySummary } from './ChatMessageReplySummary';
import { ReactionsDisplay } from './ReactionsDisplay';

const NoticeWrapper = ({
  isNotice,
  children,
}: {
  isNotice?: boolean;
  children: JSX.Element;
}) => {
  if (isNotice) {
    return (
      <XStack alignItems="center" padding="$l">
        <View width={'$2xl'} flex={1} height={1} backgroundColor="$border" />
        <View
          paddingHorizontal="$m"
          backgroundColor="$border"
          borderRadius={'$2xl'}
        >
          {children}
        </View>
        <View flex={1} height={1} backgroundColor="$border" />
      </XStack>
    );
  }
  return children;
};

const ChatMessage = ({
  post,
  showAuthor,
  onPressReplies,
  onPressImage,
  onLongPress,
  showReplies,
  editing,
  editPost,
  setEditingPost,
}: {
  post: db.Post;
  showAuthor?: boolean;
  showReplies?: boolean;
  onPressReplies?: (post: db.Post) => void;
  onPressImage?: (post: db.Post, imageUri?: string) => void;
  onLongPress?: (post: db.Post) => void;
  editing?: boolean;
  editPost?: (post: db.Post, content: Story) => Promise<void>;
  setEditingPost?: (post: db.Post | undefined) => void;
}) => {
  const isNotice = post.type === 'notice';

  if (isNotice) {
    showAuthor = false;
  }

  const handleRepliesPressed = useCallback(() => {
    onPressReplies?.(post);
  }, [onPressReplies, post]);

  const handleLongPress = useCallback(() => {
    onLongPress?.(post);
  }, [post, onLongPress]);

  const handleImagePressed = useCallback(
    (uri: string) => {
      onPressImage?.(post, uri);
    },
    [onPressImage, post]
  );

  const timeDisplay = useMemo(() => {
    const date = new Date(post.sentAt ?? 0);
    return utils.makePrettyTime(date);
  }, [post.sentAt]);

  if (!post) {
    return null;
  }

  // const roles = useMemo(
  // () =>
  // group.members
  // ?.find((m) => m.contactId === post.author.id)
  // ?.roles.map((r) => r.roleId),
  // [group, post.author]
  // );

  // const prettyDay = useMemo(() => {
  // const date = new Date(post.sentAt ?? '');
  // return utils.makePrettyDay(date);
  // }, [post.sentAt]);

  if (post.isDeleted) {
    return (
      <XStack
        alignItems="center"
        key={post.id}
        gap="$s"
        paddingVertical="$m"
        paddingRight="$l"
        marginVertical="$s"
        backgroundColor="$secondaryBackground"
        borderRadius="$m"
      >
        <Text
          paddingLeft="$l"
          fontSize="$s"
          fontWeight="$l"
          color="$secondaryText"
        >
          {timeDisplay}
        </Text>
        <Text fontStyle="italic" paddingLeft="$4xl" color="$secondaryText">
          This message was deleted
        </Text>
      </XStack>
    );
  }

  return (
    <YStack
      onLongPress={handleLongPress}
      key={post.id}
      gap="$s"
      paddingVertical="$xs"
      paddingRight="$l"
    >
      {showAuthor ? (
        <View paddingLeft="$l" paddingTop="$s">
          <AuthorRow
            author={post.author}
            authorId={post.authorId}
            sent={post.sentAt ?? 0}
            type={post.type}
            // roles={roles}
          />
        </View>
      ) : null}
      <View paddingLeft={!isNotice && '$4xl'}>
        {editing ? (
          <MessageInput
            groupMembers={[]}
            storeDraft={() => {}}
            clearDraft={() => {}}
            getDraft={async () => ({})}
            shouldBlur={false}
            setShouldBlur={() => {}}
            send={async () => {}}
            channelId={post.channelId}
            editingPost={post}
            editPost={editPost}
            setEditingPost={setEditingPost}
          />
        ) : post.hidden ? (
          <Text color="$secondaryText">
            You have hidden or flagged this message.
          </Text>
        ) : (
          <NoticeWrapper isNotice={isNotice}>
            <ContentRenderer
              post={post}
              isNotice={isNotice}
              onPressImage={handleImagePressed}
              onLongPress={handleLongPress}
              deliveryStatus={post.deliveryStatus}
              isEdited={post.isEdited ?? false}
            />
          </NoticeWrapper>
        )}
      </View>
      <ReactionsDisplay post={post} />

      {showReplies &&
      post.replyCount &&
      post.replyTime &&
      post.replyContactIds ? (
        <ChatMessageReplySummary post={post} onPress={handleRepliesPressed} />
      ) : null}
    </YStack>
  );
};

export default memo(ChatMessage, (prev, next) => {
  const isPostEqual = isEqual(prev.post, next.post);

  const areOtherPropsEqual =
    prev.showAuthor === next.showAuthor &&
    prev.showReplies === next.showReplies &&
    prev.editing === next.editing &&
    prev.editPost === next.editPost &&
    prev.setEditingPost === next.setEditingPost &&
    prev.onPressReplies === next.onPressReplies &&
    prev.onPressImage === next.onPressImage &&
    prev.onLongPress === next.onLongPress;

  return isPostEqual && areOtherPropsEqual;
});
