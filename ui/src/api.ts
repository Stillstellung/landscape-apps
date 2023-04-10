/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
import type UrbitMock from '@tloncorp/mock-http-api';
import Urbit, {
  PokeInterface,
  Scry,
  SubscriptionRequestInterface,
  Thread,
} from '@urbit/http-api';
import { useLocalState } from '@/state/local';
import { UrbitHttpApiEvent, UrbitHttpApiEventType } from '@urbit/http-api';
import _ from 'lodash';
import create from 'zustand';

export const IS_MOCK =
  import.meta.env.MODE === 'mock' || import.meta.env.MODE === 'staging';
const URL = (import.meta.env.VITE_MOCK_URL ||
  import.meta.env.VITE_VERCEL_URL) as string;

let client = undefined as unknown as Urbit | UrbitMock;

const { errorCount, airLockErrorCount } = useLocalState.getState();

type Hook = (event: any, mark: string) => boolean;

interface Watcher {
  id: string;
  hook: Hook;
  resolve: (value: void | PromiseLike<void>) => void;
  reject: (reason?: any) => void;
}

interface SubscriptionState {
  watchers: {
    [path: string]: Watcher[];
  };
  track: (path: string, hook: Hook) => Promise<void>;
  remove: (path: string, id: string) => void;
  subscriptions: string[];
  subscribe: (params: SubscriptionRequestInterface) => Promise<void>;
}

export const useSubscriptionState = create<SubscriptionState>((set, get) => ({
  watchers: {},
  track: (path, hook) =>
    new Promise((resolve, reject) => {
      set((draft) => {
        draft.watchers[path] = [
          ...(draft.watchers[path] || []),
          {
            id: _.uniqueId(),
            hook,
            resolve,
            reject,
          },
        ];
      });
    }),
  remove: (path, id) => {
    set((draft) => {
      draft.watchers[path] = (draft.watchers[path] || []).filter(
        (w) => w.id === id
      );
    });
  },
  subscriptions: [],
  subscribe: async ({ app, path, event }) => {
    if (get().subscriptions.includes(`${app}:${path}`)) {
      console.log('already subscribed to', app, path);
      return Promise.resolve();
    }
    set((draft) => {
      draft.subscriptions.push(`${app}:${path}`);
    });
    await api.subscribe({ app, path, event });
    return Promise.resolve();
  },
}));

async function setupAPI() {
  if (IS_MOCK) {
    window.ship = 'finned-palmer';
    window.our = `~${window.ship}`;
    window.desk = 'groups';
    const MockUrbit = (await import('@tloncorp/mock-http-api')).default;
    const mockHandlers = (await import('./mocks/handlers')).default;

    if (!client) {
      const api = new MockUrbit(mockHandlers, URL || '', '');
      api.ship = window.ship;
      api.verbose = true;
      client = api;
    }

    return;
  }

  if (!client) {
    const api = new Urbit('', '', window.desk);
    api.ship = window.ship;
    api.verbose = import.meta.env.DEV;
    client = api;
  }

  (client as Urbit).onReconnect = () => {
    console.log('reconnecting!');
  };

  client.onRetry = () => {
    useLocalState.setState((state) => ({
      subscription: 'reconnecting',
      errorCount: state.errorCount + 1,
    }));
  };

  client.onError = () => {
    (async () => {
      useLocalState.setState((state) => ({
        airLockErrorCount: state.airLockErrorCount + 1,
        subscription: 'disconnected',
      }));
    })();
  };
}

const api = {
  async scry<T>(params: Scry) {
    if (!client) {
      await setupAPI();
    }

    return client.scry<T>(params);
  },
  async poke<T>(params: PokeInterface<T>) {
    try {
      if (!client) {
        await setupAPI();
      }

      const clientPoke = await client.poke<T>(params);
      useLocalState.setState({ subscription: 'connected', errorCount: 0 });

      return clientPoke;
    } catch (e) {
      useLocalState.setState((state) => ({ errorCount: state.errorCount + 1 }));
      throw e;
    }
  },
  async subscribe(params: SubscriptionRequestInterface) {
    const eventListener =
      (listener?: (event: any, mark: string) => void) =>
      (event: any, mark: string) => {
        const { watchers, remove } = useSubscriptionState.getState();
        const path = params.app + params.path;
        const relevantWatchers = watchers[path];

        if (relevantWatchers) {
          relevantWatchers.forEach((w) => {
            if (w.hook(event, mark)) {
              w.resolve();
              remove(path, w.id);
            }
          });
        }

        if (listener) {
          listener(event, mark);
        }
      };

    try {
      if (!client) {
        await setupAPI();
      }

      const clientSubscribe = await client.subscribe({
        ...params,
        event: eventListener(params.event),
        quit: () => {
          client.subscribe({ ...params, event: eventListener(params.event) });
        },
      });
      useLocalState.setState({ subscription: 'connected', errorCount: 0 });
      return clientSubscribe;
    } catch (e) {
      useLocalState.setState((state) => ({ errorCount: state.errorCount + 1 }));
      throw e;
    }
  },
  async subscribeOnce<T>(app: string, path: string, timeout?: number) {
    try {
      if (!client) {
        await setupAPI();
      }

      const clientPoke = await client.subscribeOnce<T>(app, path, timeout);
      useLocalState.setState({ subscription: 'connected', errorCount: 0 });

      return clientPoke;
    } catch (e) {
      useLocalState.setState((state) => ({ errorCount: state.errorCount + 1 }));
      throw e;
    }
  },
  async thread<Return, T>(params: Thread<T>) {
    try {
      if (!client) {
        await setupAPI();
      }

      const clientThread = await client.thread<Return, T>(params);
      useLocalState.setState({ subscription: 'connected', errorCount: 0 });
      return clientThread;
    } catch (e) {
      useLocalState.setState((state) => ({ errorCount: state.errorCount + 1 }));
      throw e;
    }
  },
  async unsubscribe(id: number) {
    try {
      if (!client) {
        await setupAPI();
      }

      const clientUnsubscribe = await client.unsubscribe(id);
      useLocalState.setState({ subscription: 'connected', errorCount: 0 });
      return clientUnsubscribe;
    } catch (e) {
      useLocalState.setState((state) => ({ errorCount: state.errorCount + 1 }));
      throw e;
    }
  },
  reset() {
    client.reset();
  },
  on<T extends UrbitHttpApiEventType>(
    event: T,
    callback: (data: UrbitHttpApiEvent[T]) => void
  ) {
    (client as Urbit).on(event, callback);
  },
} as unknown as Urbit;

export default api;
