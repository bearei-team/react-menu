import type {HandleEvent} from '@bearei/react-util/lib/event';
import handleEvent from '@bearei/react-util/lib/event';
import type {ReactNode, Ref} from 'react';
import {useEffect, useId, useState} from 'react';
import type {BaseMenuItemProps} from './MenuItem';
import MenuItem from './MenuItem';

/**
 * Menu items select change options
 */
export interface SelectOptions<E> {
  /**
   * The currently selected menu item key
   */
  key?: string;

  /**
   * Select the completed menu item keys
   */
  selectedKeys?: string[];

  /**
   * Menu item change event
   */
  event?: E;
}

/**
 * Base menu props
 */
export interface BaseMenuProps<T, E = React.MouseEvent<T, MouseEvent>>
  extends Pick<SelectOptions<E>, 'selectedKeys'> {
  ref?: Ref<T>;

  /**
   * Menu items
   */
  items?: BaseMenuItemProps<T>[];

  /**
   * Whether to support multiple choice
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
   * Set the default key to select the completed menu item
   */
  defaultSelectedKeys?: string[];

  /**
   * TODO:
   * The contents of a menu item prompt
   */
  tooltip?: ReactNode;

  /**
   * A callback when a menu item changes
   */
  onSelect?: (options: SelectOptions<E>) => void;
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
  children?: ReactNode;

  /**
   * Used to handle some common default events
   */
  handleEvent: HandleEvent;
}

export interface MenuMainProps<T, E> extends MenuChildrenProps<T, E> {
  /**
   * A callback when a menu item changes
   */
  onSelect: (e: E, key: string) => void;
}

export interface MenuContainerProps<T, E>
  extends Omit<MenuChildrenProps<T, E> & Pick<MenuProps<T, E>, 'ref'>, ''> {
  /**
   * The unique ID of the component
   */
  id: string;
}

export type MenuType = typeof Menu & {Item: typeof MenuItem};

function Menu<T = HTMLElement, E = React.MouseEvent<T, MouseEvent>>({
  ref,
  items,
  selectedKeys,
  defaultSelectedKeys,
  multiple = false,
  onSelect,
  renderMain,
  renderContainer,
  ...props
}: MenuProps<T, E>) {
  const id = useId();
  const [keys, setKeys] = useState<string[]>([]);
  const childrenProps = {...props, items, selectedKeys: keys, handleEvent};

  function handleSelected(e: E, key: string) {
    const handleSingleSelected = () => (keys.includes(key) ? [] : [key]);
    const handleMultipleSelected = () =>
      keys.includes(key)
        ? keys.filter(selectedKey => selectedKey !== key)
        : [...keys, key];

    const nextKeys = multiple
      ? handleMultipleSelected()
      : handleSingleSelected();

    setKeys(nextKeys);
    onSelect?.({key, selectedKeys: nextKeys, event: e});
  }

  useEffect(() => {
    const nextKeys = selectedKeys ?? defaultSelectedKeys;

    nextKeys && setKeys(nextKeys);

    onSelect?.({selectedKeys: nextKeys});
  }, [defaultSelectedKeys, selectedKeys, onSelect]);

  const main = renderMain?.({...childrenProps, onSelect: handleSelected});
  const container =
    renderContainer?.({...childrenProps, ref, id, children: main}) ?? main;

  return <>{container}</>;
}

Object.defineProperty(Menu, 'Item', {value: MenuItem});

export default Menu as MenuType;
