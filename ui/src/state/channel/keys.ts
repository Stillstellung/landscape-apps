import { nestToFlag } from '@/logic/utils';

export const channelKey = (...parts: string[]) => ['channel', ...parts];

export const infinitePostsKey = (nest: string) => {
  const [han, flag] = nestToFlag(nest);
  return [han, 'posts', flag, 'infinite'];
};

export const ChannnelKeys = {
  channel: channelKey,
  infinitePostsKey,
};

export default channelKey;
