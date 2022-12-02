# react-menu

Base menu components that support React and React native

## Installation

> yarn add @bearei/react-menu --save

## Parameters

#### Menu Options

| Name | Type | Required | Description |
| :-- | --: | --: | :-- |
| key | `string` | ✘ | Currently select the completed menu item key |
| selectedKeys | `string[]` | ✘ | All select the completed menu item key |
| event | `unknown` | ✘ | Triggers an event that completes the selection of the current menu item |

#### Menu

| Name | Type | Required | Description |
| :-- | --: | --: | :-- |
| items | `BaseMenuItemProps[]` | ✘ | Menu items |
| multiple | `boolean` | ✘ | Allow multiple menu items |
| expandIcon | `ReactNode` | ✘ | Icon for menu expansion |
| mode | `vertical` `horizontal` `inline` | ✘ | Menu mode |
| selectedKeys | `string[]` | ✘ | All select the completed menu item key |
| defaultSelectedKeys | `string[]` | ✘ | The menu selects the completion item by default |
| tooltip | `ReactNode` | ✘ | Menu tip |
| onSelect | `(options: MenuOptions) => void` | ✘ | Call this function when menu item selection is complete |
| renderMain | `(props: MenuMainProps) => ReactNode` | ✘ | Render the menu main |
| renderContainer | `(props: MenuContainerProps) => ReactNode` | ✘ | Render the menu container |

#### MenuItem

| Name | Type | Required | Description |
| :-- | --: | --: | :-- |
| mode | `vertical` `horizontal` `inline` | ✘ | Menu mode |
| tooltip | `ReactNode` | ✘ | Menu tip |
| expandIcon | `ReactNode` | ✘ | Icon for menu expansion |
| selectedKeys | `string[]` | ✘ | All select the completed menu item key |
| label | `string` | ✘ | Menu item label |
| index | `string` | ✘ | Menu item index |
| icon | `ReactNode` | ✘ | Menu item icon |
| disabled | `boolean` | ✘ | Whether or not to disable the menu item |
| loading | `boolean` | ✘ | Whether the menu item is loading |
| onClick | `(e: MouseEvent) => void` | ✘ | Call this function back when you click the menu item |
| onTouchEnd | `(e: TouchEvent) => void` | ✘ | Call this function after pressing the menu item |
| onPress | `(e: GestureResponderEvent) => void` | ✘ | Call this function after pressing the menu item -- react native |
| renderIcon | ` (props: MenuItemIconProps) => ReactNode` | ✘ | Render the menu item icon |
| renderExpandIcon | ` (props: MenuItemExpandIconProps) => ReactNode` | ✘ | Render the menu item expansion icon |
| renderMain | ` (props: MenuItemMainProps) => ReactNode` | ✘ | Render the menu item main |
| renderContainer | ` (props: MenuItemContainerProps) => ReactNode` | ✘ | Render the menu item container |

## Use

```typescript
import React from 'React';
import ReactDOM from 'react-dom';
import Menu, {MenuItem} from '@bearei/react-menu';

const menus = [
  {label: 'MenuItem1', key: '1', icon: <i />},
  {label: 'MenuItem2', key: '2', icon: <i />},
  {label: 'MenuItem3', key: '3', icon: <i />, disabled: true},
];

const renderMenuItem = (
  {
    loading,
    disabled,
    icon,
    key,
    label,
    ...props
  }: BaseMenuItemProps<HTMLDivElement>,
  onSelect?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    key: string,
  ) => void,
) => (
  <MenuItem<HTMLDivElement>
    {...pickHTMLAttributes(props)}
    key={key}
    loading={loading}
    disabled={disabled}
    icon={icon}
    index={key}
    label={label}
    onClick={e => key && onSelect?.(e, key)}
    renderIcon={({children, ...props}) => (
      <i {...pickHTMLAttributes(props)}>{children}</i>
    )}
    renderExpandIcon={({children, ...props}) => (
      <i {...pickHTMLAttributes(props)}>{children}</i>
    )}
    renderMain={({label, ...props}) => (
      <div {...pickHTMLAttributes(props)}>{label}</div>
    )}
    renderContainer={({id, children, ...props}) => (
      <div {...pickHTMLAttributes(props)}>{children}</div>
    )}
  />
);

const menu = (
  <Menu<HTMLDivElement>
    items={menus}
    renderMain={({items, onSelect}) => (
      <div>{items?.map(item => renderMenuItem(item, onSelect))}</div>
    )}
    renderContainer={({id, children, ...props}) => (
      <div data-id={id} {...pickHTMLAttributes(props)}>
        {children}
      </div>
    )}
  />
);

ReactDOM.render(menu, container);
```
