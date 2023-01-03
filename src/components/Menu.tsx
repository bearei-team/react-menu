import * as array from '@bearei/react-util/lib/commonjs/array';
import {
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useId,
  useState,
} from 'react';
import type { ViewProps } from 'react-native';
import MenuItem, { BaseMenuItemProps } from './Menu-item';

/**
 * Menu options
 */
export interface MenuOptions<T, E = unknown>
  extends Pick<BaseMenuProps<T>, 'selectedKeys'> {
  /**
   * The key currently selected on the menu
   */
  key?: string;

  /**
   * Triggers an event when a menu option changes
   */
  event?: E;
}

/**
 * Base menu props
 */
export interface BaseMenuProps<T>
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<T>, T> & ViewProps,
    'onSelect'
  > {
  /**
   * Custom ref
   */
  ref?: Ref<T>;

  /**
   * The menu selects the completed key
   */
  selectedKeys?: string[];

  /**
   * Menu item selected by default
   */
  defaultSelectedKeys?: string[];

  /**
   * Menu items
   */
  items?: (BaseMenuItemProps<T> & { key?: string })[];

  /**
   * Allow multiple menu items to be selected
   */
  multiple?: boolean;

  /**
   * Menu item expansion icon
   */
  expandIcon?: ReactNode;

  /**
   * Menu mode
   */
  mode?: 'vertical' | 'horizontal' | 'inline';

  /**
   * This function is called back when the menu item selection is complete
   */
  onSelect?: <E>(options: MenuOptions<T, E>) => void;
}

/**
 * Menu props
 */
export interface MenuProps<T> extends BaseMenuProps<T> {
  /**
   * Render the menu main
   */
  renderMain: (props: MenuMainProps<T>) => ReactNode;

  /**
   * Render the menu container
   */
  renderContainer: (props: MenuContainerProps<T>) => ReactNode;
}

/**
 * Menu children props
 */
export interface MenuChildrenProps<T> extends Omit<BaseMenuProps<T>, 'ref'> {
  /**
   * Component unique ID
   */
  id: string;
  children?: ReactNode;
}

export interface MenuMainProps<T>
  extends Omit<
    MenuChildrenProps<T> & Pick<BaseMenuProps<T>, 'ref'>,
    'onSelect'
  > {
  onSelect: <E>(e: E, key?: string) => void;
}

export type MenuContainerProps<T> = MenuChildrenProps<T>;
export type MenuType = typeof Menu & { Item: typeof MenuItem };

const Menu = <T extends HTMLElement = HTMLElement>({
  ref,
  items,
  multiple,
  selectedKeys,
  defaultSelectedKeys,
  onSelect,
  renderMain,
  renderContainer,
  ...props
}: MenuProps<T>) => {
  const id = useId();
  const [status, setStatus] = useState('idle');
  const [menuOptions, setSelectOptions] = useState<MenuOptions<T>>({
    selectedKeys: [],
  });

  const childrenProps = {
    ...props,
    items,
    selectedKeys: menuOptions.selectedKeys,
    id,
  };

  const handleMenuOptionsChange = useCallback(
    <E,>(options: MenuOptions<T, E>) => onSelect?.(options),
    [onSelect],
  );

  const handleResponse = <E,>(e: E, key?: string) => {
    const { selectedKeys = [] } = menuOptions;
    const handleSingle = () => {
      const nextKeys = key && selectedKeys.includes(key) ? [] : key && [key];

      return Array.isArray(nextKeys) ? nextKeys : [];
    };

    const handleMultiple = () => {
      const nextKeys =
        key && selectedKeys.includes(key)
          ? selectedKeys.filter(selectedKey => selectedKey !== key)
          : key && [...selectedKeys, key];

      return Array.isArray(nextKeys) ? nextKeys : [...selectedKeys];
    };

    const nextKeys = multiple ? handleMultiple() : handleSingle();
    const options = { key, selectedKeys: nextKeys, event: e };

    setSelectOptions(options);
    handleMenuOptionsChange?.(options);
  };

  useEffect(() => {
    const nextSelectedKeys =
      status !== 'idle' ? selectedKeys : defaultSelectedKeys ?? selectedKeys;

    nextSelectedKeys &&
      setSelectOptions(currentOptions => {
        const isUpdate =
          !array.isEqual(currentOptions.selectedKeys ?? [], nextSelectedKeys) &&
          status === 'succeeded';

        isUpdate && handleMenuOptionsChange({ selectedKeys: nextSelectedKeys });

        return { selectedKeys: nextSelectedKeys };
      });

    status === 'idle' && setStatus('succeeded');
  }, [defaultSelectedKeys, handleMenuOptionsChange, selectedKeys, status]);

  const main = renderMain({ ...childrenProps, ref, onSelect: handleResponse });
  const container = renderContainer({ ...childrenProps, children: main });

  return <>{container}</>;
};

Object.defineProperty(Menu, 'Item', { value: MenuItem });

export default Menu as MenuType;
