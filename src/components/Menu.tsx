import type {HandleEvent} from '@bearei/react-util/lib/event';
import handleEvent from '@bearei/react-util/lib/event';
import {useCallback, useEffect, useId, useState} from 'react';
import type {DetailedHTMLProps, HTMLAttributes, ReactNode, Ref} from 'react';
import type {ViewProps} from 'react-native';
import type {BaseMenuItemProps} from './MenuItem';
import MenuItem from './MenuItem';

/**
 * Menu options
 */
export interface MenuOptions<E> {
  /**
   * Currently select the completed menu item key
   */
  key?: string;

  /**
   * All select the completed menu item key
   */
  selectedKeys?: string[];

  /**
   * Triggers an event that completes the selection of the current menu item
   */
  event?: E;
}

/**
 * Base menu props
 */
export interface BaseMenuProps<T, E>
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<T>, T> &
      ViewProps &
      Pick<MenuOptions<E>, 'selectedKeys'>,
    'onSelect'
  > {
  /**
   * Custom ref
   */
  ref?: Ref<T>;

  /**
   * Menu items
   */
  items?: (BaseMenuItemProps<T, E> & {key?: string})[];

  /**
   * Allow multiple menu items
   */
  multiple?: boolean;

  /**
   * Icon for menu expansion
   */
  expandIcon?: ReactNode;

  /**
   * Menu mode
   */
  mode?: 'vertical' | 'horizontal' | 'inline';

  /**
   * The menu selects the completion item by default
   */
  defaultSelectedKeys?: string[];

  /**
   * TODO:
   * Menu tip
   */
  tooltip?: ReactNode;

  /**
   * Call this function when menu item selection is complete
   */
  onSelect?: (options: MenuOptions<E>) => void;
}

/**
 * Menu props
 */
export interface MenuProps<T, E> extends BaseMenuProps<T, E> {
  /**
   * Render the menu main
   */
  renderMain?: (props: MenuMainProps<T, E>) => ReactNode;

  /**
   * Render the menu container
   */
  renderContainer?: (props: MenuContainerProps<T, E>) => ReactNode;
}

/**
 * Menu children props
 */
export interface MenuChildrenProps<T, E>
  extends Omit<BaseMenuProps<T, E>, 'ref' | 'onSelect'> {
  /**
   * Component unique ID
   */
  id: string;
  children?: ReactNode;

  /**
   * Used to handle some common default events
   */
  handleEvent: HandleEvent;
}

export interface MenuMainProps<T, E> extends MenuChildrenProps<T, E> {
  onSelect: (e: E, key: string) => void;
}

export type MenuContainerProps<T, E> = MenuChildrenProps<T, E> &
  Pick<BaseMenuProps<T, E>, 'ref'>;

export type MenuType = typeof Menu & {Item: typeof MenuItem};

function Menu<T, E = React.MouseEvent<T, MouseEvent>>({
  ref,
  items,
  multiple,
  selectedKeys,
  defaultSelectedKeys,
  onSelect,
  renderMain,
  renderContainer,
  ...props
}: MenuProps<T, E>) {
  const id = useId();
  const [status, setStatus] = useState('idle');
  const [menuOptions, setSelectOptions] = useState<MenuOptions<E>>({
    selectedKeys: [],
  });

  const childrenProps = {
    ...props,
    items,
    selectedKeys: menuOptions.selectedKeys,
    id,
    handleEvent,
  };

  const handleMenuOptionsChange = useCallback(
    (options: MenuOptions<E>) => onSelect?.(options),
    [onSelect],
  );

  function handleSelected(e: E, key: string) {
    const {selectedKeys = []} = menuOptions;
    const handleSingleSelected = () =>
      selectedKeys.includes(key) ? [] : [key];

    const handleMultipleSelected = () =>
      selectedKeys.includes(key)
        ? selectedKeys.filter(selectedKey => selectedKey !== key)
        : [...selectedKeys, key];

    const nextKeys = multiple
      ? handleMultipleSelected()
      : handleSingleSelected();

    const options = {key, selectedKeys: nextKeys, event: e};

    setSelectOptions(options);
    handleMenuOptionsChange(options);
  }

  useEffect(() => {
    const nextSelectedKeys =
      status !== 'idle' ? selectedKeys : defaultSelectedKeys ?? selectedKeys;

    const sort = (array = [] as string[]) => [...array].sort().toString();

    nextSelectedKeys &&
      setSelectOptions(currentOptions => {
        const change =
          sort(currentOptions.selectedKeys) !== sort(nextSelectedKeys) &&
          status === 'succeeded';

        change && handleMenuOptionsChange({selectedKeys: nextSelectedKeys});

        return {selectedKeys: nextSelectedKeys};
      });

    status === 'idle' && setStatus('succeeded');
  }, [defaultSelectedKeys, handleMenuOptionsChange, selectedKeys, status]);

  const main = renderMain?.({...childrenProps, onSelect: handleSelected});
  const container =
    renderContainer?.({...childrenProps, ref, children: main}) ?? main;

  return <>{container}</>;
}

Object.defineProperty(Menu, 'Item', {value: MenuItem});

export default Menu as MenuType;
