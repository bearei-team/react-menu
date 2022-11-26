# react-menu

A basic menu component that supports react and native react.

## Installation

> yarn add @bearei/react-menu --save

## Parameters

#### SelectOptions

| Name | Type | Required | Description |
| :-- | --: | --: | :-- |
| key | `string` | ✘ | The currently selected menu item key |
| selectedKeys | `string[]` | ✘ | Select the completed menu item keys |
| event | `React.MouseEvent` `GestureResponderEvent` | ✘ | Menu item change event |

#### Menu

| Name | Type | Required | Description |
| :-- | --: | --: | :-- |
| items | `BaseMenuItemProps[]` | ✘ | Menu items |
| multiple | `boolean` | ✘ | Whether to support multiple choice |
| expandIcon | `ReactNode` | ✘ | Icon for menu expansion |
| mode | `vertical` `horizontal` `inline` | ✘ | Menu mode |
| selectedKeys | `string[]` | ✘ | Select the completed menu item keys |
| defaultSelectedKeys | `string[]` | ✘ | Set the default key to select the completed menu item |
| tooltip | `ReactNode` | ✘ | The contents of a menu item prompt |
| onSelect | `(options: SelectOptions) => void` | ✘ | A callback when a menu item changes |
| renderMain | `(props: MenuMainProps) => ReactNode` | ✘ | Render the menu main |
| renderContainer | `(props: MenuContainerProps) => ReactNode` | ✘ | Render the menu container |

### MenuItem

| Name | Type | Required | Description |
| :-- | --: | --: | :-- |
| mode | `vertical` `horizontal` `inline` | ✘ | Menu mode |
| tooltip | `ReactNode` | ✘ | The contents of a menu item prompt |
| expandIcon | `ReactNode` | ✘ | Icon for menu expansion |
| selectedKeys | `string[]` | ✘ | Select the completed menu item keys |
| label | `string` | ✘ | Menu item show label |
| key | `string` | ✘ | Menu item key |
| icon | `ReactNode` | ✘ | Menu item icon |
| disabled | `boolean` | ✘ | Whether or not to disable the menu item |
| loading | `boolean` | ✘ | Whether the menu item is loading |
| onClick | `(e: MenuItemClickEvent<T>) => void` | ✘ | A callback when a menu item is clicked |
| onTouchEnd | `(e: MenuItemTouchEvent) => void` | ✘ | A callback for pressing a menu item |
| onPress | `(e: MenuItemPressEvent) => void` | ✘ | A callback for pressing a menu item -- react native |
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
