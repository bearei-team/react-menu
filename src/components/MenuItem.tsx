import {getPlatformEvent, Fun} from '@bearei/react-util';
import * as React from 'react';

/**
 * 菜单项目
 */
export interface MenuItemProps {
  /**
   * 菜单项目 Key
   */
  index: string;

  /**
   * 子级
   */
  children?: JSX.Element;

  /**
   * 监听事件
   */
  onEvent?: Fun;
}

export const MenuItem: React.FC<MenuItemProps> = ({onEvent, children}) => (
  <>{children && React.cloneElement(children, getPlatformEvent(onEvent))}</>
);
