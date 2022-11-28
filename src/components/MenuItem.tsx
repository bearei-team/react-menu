import type {HandleEvent} from '@bearei/react-util/lib/event';
import handleEvent from '@bearei/react-util/lib/event';
import type {
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
  Ref,
  TouchEvent,
} from 'react';
import {useId} from 'react';
import type {GestureResponderEvent, ViewProps} from 'react-native';
import type {BaseMenuProps} from './Menu';

export interface BaseMenuItemProps<T, E>
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<T>, T> &
      ViewProps &
      Pick<
        BaseMenuProps<T, E>,
        'mode' | 'tooltip' | 'expandIcon' | 'selectedKeys'
      >,
    'onClick' | 'onTouchEnd' | 'onPress'
  > {
  ref?: Ref<T>;

  /**
   * Menu item show label
   */
  label?: string;

  /**
   * Menu item index
   */
  index?: string;

  /**
   * Menu item icon
   */
  icon?: ReactNode;

  /**
   * Whether or not to disable the menu item
   */
  disabled?: boolean;

  /**
   * Whether the menu item is loading
   */
  loading?: boolean;

  /**
   * A callback when a menu item is clicked
   */
  onClick?: (e: MenuItemClickEvent<T>) => void;

  /**
   * A callback for pressing a menu item
   */
  onTouchEnd?: (e: MenuItemTouchEvent<T>) => void;

  /**
   * A callback for pressing a menu item -- react native
   */
  onPress?: (e: MenuItemPressEvent) => void;
}

/**
 * Menu item props
 */
export interface MenuItemProps<T, E> extends BaseMenuItemProps<T, E> {
  /**
   * Render the menu item icon
   */
  renderIcon?: (props: MenuItemIconProps<T, E>) => ReactNode;

  /**
   * Render the menu item expansion icon
   */
  renderExpandIcon?: (props: MenuItemExpandIconProps<T, E>) => ReactNode;

  /**
   * Render the menu item main
   */
  renderMain?: (props: MenuItemMainProps<T, E>) => ReactNode;

  /**
   * Render the menu item container
   */
  renderContainer?: (props: MenuItemContainerProps<T, E>) => ReactNode;
}

/**
 * Menu item children props
 */
export interface MenuItemChildrenProps<T, E>
  extends Omit<
    BaseMenuItemProps<T, E>,
    'ref' | 'icon' | 'expandIcon' | 'tooltip'
  > {
  /**
   * The unique ID of the component
   */
  id: string;
  children?: ReactNode;

  /**
   * Used to handle some common default events
   */
  handleEvent: HandleEvent;
}

export type MenuItemClickEvent<T> = React.MouseEvent<T, MouseEvent>;
export type MenuItemTouchEvent<T> = TouchEvent<T>;
export type MenuItemPressEvent = GestureResponderEvent;

export type MenuItemIconProps<T, E> = MenuItemChildrenProps<T, E>;
export type MenuItemExpandIconProps<T, E> = MenuItemChildrenProps<T, E>;
export type MenuItemMainProps<T, E> = MenuItemChildrenProps<T, E>;
export type MenuItemContainerProps<T, E> = MenuItemChildrenProps<T, E> &
  Pick<BaseMenuItemProps<T, E>, 'ref'>;

function MenuItem<T, E = React.MouseEvent<T, MouseEvent>>({
  ref,
  icon,
  expandIcon,
  disabled,
  loading,
  onClick,
  onPress,
  onTouchEnd,
  renderExpandIcon,
  renderIcon,
  renderMain,
  renderContainer,
  ...props
}: MenuItemProps<T, E>) {
  const id = useId();
  const childrenProps = {...props, loading, disabled, id, handleEvent};

  function handleCallback<C>(callback: (e: C) => void) {
    const response = !disabled && !loading;

    return (e: C) => response && callback(e);
  }

  const handleClick = handleCallback((e: MenuItemClickEvent<T>) =>
    onClick?.(e),
  );

  const handleTouchEnd = handleCallback((e: MenuItemTouchEvent<T>) =>
    onTouchEnd?.(e),
  );

  const handPress = handleCallback((e: MenuItemPressEvent) => onPress?.(e));
  const expandIconNode =
    expandIcon && renderExpandIcon?.({...childrenProps, children: expandIcon});

  const iconNode = icon && renderIcon?.({...childrenProps, children: icon});
  const main = (
    <>
      {iconNode}
      {renderMain?.({...childrenProps, disabled, loading})}
      {expandIconNode}
    </>
  );

  const container =
    renderContainer?.({
      ...childrenProps,
      ref,
      children: main,
      ...(onClick ? {onClick: handleEvent(handleClick)} : undefined),
      ...(onTouchEnd ? {onTouchEnd: handleEvent(handleTouchEnd)} : undefined),
      ...(onPress ? {onPress: handleEvent(handPress)} : undefined),
    }) ?? main;

  return <>{container}</>;
}

export default MenuItem;
