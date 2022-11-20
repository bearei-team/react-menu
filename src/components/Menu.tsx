import React, {useEffect, useState} from 'react';
import {HandleEvent, handleEvent} from '@bearei/react-util';
import {MenuItemProps} from './MenuItem';

/**
 * Listen for menu selection to become an options.
 */
export interface SelectOptions {
  /**
   * The currently selected menu Key.
   */
  key?: string;

  /**
   * The currently selected completed menu key.
   */
  selectedKeys?: string[];
}

/**
 * Menu item.
 */
export interface MenuItemOptions {
  /**
   * Menu item label.
   */
  label: string;

  /**
   * Menu item key.
   */
  key: string;

  /**
   * Disable the current menu item.
   */
  disabled?: boolean;
}

/**
 * Menu props.
 */
export interface MenuProps extends Pick<SelectOptions, 'selectedKeys'> {
  menus: MenuItemOptions[];

  /**
   * Allow multiple menus.
   */
  multiple?: boolean;
  children?: React.ReactElement<MenuItemProps>[];

  /**
   * Set the default check menu option key.
   */
  defaultSelectedKeys?: string[];

  /**
   * Listen for changes in menu options.
   */
  onSelect?: (options: SelectOptions) => void;
}

export const Menu: React.FC<MenuProps> = ({
  menus,
  multiple = false,
  children,
  selectedKeys,
  defaultSelectedKeys,
  onSelect,
}) => {
  const [keys, setKeys] = useState<string[]>([]);
  const handleSelected = (key: string) => {
    const disabled = menus.find(menu => key === menu.key)?.disabled;

    if (disabled) {
      return;
    }

    const handleSingleSelected = () => (keys.indexOf(key) !== -1 ? [] : [key]);
    const handleMultipleSelected = () =>
      keys.indexOf(key) !== -1
        ? keys.filter(selectedKey => selectedKey !== key)
        : [...keys, key];

    const nextKeys = multiple
      ? handleMultipleSelected()
      : handleSingleSelected();

    setKeys(nextKeys);
    onSelect?.({key, selectedKeys: nextKeys});
  };

  const handleUserEvent = (key: string) => (e: HandleEvent) =>
    handleEvent(e, () => handleSelected(key));

  useEffect(() => {
    const nextKeys = selectedKeys ? selectedKeys : defaultSelectedKeys;

    nextKeys && setKeys(nextKeys);

    onSelect?.({selectedKeys: nextKeys});
  }, [menus, defaultSelectedKeys, selectedKeys, onSelect]);

  return (
    <>
      {children &&
        React.Children.map(children, child =>
          React.cloneElement(child, {
            onEvent: handleUserEvent(child.props.index),
          }),
        )}
    </>
  );
};
