import React, { useEffect } from 'react';
import { HeapCurio } from '@/types/heap';
import cn from 'classnames';
import { nestToFlag } from '@/logic/utils';
import HeapContent from '@/heap/HeapContent';
import TwitterIcon from '@/components/icons/TwitterIcon';
import { formatDistanceToNow } from 'date-fns';
import IconButton from '@/components/IconButton';
import ChatSmallIcon from '@/components/icons/ChatSmallIcon';
import ElipsisSmallIcon from '@/components/icons/EllipsisSmallIcon';
import MusicLargeIcon from '@/components/icons/MusicLargeIcon';
import LinkIcon from '@/components/icons/LinkIcon';
import CopyIcon from '@/components/icons/CopyIcon';
import { useHeapState } from '@/state/heap/heap';
import useNest from '@/logic/useNest';
import useHeapContentType from '@/logic/useHeapContentType';
import HeapLoadingBlock from './HeapLoadingBlock';

function TopBar({
  hasIcon = false,
  isTwitter = false,
  time,
}: {
  isTwitter?: boolean;
  hasIcon?: boolean;
  time: string;
}) {
  const nest = useNest();
  const [, chFlag] = nestToFlag(nest);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const onDelete = () => {
    setMenuOpen(false);
    useHeapState.getState().delCurio(chFlag, time);
  };
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={
        hasIcon || isTwitter
          ? 'flex items-center justify-between'
          : 'flex items-center justify-end'
      }
    >
      {isTwitter ? <TwitterIcon className="m-2 h-6 w-6" /> : null}
      {hasIcon ? <div className="m-2 h-6 w-6" /> : null}
      <div
        className="flex space-x-2 text-sm text-gray-600"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="hidden group-hover:block">
          <IconButton
            icon={<CopyIcon className="h-4 w-4" />}
            // FIXME: add actual copy to clipboard functionality with link.
            action={() => console.log('copy link to urbit webgraph url')}
            label="expand"
            className="rounded bg-white"
          />
        </div>
        <div className="relative hidden group-hover:block">
          <IconButton
            icon={<ElipsisSmallIcon className="h-4 w-4" />}
            label="options"
            className="rounded bg-white"
            action={() => setMenuOpen(!menuOpen)}
          />
          <div
            className={cn(
              'absolute right-0 flex w-[101px] flex-col items-start rounded bg-white text-sm font-semibold text-gray-800 shadow',
              { hidden: !menuOpen }
            )}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <button
              // FIXME: add edit functionality
              className="small-menu-button"
            >
              Edit
            </button>
            <button className="small-menu-button" onClick={onDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface BottomBarProps {
  provider: string;
  prettySent: string;
  url: string;
  replyCount: number;
  title?: string;
}

function BottomBar({
  provider,
  prettySent,
  url,
  replyCount,
  title,
}: BottomBarProps) {
  return (
    <div className="-m-2 h-[50px]">
      <div className="hidden h-[50px] w-full border-t-2 border-gray-100 bg-white p-2 group-hover:block">
        <div className="flex flex-col">
          <span className="truncate font-semibold text-gray-800">
            {title ? title : url}
          </span>
          <div className="items center flex justify-between">
            <div className="flex items-center space-x-1 text-sm font-semibold">
              <span className="text-gray-600">{provider}</span>
              <span className="text-lg text-gray-200"> • </span>
              <span className="text-gray-400">{prettySent} ago</span>
            </div>
            <div className="flex items-center space-x-1 text-sm font-semibold text-gray-400">
              <span>{replyCount > 0 && replyCount}</span>
              <ChatSmallIcon className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeapBlock({
  curio,
  time,
}: {
  curio: HeapCurio;
  time: string;
}) {
  const [embed, setEmbed] = React.useState<any>();
  const replyCount = curio.seal.replied.length;
  const url = content[0].toString();
  const prettySent = formatDistanceToNow(sent);
  
  const { isImage, isAudio, isText, oembed, isOembed } =
    useHeapContentType(url);

  useEffect(() => {
    const getOembed = async () => {
      const oembed = await useEmbedState.getState().getEmbed(url);
      setEmbed(oembed);
    };
    getOembed();
  }, [url]);

  if (embed === undefined) {
    return <HeapLoadingBlock />;
  }

  if (isText) {
    return (
      <div className="heap-block group p-2">
        <TopBar hasIcon time={time} />
        <HeapContent className="h-full max-h-24 leading-6" content={content} />
        <BottomBar
          provider="Text"
          prettySent={prettySent}
          url={url}
          replyCount={replyCount}
          // first three words.
          title={content.toString().split(' ').slice(0, 3).join(' ')}
        />
      </div>
    );
  }

  if (isImage) {
    return (
      <div
        className="heap-block group p-2"
        style={{
          backgroundImage: `url(${url})`,
        }}
      >
        <TopBar time={time} />
        <BottomBar
          provider="Image"
          prettySent={prettySent}
          url={url}
          replyCount={replyCount}
        />
      </div>
    );
  }

  if (isAudio) {
    return (
      <div className="heap-block group p-2">
        <TopBar hasIcon time={time} />
        <div className="flex flex-col items-center justify-center">
          <MusicLargeIcon className="h-16 w-16 text-gray-300" />
        </div>
        <BottomBar
          provider="Audio"
          prettySent={prettySent}
          url={url}
          replyCount={replyCount}
        />
      </div>
    );
  }

  if (isOembed) {
    const { title, thumbnail_url: thumbnail, provider_name: provider } = embed;

    if (thumbnail) {
      return (
        <div
          className="heap-block group p-2"
          style={{
            backgroundImage: `url(${thumbnail})`,
          }}
        >
          <TopBar time={time} />
          <BottomBar
            url={url}
            provider={provider}
            prettySent={prettySent}
            replyCount={replyCount}
            title={title}
          />
        </div>
      );
    }
    if (provider === 'Twitter') {
      const author = embed.author_name;
      const twitterHandle = embed.author_url.split('/').pop();
      const twitterProfilePic = `https://unavatar.io/twitter/${twitterHandle}`;
      return (
        <div className="heap-block group p-2">
          <TopBar isTwitter time={time} />
          <div className="flex flex-col items-center justify-center">
            <img
              className="h-[46px] w-[46px] rounded-full"
              src={twitterProfilePic}
              alt={author}
            />
            <span className="font-semibold text-black">{author}</span>
            <span className="text-gray-300">@{twitterHandle}</span>
          </div>
          <BottomBar
            url={url}
            provider={provider}
            prettySent={prettySent}
            replyCount={replyCount}
          />
        </div>
      );
    }
    return (
      <div className="heap-block group p-2">
        <TopBar hasIcon time={time} />
        <div className="flex flex-col items-center justify-center">
          <LinkIcon className="h-16 w-16 text-gray-300" />
        </div>
        <BottomBar
          url={url}
          provider={provider ? provider : 'Link'}
          prettySent={prettySent}
          replyCount={replyCount}
        />
      </div>
    );
  }

  return (
    <div className="heap-block group p-2">
      <TopBar hasIcon time={time} />
      <div className="flex flex-col items-center justify-center">
        <LinkIcon className="h-16 w-16 text-gray-300" />
      </div>
      <BottomBar
        url={url}
        provider={'Link'}
        prettySent={prettySent}
        replyCount={replyCount}
      />
    </div>
  );
}
