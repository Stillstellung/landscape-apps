import type * as db from '@tloncorp/shared/dist/db';
import { useLongPress } from '@uidotdev/usehooks';

import type { ListItemProps } from '../ListItem';
import ListItemContent from './ListItemContent';

export const GroupListItem = ({
  model,
  onPress,
  onLongPress,
  unreadCount,
  ...props
}: ListItemProps<db.Group>) => {
  // TODO: Figure out if this is necessary. Why can't we use Tamagui's long press handler?
  const attributes = useLongPress(
    () => {
      onLongPress?.(model);
    },
    { threshold: 600 }
  );

  return (
    <div {...attributes}>
      <ListItemContent
        model={model}
        onPress={onPress}
        unreadCount={unreadCount}
        {...props}
      />
    </div>
  );
};
