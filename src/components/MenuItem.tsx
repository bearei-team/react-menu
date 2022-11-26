import type {HandleEvent} from '@bearei/react-util/lib/event';
import handleEvent from '@bearei/react-util/lib/event';
import type {ReactNode, Ref, TouchEvent} from 'react';
import {useId} from 'react';
import type {GestureResponderEvent} from 'react-native';
import type {BaseMenuProps} from './Menu';

export interface BaseMenuItemProps<T = HTMLElement>
  extends Pick<
    BaseMenuProps<T>,
    'mode' | 'tooltip' | 'expandIcon' | 'selectedKeys'
  > {
  ref?: Ref<T>;

  /**
   * Menu item show label
   */
  label?: string;

  /**
   * Menu item key
   */
  key?: string;

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
export interface MenuItemProps<T> extends BaseMenuItemProps<T> {
  /**
   * Render the menu item icon
   */
  renderIcon?: (props: MenuItemIconProps<T>) => ReactNode;

  /**
   * Render the menu item expansion icon
   */
  renderExpandIcon?: (props: MenuItemExpandIconProps<T>) => ReactNode;

  /**
   * Render the menu item main
   */
  renderMain?: (props: MenuItemMainProps<T>) => ReactNode;

  /**
   * Render the menu item container
   */
  renderContainer?: (props: MenuItemContainerProps<T>) => ReactNode;
}

/**
 * Menu item children props
 */
export interface MenuItemChildrenProps<T>
  extends Omit<
    MenuItemProps<T>,
    | 'ref'
    | 'icon'
    | 'expandIcon'
    | 'tooltip'
    | 'renderMain'
    | 'renderIcon'
    | 'renderContainer'
    | 'renderExpandIcon'
  > {
  children?: ReactNode;

  /**
   * Used to handle some common default events
   */
  handleEvent: HandleEvent;
}

export type MenuItemClickEvent<T> = React.MouseEvent<T, MouseEvent>;
export type MenuItemTouchEvent<T> = TouchEvent<T>;
export type MenuItemPressEvent = GestureResponderEvent;

export type MenuItemIconProps<T> = MenuItemChildrenProps<T>;
export type MenuItemExpandIconProps<T> = MenuItemChildrenProps<T>;
export type MenuItemMainProps<T> = MenuItemChildrenProps<T>;

export interface MenuItemContainerProps<T>
  extends Omit<MenuItemChildrenProps<T> & Pick<MenuItemProps<T>, 'ref'>, ''> {
  /**
   * The unique ID of the component
   */
  id: string;
}

function MenuItem<T>({
  ref,
  icon,
  expandIcon,
  disabled,
  loading,
  onClick,
  onPress,
  onTouchEnd,
  renderIcon,
  renderMain,
  renderContainer,
  ...props
}: MenuItemProps<T>) {
  const id = useId();
  const childrenProps = {...props, loading, disabled, handleEvent};

  function handleCallback<E>(callback: (e: E) => void) {
    const response = !disabled && !loading;

    return (e: E) => response && callback(e);
  }

  const handleClick = handleCallback((e: MenuItemClickEvent<T>) =>
    onClick?.(e),
  );

  const handleTouchEnd = handleCallback((e: MenuItemTouchEvent<T>) =>
    onTouchEnd?.(e),
  );

  const handPress = handleCallback((e: MenuItemPressEvent) => onPress?.(e));
  const expandIconNode =
    expandIcon && renderIcon?.({...childrenProps, children: expandIcon});

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
      id,
      children: main,
      ...(onClick ? {onClick: handleEvent(handleClick)} : undefined),
      ...(onTouchEnd ? {onTouchEnd: handleEvent(handleTouchEnd)} : undefined),
      ...(onPress ? {onPress: handleEvent(handPress)} : undefined),
    }) ?? main;

  return <>{container}</>;
}

export default MenuItem;
