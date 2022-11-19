import React, {useEffect, useState} from 'react';
import {HandleEvent, handleEvent} from '@bearei/react-util';
import {MenuItemProps} from './MenuItem';

/**
 * 监听选择选项
 */
export interface SelectOptions {
  /**
   * 当前选择 Key
   */
  key?: string;

  /**
   * 菜单选择 Key 集合
   */
  selectedKeys?: string[];
}

/**
 * 菜单项目
 */
export interface Item {
  /**
   * 标签
   */
  label: string;

  /**
   * 菜单项目 Key
   */
  key: string;

  /**
   * 是否禁用
   */
  disabled?: boolean;
}

/**
 * 菜单 Props
 */
export interface MenuProps {
  /**
   * 菜单项目
   */
  items: Item[];

  /**
   * 是否允许多选
   */
  multiple?: boolean;

  /**
   * 菜单选项集合
   */
  children?: React.ReactElement<MenuItemProps>[];

  /**
   * 当前选中的菜单项 key 集合
   */
  selectedKeys?: string[];

  /**
   * 初始选中的菜单项 key 集合
   */
  defaultSelectedKeys?: string[];

  /**
   * 监听选择
   */
  onSelect?: (options: SelectOptions) => void;
}

export const Menu: React.FC<MenuProps> = ({
  items,
  multiple = false,
  children,
  selectedKeys,
  defaultSelectedKeys,
  onSelect,
}) => {
  const [keys, setKeys] = useState<string[]>([]);
  const handleSelected = (key: string) => {
    const disabled = items.find(menu => key === menu.key)?.disabled;

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
  }, [items, defaultSelectedKeys, selectedKeys, onSelect]);

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
