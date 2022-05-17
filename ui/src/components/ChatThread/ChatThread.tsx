import { udToDec } from '@urbit/api';
import bigInt from 'big-integer';
import React from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useChannelFlag } from '../../hooks';
import { useMessagesForChat, useReplies } from '../../state/chat';
import { useChannel, useRouteGroup } from '../../state/groups';
import ChatInput from '../ChatInput/ChatInput';
import ChatMessage from '../ChatMessage/ChatMessage';
import ChatMessages from '../ChatMessages';
import XIcon from '../icons/XIcon';
import RowDivider from '../RowDivider';

export default function ChatThread() {
  const flag = useChannelFlag()!;
  const groupFlag = useRouteGroup();
  const time = useParams<{ time: string }>().time!;

  const messages = useMessagesForChat(flag);
  const writ = messages.get(bigInt(udToDec(time)));
  const replies = useReplies(flag, time);
  const channel = useChannel(groupFlag, flag)!;

  return (
    <div className="flex h-full min-w-72 flex-col space-y-2 overflow-y-auto border-l px-4 pt-4 xl:min-w-96">
      <div className="sticky top-0 z-10 flex justify-between rounded border bg-white p-3 ">
        <div>Thread: {channel.meta.title}</div>
        <Link to="..">
          <XIcon className="h-4 w-4 text-gray-400" />
        </Link>
      </div>
      <ChatMessage writ={writ} newAuthor hideReplies />
      <RowDivider
        className="py-2 text-gray-400"
        label={`${replies.length} ${
          replies.length === 1 ? 'Reply' : 'Replies'
        }`}
      />
      <ChatMessages flag={flag} replying={time} />
      <div className="sticky bottom-0 z-10 bg-white py-4">
        <ChatInput flag={flag} replying={time} />
      </div>
    </div>
  );
}
