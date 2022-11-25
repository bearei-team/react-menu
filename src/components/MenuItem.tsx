import type {GestureResponderEvent, ViewProps} from 'react-native';
import type {
  ReactNode,
  TouchEvent,
  Ref,
  DetailedHTMLProps,
  HTMLAttributes,
} from 'react';
import type {HandleEvent} from '@bearei/react-util/lib/event';
import handleEvent from '@bearei/react-util/lib/event';
import {useId} from 'react';

export interface BaseMenuItemProps<T = HTMLElement>
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & ViewProps,
    'ref' | 'onClick' | 'onTouchEnd' | 'onPress'
  > {
  /**
   * Custom menu item ref
   */
  ref?: Ref<T>;

  /**
   * Menu item to display label
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
   * Custom menu item icon
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
   * The contents of a menu item prompt
   */
  tooltip?: ReactNode;

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
   * Render the menu item main
   */
  renderMain?: (props: MenuItemMainProps<T>) => ReactNode;

  /**
   * Render the menu item container
   */
  renderContainer?: (props: ButtonContainerProps<T>) => ReactNode;
}

/**
 * Menu item children props
 */
export interface MenuItemChildrenProps<T>
  extends Omit<
    MenuItemProps<T>,
    'renderMain' | 'renderIcon' | 'renderContainer' | 'ref' | 'icon'
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
export type MenuItemMainProps<T> = MenuItemChildrenProps<T>;

export interface ButtonContainerProps<T> extends MenuItemChildrenProps<T> {
  ref?: Ref<T>;

  /**
   * Unique ID of card component
   */
  id: string;
}

function MenuItem<T>({
  ref,
  icon,
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
  const childrenProps = {...props, loading, disabled, id, handleEvent};

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
  const iconElement = (
    <>{icon && renderIcon?.({...childrenProps, children: icon})}</>
  );

  const mainElement = (
    <>
      {iconElement}
      {renderMain?.({...childrenProps, disabled, loading})}
    </>
  );

  const containerElement = (
    <>
      {renderContainer?.({
        ...childrenProps,
        ref,
        children: mainElement,
        ...(onClick ? {onClick: handleEvent(handleClick)} : undefined),
        ...(onTouchEnd ? {onTouchEnd: handleEvent(handleTouchEnd)} : undefined),
        ...(onPress ? {onPress: handleEvent(handPress)} : undefined),
      }) ?? mainElement}
    </>
  );

  return <>{containerElement}</>;
}

export default MenuItem;
