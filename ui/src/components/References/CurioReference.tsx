import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { useHeapState, useRemoteCurio } from '@/state/heap/heap';
import HeapLoadingBlock from '@/heap/HeapLoadingBlock';
// eslint-disable-next-line import/no-cycle
import HeapBlock from '@/heap/HeapBlock';
import { useChannelPreview, useGang } from '@/state/groups';
import bigInt from 'big-integer';
import useGroupJoin from '@/groups/useGroupJoin';
import { useLocation, useNavigate } from 'react-router';
import useNavigateByApp from '@/logic/useNavigateByApp';
import ReferenceBar from './ReferenceBar';

function CurioReference({
  chFlag,
  nest,
  idCurio,
  idCurioComment,
  isScrolling = false,
}: {
  chFlag: string;
  nest: string;
  idCurio: string;
  idCurioComment?: string;
  isScrolling?: boolean;
}) {
  const curio = useRemoteCurio(chFlag, idCurio, isScrolling);
  const curioComment = useRemoteCurio(
    chFlag,
    idCurioComment || '',
    isScrolling
  );
  const preview = useChannelPreview(nest, isScrolling);
  const location = useLocation();
  const navigate = useNavigate();
  const navigateByApp = useNavigateByApp();
  const groupFlag = preview?.group?.flag || '~zod/test';
  const gang = useGang(groupFlag);
  const { group } = useGroupJoin(groupFlag, gang);
  const refToken = preview?.group
    ? `${preview.group.flag}/channels/${nest}/curio/${idCurio}`
    : undefined;

  const handleOpenReferenceClick = () => {
    if (!group) {
      navigate(`/gangs/${groupFlag}?type=curio&nest=${nest}&id=${idCurio}`, {
        state: { backgroundLocation: location },
      });
      return;
    }
    navigateByApp(`/groups/${groupFlag}/channels/${nest}/curio/${idCurio}`);
  };

  if (!curio) {
    return <HeapLoadingBlock reference />;
  }
  return (
    <div
      className={cn('heap-inline-block not-prose group', {
        'heap-inline-block': !idCurioComment,
        'writ-inline-block': !!idCurioComment,
      })}
    >
      <div
        onClick={handleOpenReferenceClick}
        className={cn(
          'flex h-full cursor-pointer flex-col justify-between',
          idCurioComment ? 'p-6' : 'p-2'
        )}
      >
        <HeapBlock
          curio={curioComment || curio}
          time={idCurioComment || idCurio}
          isComment={!!idCurioComment}
          refToken={refToken}
          asRef
        />
      </div>
      <ReferenceBar
        nest={nest}
        time={bigInt(idCurio)}
        author={curio.heart.author}
        groupFlag={preview?.group.flag}
        groupImage={group?.meta.image}
        groupTitle={preview?.group.meta.title}
        channelTitle={preview?.meta?.title}
      />
    </div>
  );
}

export default React.memo(CurioReference);
