import type * as client from '@tloncorp/shared/dist/client';
import type { Story } from '@tloncorp/shared/dist/urbit/channel';

export const createSimpleContent = (str: string): string => {
  return JSON.stringify([
    {
      inline: [str],
    },
  ] as Story);
};

export const emptyContact: client.Contact = {
  id: '',
  nickname: null,
  bio: null,
  color: null,
  avatarImage: null,
  status: null,
  coverImage: null,
  pinnedGroupIds: [''],
};

export const galenContact: client.Contact = {
  ...emptyContact,
  id: '~ravmel-ropdyl',
  nickname: 'galen',
  color: '#CCCCCC',
};

export const jamesContact: client.Contact = {
  ...emptyContact,
  id: '~rilfun-lidlen',
  nickname: 'james',
};

export const danContact: client.Contact = {
  ...emptyContact,
  id: '~solfer-magfed',
  nickname: 'Dan',
  color: '#FFFF99',
};

export const hunterContact: client.Contact = {
  ...emptyContact,
  id: '~nocsyx-lassul',
  nickname: '~nocsyx-lassul ⚗️',
  color: '#5200FF',
};

export const brianContact: client.Contact = {
  ...emptyContact,
  id: '~latter-bolden',
  nickname: 'brian',
  avatarImage:
    'https://d2w9rnfcy7mm78.cloudfront.net/24933700/original_92dc8654172254b5422d0d6249270afe.png?1701105163?bc=0',
};

export const markContact: client.Contact = {
  ...emptyContact,
  id: '~palfun-foslup',
  color: '#2AA779',
};

export const initialContacts: Record<string, client.Contact> = {
  '~ravmel-ropdyl': galenContact,
  '~rilfun-lidlen': jamesContact,
  '~solfer-magfed': danContact,
  '~nocsyx-lassul': hunterContact,
  '~latter-bolden': brianContact,
  '~palfun-foslup': markContact,
};

export const group: client.Group = {
  id: '~nibset-napwyn/tlon',
  title: 'Tlon Local',
  members: [
    {
      id: '~ravmel-ropdyl',
      roles: ['admin'],
      joinedAt: 0,
    },
    {
      id: '~rilfun-lidlen',
      roles: [''],
      joinedAt: 0,
    },
    {
      id: '~solfer-magfed',
      roles: [''],
      joinedAt: 0,
    },
    {
      id: '~nocsyx-lassul',
      roles: ['admin'],
      joinedAt: 0,
    },
    {
      id: '~latter-bolden',
      roles: [''],
      joinedAt: 0,
    },
  ],
  isSecret: false,
};

export const fakeContent: Record<string, client.Post['content']> = {
  yo: createSimpleContent('yo'),
  hey: createSimpleContent('hey'),
  lol: createSimpleContent('lol'),
  sup: createSimpleContent('sup'),
  hi: createSimpleContent('hi'),
  hello: createSimpleContent('hello'),
  howdy: createSimpleContent('howdy'),
  greetings: createSimpleContent('greetings'),
  salutations: createSimpleContent('salutations'),
  why: createSimpleContent('why?'),
  what: createSimpleContent('what?'),
  where: createSimpleContent('where?'),
  when: createSimpleContent('when?'),
  how: createSimpleContent('how?'),
  who: createSimpleContent('who?'),
  whom: createSimpleContent('whom?'),
  whose: createSimpleContent('whose?'),
  '😧': createSimpleContent('😧'),
  '😨': createSimpleContent('😨'),
  '😩': createSimpleContent('😩'),
  '😪': createSimpleContent('😪'),
};

export const tlonLocalChannel: client.Channel = {
  id: '~nibset-napwyn/intros',
  title: 'Intros',
  group,
};

const getRandomFakeContent = () => {
  const keys = Object.keys(fakeContent);
  return fakeContent[keys[Math.floor(Math.random() * keys.length)]];
};

const getRandomFakeContact = () => {
  const keys = Object.keys(initialContacts);
  return initialContacts[keys[Math.floor(Math.random() * keys.length)]];
};

export const createFakePost = (): client.Post => {
  const ship = getRandomFakeContact().id;
  const id = Math.random().toString(36).substring(7);
  // timestamp on same day
  const randomSentAtSameDay = new Date(
    new Date().getTime() - Math.floor(Math.random() * 10000000)
  ).toISOString();

  return {
    id: `${ship}-${id}`,
    author: getRandomFakeContact(),
    channel: tlonLocalChannel,
    content: getRandomFakeContent(),
    sentAt: randomSentAtSameDay,
    replyCount: 0,
    type: 'chat',
    group,
  };
};

export const createFakePosts = (count: number): client.Post[] => {
  const posts = [];
  for (let i = 0; i < count; i++) {
    posts.push(createFakePost());
  }

  // sort by timestamp
  posts.sort((a, b) => {
    return new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime();
  });

  return posts;
};
