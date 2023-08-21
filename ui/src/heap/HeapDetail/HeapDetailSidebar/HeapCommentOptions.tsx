import { useCallback, useState } from 'react';
import { useParams } from 'react-router';
import { useCopy, canWriteChannel } from '@/logic/utils';
import { useAmAdmin, useGroup, useRouteGroup, useVessel } from '@/state/groups';
import { useChatPerms } from '@/state/chat';
import IconButton from '@/components/IconButton';
import FaceIcon from '@/components/icons/FaceIcon';
import XIcon from '@/components/icons/XIcon';
import CopyIcon from '@/components/icons/CopyIcon';
import CheckIcon from '@/components/icons/CheckIcon';
import EmojiPicker from '@/components/EmojiPicker';
import ConfirmationModal from '@/components/ConfirmationModal';
import useRequestState from '@/logic/useRequestState';
import { HeapCurio } from '@/types/heap';
import {
  useAddCurioFeelMutation,
  useDelCurioMutation,
} from '@/state/heap/heap';
import { useIsMobile } from '@/logic/useMedia';

export default function HeapCommentOptions(props: {
  whom: string;
  curio: HeapCurio;
  parentTime: string;
  time: string;
  hideReply?: boolean;
}) {
  const { whom, curio, time, hideReply, parentTime } = props;
  const groupFlag = useRouteGroup();
  const isAdmin = useAmAdmin(groupFlag);
  const { didCopy, doCopy } = useCopy(
    `/1/chan/heap/${whom}/curio/${parentTime}/${time}`
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const {
    isPending: isDeletePending,
    setPending: setDeletePending,
    setReady,
  } = useRequestState();
  const { chShip, chName } = useParams();
  const chFlag = `${chShip}/${chName}`;
  const perms = useChatPerms(chFlag);
  const vessel = useVessel(groupFlag, window.our);
  const group = useGroup(groupFlag);
  const canWrite = canWriteChannel(perms, vessel, group?.bloc);
  const isMobile = useIsMobile();
  const { mutateAsync: addFeel } = useAddCurioFeelMutation();
  const { mutateAsync: delCurio } = useDelCurioMutation();

  const onDelete = async () => {
    setDeletePending();
    try {
      await delCurio({ flag: whom, time });
    } catch (e) {
      console.log('Failed to delete message', e);
    }
    setReady();
  };

  const onCopy = useCallback(() => {
    doCopy();
  }, [doCopy]);

  const reply = useCallback(() => {
    // useChatStore.getState().reply(whom, curio.seal.id);
  }, []);

  const onEmoji = useCallback(
    async (emoji: { shortcodes: string }) => {
      await addFeel({
        flag: whom,
        time,
        feel: emoji.shortcodes,
        replying: curio.heart.replying || undefined,
      });
      setPickerOpen(false);
    },
    [time, whom, addFeel, curio.heart.replying]
  );

  const openPicker = useCallback(() => setPickerOpen(true), [setPickerOpen]);

  return (
    <div className="absolute right-2 -top-7 z-40 flex space-x-0.5 rounded-lg border border-gray-100 bg-white p-[1px] align-middle opacity-0 group-one-hover:opacity-100">
      {canWrite && !isMobile ? (
        <EmojiPicker
          open={pickerOpen}
          setOpen={setPickerOpen}
          onEmojiSelect={onEmoji}
          withTrigger={false}
        >
          <IconButton
            icon={<FaceIcon className="h-6 w-6 text-gray-400" />}
            label="React"
            showTooltip
            action={openPicker}
          />
        </EmojiPicker>
      ) : null}
      {/*
      !curio.memo.replying && curio.memo.replying?.length !== 0 && !hideReply ? (
        <>
          TODO: Add replies back in post-demo.
          <IconButton
            icon={<BubbleIcon className="h-6 w-6 text-gray-400" />}
            label="Reply"
            showTooltip
            action={reply}
          />

          <IconButton
            icon={<HashIcon className="h-6 w-6 text-gray-400" />}
            label="Start Thread"
            showTooltip
            action={() => navigate(`message/${curio.seal.id}`)}
          />
        </>
      ) : null
      */}
      {groupFlag ? (
        <IconButton
          icon={
            didCopy ? (
              <CheckIcon className="h-6 w-6 text-gray-400" />
            ) : (
              <CopyIcon className="h-6 w-6 text-gray-400" />
            )
          }
          label="Copy"
          showTooltip
          action={onCopy}
        />
      ) : null}
      {/* <IconButton
        icon={<ShareIcon className="h-6 w-6 text-gray-400" />}
        label="Send to..."
        showTooltip
        action={() => console.log('send to..')}
      /> */}
      {isAdmin || window.our === curio.heart.author ? (
        <IconButton
          icon={<XIcon className="h-6 w-6 text-red" />}
          label="Delete"
          showTooltip
          action={() => setDeleteOpen(true)}
        />
      ) : null}

      {/* <IconButton
        icon={<EllipsisIcon className="h-6 w-6 text-gray-400" />}
        label="More..."
        showTooltip
        action={() => console.log('More...')}
      /> */}
      <ConfirmationModal
        title="Delete Message"
        message="Are you sure you want to delete this message?"
        onConfirm={onDelete}
        open={deleteOpen}
        setOpen={setDeleteOpen}
        confirmText="Delete"
        loading={isDeletePending}
      />
    </div>
  );
}
