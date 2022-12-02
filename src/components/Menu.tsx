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
import type {ViewProps} from 'react-native';
import MenuItem, {BaseMenuItemProps} from './MenuItem';

/**
 * Menu options
 */
export interface MenuOptions<E = unknown> {
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
export interface BaseMenuProps<T = HTMLElement>
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<T>, T> &
      ViewProps &
      Pick<MenuOptions, 'selectedKeys'>,
    'onSelect'
  > {
  /**
   * Custom ref
   */
  ref?: Ref<T>;

  /**
   * Menu items
   */
  items?: (BaseMenuItemProps<T> & {key?: string})[];

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
  onSelect?: <E>(options: MenuOptions<E>) => void;
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
export interface MenuChildrenProps<T = HTMLElement>
  extends Omit<BaseMenuProps<T>, 'ref'> {
  /**
   * Component unique ID
   */
  id: string;
  children?: ReactNode;
}

export interface MenuMainProps<T>
  extends Omit<MenuChildrenProps<T>, 'onSelect'> {
  onSelect: <E>(e: E, key: string) => void;
}

export type MenuContainerProps<T> = MenuChildrenProps<T> &
  Pick<BaseMenuProps<T>, 'ref'>;

export type MenuType = typeof Menu & {Item: typeof MenuItem};

const Menu = <T extends HTMLElement>({
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
  const [menuOptions, setSelectOptions] = useState<MenuOptions>({
    selectedKeys: [],
  });

  const childrenProps = {
    ...props,
    items,
    selectedKeys: menuOptions.selectedKeys,
    id,
  };

  const handleMenuOptionsChange = useCallback(
    <E,>(options: MenuOptions<E>) => onSelect?.(options),
    [onSelect],
  );

  const handleSelected = <E,>(e: E, key: string) => {
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
  };

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
  const content = <>{main}</>;
  const container =
    renderContainer?.({...childrenProps, ref, children: content}) ?? content;

  return <>{container}</>;
};

Object.defineProperty(Menu, 'Item', {value: MenuItem});

export default Menu as MenuType;
