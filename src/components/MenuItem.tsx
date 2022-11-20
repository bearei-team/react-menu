import {getPlatformEvent, EventFun} from '@bearei/react-util';
import * as React from 'react';

/**
 * Menu item props.
 */
export interface MenuItemProps {
  /**
   * Index of menu items.
   */
  index: string;
  children?: JSX.Element;

  /**
   * Menu items listen for events.
   */
  onEvent?: EventFun;
}

export const MenuItem: React.FC<MenuItemProps> = ({onEvent, children}) => (
  <>{children && React.cloneElement(children, getPlatformEvent(onEvent))}</>
);
