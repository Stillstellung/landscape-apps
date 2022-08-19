import React, { ComponentType } from 'react';
import { Bin, useNotifications } from './useNotifications';

interface NotificationsProps {
  child: ComponentType<{ bin: Bin }>;
}

export default function Notifications({
  child: Notification,
}: NotificationsProps) {
  const { notifications } = useNotifications();

  return (
    <section className="w-full p-6">
      {notifications.map((grouping) => (
        <>
          <h2 className="mt-8 mb-4 text-lg font-bold text-gray-400">
            {grouping.date}
          </h2>
          <ul className="space-y-2">
            {grouping.bins.map((b) => (
              <li key={b.time}>
                <Notification bin={b} />
              </li>
            ))}
          </ul>
        </>
      ))}
    </section>
  );
}