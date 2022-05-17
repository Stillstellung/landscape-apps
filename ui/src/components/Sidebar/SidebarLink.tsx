import cn from 'classnames';
import React, { PropsWithChildren } from 'react';
import { NavLinkProps } from 'react-router-dom';
import RetainedStateLink from '../RetainedStateLink';

type SidebarProps = PropsWithChildren<{
  className?: string;
  img?: string;
}> &
  NavLinkProps;

export default function SidebarLink({
  img,
  children,
  className,
  ...rest
}: SidebarProps) {
  return (
    <li>
      <RetainedStateLink
        className={({ isActive }) =>
          cn(
            'flex items-center space-x-3 rounded-md p-2 text-base font-semibold text-gray-600 hover:bg-gray-50',
            isActive && 'bg-gray-50',
            className
          )
        }
        {...rest}
      >
        {(img || '').length > 0 ? (
          <img
            className="h-6 w-6 rounded border-2 border-transparent"
            src={img}
          />
        ) : (
          <div className="h-6 w-6 rounded border-2 border-gray-100" />
        )}
        {typeof children === 'string' ? <h3>{children}</h3> : children}
      </RetainedStateLink>
    </li>
  );
}
