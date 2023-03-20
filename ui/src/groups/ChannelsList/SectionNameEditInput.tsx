import React, { useState } from 'react';
import { useGroupState, useRouteGroup } from '@/state/groups';
import { strToSym } from '@/logic/utils';
import { useForm } from 'react-hook-form';
import { GroupMeta } from '@/types/groups';
import { ChannelListItem } from '@/groups/ChannelsList/types';
import { Status } from '@/logic/status';

interface HandleSectionNameEditInputProps {
  handleEditingChange: () => void;
  onSectionEditNameSubmit: (
    currentSectionKey: string,
    nextSectionTitle: string
  ) => void;
  sectionTitle: string;
  isNew?: boolean;
  channels: ChannelListItem[];
  sectionKey: string;
  saveStatus: Status;
  setSaveStatus: (status: Status) => void;
}

export default function SectionNameEditInput({
  handleEditingChange,
  onSectionEditNameSubmit,
  channels,
  isNew,
  sectionTitle,
  sectionKey,
  saveStatus,
  setSaveStatus,
}: HandleSectionNameEditInputProps) {
  const group = useRouteGroup();

  const defaultValues: GroupMeta = {
    title: sectionTitle || '',
    description: '',
    image: '',
    cover: '',
  };

  const untitledSectionValues: GroupMeta = {
    title: 'New Section',
    description: '',
    image: '',
    cover: '',
  };

  const { handleSubmit, register, getValues } = useForm({
    defaultValues,
  });

  const onSubmit = async (values: GroupMeta) => {
    setSaveStatus('loading');
    const zoneFlag = strToSym(sectionKey);
    const titleExists = values.title.trim() !== '';
    handleEditingChange();
    try {
      if (isNew === true) {
        await useGroupState
          .getState()
          .createZone(
            group,
            zoneFlag,
            titleExists ? values : untitledSectionValues
          );
        await useGroupState.getState().moveZone(group, zoneFlag, 1);
      } else {
        await useGroupState
          .getState()
          .editZone(
            group,
            zoneFlag,
            titleExists ? values : untitledSectionValues
          );
      }
      onSectionEditNameSubmit(
        zoneFlag,
        titleExists ? values.title : untitledSectionValues.title
      );
      setSaveStatus('success');
    } catch (e) {
      setSaveStatus('error');
      console.log(e);
    }
  };

  const onLoseFocus = async () => {
    const values = getValues();
    onSubmit(values);
  };

  return (
    <form
      className="flex w-full items-center"
      onSubmit={handleSubmit(onSubmit)}
      onBlur={handleSubmit(onLoseFocus)}
    >
      <input
        autoFocus
        {...register('title')}
        type="text"
        placeholder="New Section"
        className="input alt-highlight w-full border-gray-200 bg-transparent text-lg font-semibold focus:bg-transparent"
      />
    </form>
  );
}
