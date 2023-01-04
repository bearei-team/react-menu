import {
  bindEvents,
  handleDefaultEvent,
} from '@bearei/react-util/lib/commonjs/event';
import {
  DetailedHTMLProps,
  HTMLAttributes,
  MouseEvent,
  ReactNode,
  Ref,
  TouchEvent,
  useId,
} from 'react';
import type { GestureResponderEvent, ViewProps } from 'react-native';
import type { BaseMenuProps, MenuMainProps } from './Menu';

/**
 * Base menu item props
 */
export interface BaseMenuItemProps<T>
  extends Partial<
    Omit<
      DetailedHTMLProps<HTMLAttributes<T>, T> & ViewProps,
      'onClick' | 'onTouchEnd' | 'onPress' | 'onSelect'
    > &
      Pick<BaseMenuProps<T>, 'mode' | 'expandIcon' | 'selectedKeys'> &
      Pick<MenuMainProps<T>, 'onSelect'>
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
   * This function is called when menu item is clicked
   */
  onClick?: (e: MouseEvent<T, MouseEvent>) => void;

  /**
   * This function is called when the menu item is pressed
   */
  onTouchEnd?: (e: TouchEvent<T>) => void;

  /**
   * This function is called when the menu item is pressed -- react native
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
  renderIcon?: (props: MenuItemIconProps<T>) => ReactNode;

  /**
   * Render the menu item expansion icon
   */
  renderExpandIcon?: (props: MenuItemExpandIconProps<T>) => ReactNode;

  /**
   * Render the menu item main
   */
  renderMain: (props: MenuItemMainProps<T>) => ReactNode;

  /**
   * Render the menu item container
   */
  renderContainer: (props: MenuItemContainerProps<T>) => ReactNode;
}

export type Status = 'normal' | 'selected';

export interface MenuItemChildrenProps<T>
  extends Omit<BaseMenuItemProps<T>, 'ref'> {
  /**
   * Component unique ID
   */
  id: string;
  children?: ReactNode;

  /**
   * Status of menu item selection
   */
  status?: Status;
}

export type MenuItemIconProps<T> = MenuItemChildrenProps<T>;
export type MenuItemExpandIconProps<T> = MenuItemChildrenProps<T>;
export type MenuItemMainProps<T> = MenuItemChildrenProps<T> &
  Pick<BaseMenuItemProps<T>, 'ref'>;

export type MenuItemContainerProps<T> = MenuItemChildrenProps<T>;
export type EventType = 'onClick' | 'onPress' | 'onTouchEnd';

const MenuItem = <T extends HTMLElement = HTMLElement>(
  props: MenuItemProps<T>,
) => {
  const {
    ref,
    icon,
    index,
    loading,
    disabled,
    expandIcon,
    selectedKeys,
    onClick,
    onPress,
    onTouchEnd,
    renderIcon,
    renderMain,
    renderExpandIcon,
    renderContainer,
    onSelect,
    ...args
  } = props;

  const id = useId();
  const bindEvenNames = ['onClick', 'onPress', 'onTouchEnd'];
  const eventNames = Object.keys(props).filter(key =>
    bindEvenNames.includes(key),
  ) as EventType[];

  const childrenProps = {
    ...args,
    id,
    index,
    loading,
    disabled,
    selectedKeys,
    status: (selectedKeys?.includes(index ?? '')
      ? 'selected'
      : 'normal') as Status,
  };

  const handleResponse = <E,>(e: E, callback?: (e: E) => void) => {
    const isResponse = !loading && !disabled;

    if (isResponse) {
      onSelect?.(e, index);
      callback?.(e);
    }
  };

  const handleCallback = (event: EventType) => {
    const eventFunctions = {
      onClick: handleDefaultEvent((e: MouseEvent<T, MouseEvent>) =>
        handleResponse(e, onClick),
      ),
      onTouchEnd: handleDefaultEvent((e: TouchEvent<T>) =>
        handleResponse(e, onTouchEnd),
      ),
      onPress: handleDefaultEvent((e: GestureResponderEvent) =>
        handleResponse(e, onPress),
      ),
    };

    return eventFunctions[event];
  };

  const expandIconNode =
    expandIcon &&
    renderExpandIcon?.({ ...childrenProps, children: expandIcon });

  const iconNode = icon && renderIcon?.({ ...childrenProps, children: icon });
  const main = renderMain({
    ...childrenProps,
    ref,
    disabled,
    loading,
    icon: iconNode,
    expandIcon: expandIconNode,
    ...(bindEvents(eventNames, handleCallback) as {
      onClick?: (e: MouseEvent<T, MouseEvent>) => void;
      onTouchEnd?: (e: TouchEvent<T>) => void;
      onPress?: (e: GestureResponderEvent) => void;
    }),
  });

  const container = renderContainer({
    ...childrenProps,
    children: main,
  });

  return <>{container}</>;
};

export default MenuItem;
