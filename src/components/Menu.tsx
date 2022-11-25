import {useEffect, useState, useId} from 'react';
import handleEvent from '@bearei/react-util/lib/event';
import type {HandleEvent} from '@bearei/react-util/lib/event';
import type {ReactNode, Ref} from 'react';
import MenuItem, {BaseMenuItemProps} from './MenuItem';

/**
 * Select change options from the menu
 */
export interface SelectOptions<T, E = React.MouseEvent<T, MouseEvent>> {
  /**
   * The menu item key for the current action
   */
  key?: string;

  /**
   * Select the completed menu item keys
   */
  selectedKeys?: string[];

  /**
   * Menu item event
   */
  event?: E;
}

/**
 * Base menu props
 */
export interface BaseMenuProps<T>
  extends Pick<SelectOptions<T>, 'selectedKeys'> {
  /**
   * Custom menu Ref
   */
  ref?: Ref<T>;

  /**
   * Menu items
   */
  items: BaseMenuItemProps[];

  /**
   * Sets whether or not to be a multiple-choice menu
   */
  multiple?: boolean;

  /**
   * Custom menu item expansion icon
   */
  expandIcon?: ReactNode;

  /**
   * Menu mode
   */
  mode: 'vertical' | 'horizontal' | 'inline';

  /**
   * Set the default selection menu items
   */
  defaultSelectedKeys?: string[];

  /**
   * Sets the default expanded menu item
   */
  defaultOpenKeys?: string[];

  /**
   * A callback when a menu item is selected
   */
  onSelect?: <E>(options: SelectOptions<T, E>) => void;
}

/**
 * Menu props
 */
export interface MenuProps<T> extends BaseMenuProps<T> {
  /**
   * Render the menu main
   */
  renderMain?: (props: MenuMainProps<T>) => ReactNode;

  /**
   * Render the menu container
   */
  renderContainer?: (props: MenuContainerProps<T>) => ReactNode;
}

/**
 * Menu children props
 */
export interface MenuChildrenProps<T>
  extends Omit<BaseMenuProps<T>, 'ref' | 'onSelect'> {
  /**
   * Unique ID of card component
   */
  id: string;
  children?: ReactNode;

  /**
   * Used to handle some common default events
   */
  handleEvent: HandleEvent;
}

export interface MenuMainProps<T> extends MenuChildrenProps<T> {
  onSelect: <E>(e: E, key: string) => void;
}

export type MenuContainerProps<T> = MenuChildrenProps<T>;

function Menu<T>({
  ref,
  items,
  selectedKeys,
  defaultSelectedKeys,
  multiple = false,
  onSelect,
  renderMain,
  renderContainer,
  ...props
}: MenuProps<T>) {
  const id = useId();
  const [keys, setKeys] = useState<string[]>([]);
  const childrenProps = {...props, items, id, handleEvent};

  function handleSelected<E>(e: E, key: string) {
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

  const mainElement = (
    <>{renderMain?.({...childrenProps, onSelect: handleSelected})}</>
  );

  const containerElement = (
    <>
      {renderContainer?.({...childrenProps, children: mainElement}) ??
        mainElement}
    </>
  );

  useEffect(() => {
    const nextKeys = selectedKeys ?? defaultSelectedKeys;

    nextKeys && setKeys(nextKeys);

    onSelect?.({selectedKeys: nextKeys});
  }, [defaultSelectedKeys, selectedKeys, onSelect]);

  return <>{containerElement}</>;
}

Object.defineProperty(Menu, 'Item', {value: MenuItem});

export default Menu as typeof Menu & {Item: typeof MenuItem};
