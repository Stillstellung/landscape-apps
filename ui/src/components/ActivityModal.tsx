import { useDismissNavigate, useModalNavigate } from '@/logic/routing';
import * as Collapsible from '@radix-ui/react-collapsible';
import { useLocation } from 'react-router-dom';
import {
  useLogActivityMutation,
  usePutEntryMutation,
  useShowActivityMessage,
} from '@/state/settings';
import { useGroups } from '@/state/groups';
import React, { useEffect } from 'react';
import { isHosted } from '@/logic/utils';
import { PrivacyContents } from '@/groups/PrivacyNotice';
import Dialog from './Dialog';

export function ActivityChecker() {
  const location = useLocation();
  const navigate = useModalNavigate();
  const groups = useGroups();
  const showActivityMessage = useShowActivityMessage();

  useEffect(() => {
    if (
      Object.keys(groups).length > 0 &&
      showActivityMessage &&
      location.pathname !== '/activity-collection' &&
      !(location.state && 'backgroundLocation' in location.state)
    ) {
      navigate('/activity-collection', {
        state: { backgroundLocation: location },
        replace: true,
      });
    }
  }, [groups, showActivityMessage, navigate, location]);

  return null;
}

export default function ActivityModal() {
  const { state } = useLocation();
  const dismiss = useDismissNavigate();
  const [open, setOpen] = React.useState(false);
  const { mutate: toggleLogActivity } = useLogActivityMutation();
  const { mutate } = usePutEntryMutation({
    bucket: 'groups',
    key: 'showActivityMessage',
  });
  const onContinue =
    (action: 'ignore' | 'disable' | 'enable', nav = true) =>
    async () => {
      if (action !== 'ignore') {
        toggleLogActivity(action === 'enable');
      }

      // stop showing message and nav away
      await mutate({ val: false });
      dismiss();
    };

  return (
    <Dialog
      open
      modal
      close="none"
      className="h-[90vh] w-[90vw] overflow-hidden p-0 sm:h-[75vh] sm:max-h-[800px] sm:w-[75vw] sm:max-w-[800px]"
      onInteractOutside={(e) => e.preventDefault()}
    >
      <div className="flex h-full w-full flex-col">
        <header className="flex items-center space-x-2 border-b-2 border-b-gray-50 p-4">
          <h1 className="font-semibold">Activity Collection</h1>
        </header>
        <section className="flex min-h-0 flex-1 flex-col p-4">
          <div className="mx-auto mb-6 flex max-w-[650px] flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <div className="prose py-4 dark:prose-invert">
              <h2>Hello out there. This is a data collection notice.</h2>
              <p>Self-hosted? You're opted out by default.</p>
              <p>
                Hosted by Tlon? To continue building products you like using, we
                track some of your interactions with public groups on Landscape.
                We never track the content of your interactions. You can always
                opt out.{' '}
                <button
                  className="default-focus text-blue underline underline-offset-2"
                  onClick={() => setOpen((o) => !o)}
                >
                  {open ? 'Hide privacy statement.' : 'Learn more here.'}
                </button>
              </p>
              <Collapsible.Root open={open} onOpenChange={setOpen}>
                <Collapsible.Content>
                  <PrivacyContents />
                </Collapsible.Content>
              </Collapsible.Root>
            </div>
          </div>
          <footer className="mt-auto flex items-center justify-end space-x-2 self-stretch">
            {isHosted ? (
              <>
                <button
                  className="secondary-button"
                  onClick={onContinue('disable')}
                >
                  Disable
                </button>
                <button className="button" onClick={onContinue('enable')}>
                  Enable and Continue
                </button>
              </>
            ) : (
              <>
                <button
                  className="secondary-button"
                  onClick={onContinue('enable')}
                >
                  Enable
                </button>
                <button className="button" onClick={onContinue('ignore')}>
                  Ignore and Continue
                </button>
              </>
            )}
          </footer>
        </section>
      </div>
    </Dialog>
  );
}
