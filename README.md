# react-menu

Base menu components that support React and React native

## Installation

> yarn add @bearei/react-menu --save

## Parameters

#### Menu Options

| Name | Type | Required | Description |
| :-- | --: | --: | :-- |
| key | `string` | ✘ | The key currently selected on the menu |
| selectedKeys | `string[]` | ✘ | The menu selects the completed key |
| event | `unknown` | ✘ | Triggers an event when a menu option changes |

#### Menu

| Name | Type | Required | Description |
| :-- | --: | --: | :-- |
| selectedKeys | `string[]` | ✘ | The menu selects the completed key |
| defaultSelectedKeys | `string[]` | ✘ | The menu selects the completion item by default |
| items | `(BaseMenuItemProps & {key?: string})[]` | ✘ | Menu items |
| multiple | `boolean` | ✘ | Allow multiple menu items to be selected |
| expandIcon | `ReactNode` | ✘ | Menu item expansion icon |
| mode | `vertical` `horizontal` `inline` | ✘ | Menu mode |
| onSelect | `(options: MenuOptions) => void` | ✘ | This function is called back when the menu item selection is complete |
| renderMain | `(props: MenuMainProps) => ReactNode` | ✘ | Render the menu main |
| renderContainer | `(props: MenuContainerProps) => ReactNode` | ✘ | Render the menu container |

#### MenuItem

| Name | Type | Required | Description |
| :-- | --: | --: | :-- |
| mode | `vertical` `horizontal` `inline` | ✘ | Menu mode |
| expandIcon | `ReactNode` | ✘ | Menu item expansion icon |
| selectedKeys | `string[]` | ✘ | The menu selects the completed key |
| label | `ReactNode` | ✘ | Menu item label |
| index | `string` | ✘ | Menu item index |
| icon | `ReactNode` | ✘ | Menu item icon |
| disabled | `boolean` | ✘ | Whether or not to disable the menu item |
| loading | `boolean` | ✘ | Whether the menu item is loading |
| onClick | `(e: React.MouseEvent) => void` | ✘ | This function is called when menu item is clicked |
| onTouchEnd | `(e: React.TouchEvent) => void` | ✘ | This function is called when the menu item is pressed |
| onPress | `(e: GestureResponderEvent) => void` | ✘ | This function is called when the menu item is pressed -- react native |
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
  {loading, disabled, icon, key, label, ...props}: BaseMenuItemProps,
  onSelect?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    key: string,
  ) => void,
) => (
  <MenuItem
    {...props}
    key={key}
    loading={loading}
    disabled={disabled}
    icon={icon}
    index={key}
    label={label}
    onClick={e => key && onSelect?.(e, key)}
    renderIcon={({children, ...props}) => (
      <i {...props}>{children}</i>
    )}
    renderExpandIcon={({children, ...props}) => (
      <i {..props}>{children}</i>
    )}
    renderMain={({label, ...props}) => (
      <div {...props}>{label}</div>
    )}
    renderContainer={({id, children, ...props}) => (
      <div {...props}>{children}</div>
    )}
  />
);

const menu = (
  <Menu
    items={menus}
    renderMain={({items, onSelect}) => (
      <div>{items?.map(item => renderMenuItem(item, onSelect))}</div>
    )}
    renderContainer={({id, children, ...props}) => (
      <div data-id={id} {...props}>
        {children}
      </div>
    )}
  />
);

ReactDOM.render(menu, container);
```
