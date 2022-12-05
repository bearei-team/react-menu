import {bindEvents, handleDefaultEvent} from '@bearei/react-util/lib/event';
import {
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
  Ref,
  TouchEvent,
  useId,
} from 'react';
import type {GestureResponderEvent, ViewProps} from 'react-native';
import type {BaseMenuProps} from './Menu';

/**
 * Base menu item props
 */
export interface BaseMenuItemProps<T = HTMLElement>
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<T>, T> &
      ViewProps &
      Pick<BaseMenuProps, 'mode' | 'tooltip' | 'expandIcon' | 'selectedKeys'>,
    'onClick' | 'onTouchEnd' | 'onPress'
  > {
  /**
   * Custom ref
   */
  ref?: Ref<T>;

  /**
   * Menu item label
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
   * Call this function back when you click the menu item
   */
  onClick?: (e: React.MouseEvent<T, MouseEvent>) => void;

  /**
   * Call this function after pressing the menu item
   */
  onTouchEnd?: (e: TouchEvent<T>) => void;

  /**
   * Call this function after pressing the menu item  -- react native
   */
  onPress?: (e: GestureResponderEvent) => void;
}

/**
 * Menu item props
 */
export interface MenuItemProps<T> extends BaseMenuItemProps<T> {
  /**
   * Render the menu item icon
   */
  renderIcon?: (props: MenuItemIconProps) => ReactNode;

  /**
   * Render the menu item expansion icon
   */
  renderExpandIcon?: (props: MenuItemExpandIconProps) => ReactNode;

  /**
   * Render the menu item main
   */
  renderMain?: (props: MenuItemMainProps) => ReactNode;

  /**
   * Render the menu item container
   */
  renderContainer?: (props: MenuItemContainerProps<T>) => ReactNode;
}

export type Status = 'normal' | 'selected';

export interface MenuItemChildrenProps extends Omit<BaseMenuItemProps, 'ref'> {
  /**
   * Component unique ID
   */
  id: string;
  children?: ReactNode;

  /**
   * Set the menu item status
   */
  status?: Status;
}

export type MenuItemIconProps = MenuItemChildrenProps;
export type MenuItemExpandIconProps = MenuItemChildrenProps;
export type MenuItemMainProps = MenuItemChildrenProps;
export type MenuItemContainerProps<T> = MenuItemChildrenProps &
  Pick<BaseMenuItemProps<T>, 'ref'>;

const MenuItem = <T extends HTMLElement>(props: MenuItemProps<T>) => {
  const {
    ref,
    icon,
    expandIcon,
    disabled,
    loading,
    selectedKeys,
    index,
    onClick,
    onPress,
    onTouchEnd,
    renderIcon,
    renderMain,
    renderExpandIcon,
    renderContainer,
    ...args
  } = props;

  const id = useId();
  const events = Object.keys(props).filter(key => key.startsWith('on'));
  const childrenProps = {
    ...args,
    index,
    selectedKeys,
    status: (selectedKeys?.includes(index ?? '')
      ? 'selected'
      : 'normal') as Status,
    loading,
    disabled,
    id,
  };

  const handleResponse = <E,>(e: E, callback?: (e: E) => void) => {
    const response = !loading && !disabled;

    response && callback?.(e);
  };

  const handleCallback = (key: string) => {
    const event = {
      onClick: handleDefaultEvent((e: React.MouseEvent<T, MouseEvent>) =>
        handleResponse(e, onClick),
      ),
      onTouchEnd: handleDefaultEvent((e: TouchEvent<T>) =>
        handleResponse(e, onTouchEnd),
      ),
      onPress: handleDefaultEvent((e: GestureResponderEvent) =>
        handleResponse(e, onPress),
      ),
    };

    return event[key as keyof typeof event];
  };

  const expandIconNode =
    expandIcon && renderExpandIcon?.({...childrenProps, children: expandIcon});

  const iconNode = icon && renderIcon?.({...childrenProps, children: icon});
  const main = renderMain?.({...childrenProps, disabled, loading});
  const content = (
    <>
      {iconNode}
      {main}
      {expandIconNode}
    </>
  );

  const container = renderContainer?.({
    ...childrenProps,
    ref,
    children: content,
    ...bindEvents(events, handleCallback),
  });

  return <>{container}</>;
};

export default MenuItem;
