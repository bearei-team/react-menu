import { pickHTMLAttributes } from '@bearei/react-util';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Menu from '../../src/components/Menu';
import type { BaseMenuItemProps } from '../../src/components/Menu-item';
import MenuItem from '../../src/components/Menu-item';
import { render } from '../utils/test-utils';

const menus = [
  { label: 'MenuItem1', key: '1', icon: <i />, expandIcon: <i /> },
  { label: 'MenuItem2', key: '2', icon: <i />, expandIcon: <i /> },
  {
    label: 'MenuItem3',
    key: '3',
    icon: <i />,
    expandIcon: <i />,
    disabled: true,
  },
];

const renderMenuItem = ({
  loading,
  disabled,
  icon,
  key,
  label,
  expandIcon,
  ...props
}: BaseMenuItemProps<HTMLElement> & { key?: string }) => (
  <MenuItem
    {...pickHTMLAttributes(props)}
    key={key}
    loading={loading}
    disabled={disabled}
    icon={icon}
    expandIcon={expandIcon}
    index={key}
    label={label}
    onClick={() => undefined}
    renderIcon={({ children, ...props }) => (
      <i
        {...pickHTMLAttributes(props)}
        data-cy={`ItemIcon-${key}`}
        data-key={key}
      >
        {children}
      </i>
    )}
    renderExpandIcon={({ children, ...props }) => (
      <i
        data-cy={`ItemExpandIcon-${key}`}
        data-key={key}
        {...pickHTMLAttributes(props)}
      >
        {children}
      </i>
    )}
    renderMain={({ label, icon, expandIcon, ...props }) => (
      <div
        {...pickHTMLAttributes(props)}
        data-cy={`ItemMain-${key}`}
        data-key={key}
      >
        <i>{icon}</i>
        {label}
        <i>{expandIcon}</i>
      </div>
    )}
    renderContainer={({ id, children, ...props }) => (
      <div data-id={id} data-cy={`Item-${key}`} {...pickHTMLAttributes(props)}>
        {children}
      </div>
    )}
  />
);

describe('test/components/Menu.test.ts', () => {
  test('It should be a render menu', async () => {
    const { getByDataCy } = render(
      <Menu
        items={menus}
        renderMain={({ items, onSelect }) => (
          <div data-cy={'MenuMain'} data-main="Main">
            {items?.map(item => renderMenuItem({ ...item, onSelect }))}
          </div>
        )}
        renderContainer={({ id, children, ...props }) => (
          <div data-id={id} data-cy={'Menu'} {...pickHTMLAttributes(props)}>
            {children}
          </div>
        )}
      />,
    );

    expect(getByDataCy('Menu')).toHaveAttribute('data-id');
    expect(getByDataCy('MenuMain')).toHaveAttribute('data-main');
    expect(getByDataCy('ItemIcon-1')).toHaveAttribute('data-key');
    expect(getByDataCy('ItemExpandIcon-1')).toHaveAttribute('data-key');
    expect(getByDataCy('ItemMain-1')).toHaveAttribute('data-key');
    expect(getByDataCy('Item-1')).toHaveAttribute('data-id');
  });

  test('It should be a single selection of menu options', async () => {
    let selectedKeys!: string[] | undefined;
    const user = userEvent.setup();
    const { getByDataCy } = render(
      <Menu
        items={menus}
        selectedKeys={['1']}
        onSelect={props => (selectedKeys = props.selectedKeys)}
        renderMain={({ items, onSelect }) => (
          <div data-cy={'MenuMain'} data-main="Main">
            {items?.map(item => renderMenuItem({ ...item, onSelect }))}
          </div>
        )}
        renderContainer={({ id, children, ...props }) => (
          <div data-id={id} data-cy={'Menu'} {...pickHTMLAttributes(props)}>
            {children}
          </div>
        )}
      />,
    );

    await user.click(getByDataCy('ItemMain-1'));
    await user.click(getByDataCy('ItemMain-2'));
    expect(selectedKeys?.toString()).toEqual(['2'].toString());
  });

  test('It should be menu options with multiple choices', async () => {
    let selectedKeys!: string[] | undefined;
    const user = userEvent.setup();
    const { getByDataCy } = render(
      <Menu
        items={menus}
        multiple
        defaultSelectedKeys={[]}
        onSelect={props => (selectedKeys = props.selectedKeys)}
        renderMain={({ items, onSelect }) => (
          <div data-cy={'MenuMain'} data-main="Main">
            {items?.map(item => renderMenuItem({ ...item, onSelect }))}
          </div>
        )}
        renderContainer={({ id, children, ...props }) => (
          <div data-id={id} data-cy={'Menu'} {...pickHTMLAttributes(props)}>
            {children}
          </div>
        )}
      />,
    );

    await user.click(getByDataCy('ItemMain-1'));
    await user.click(getByDataCy('ItemMain-2'));
    expect(selectedKeys?.toString()).toEqual(['1', '2'].toString());

    await user.click(getByDataCy('ItemMain-2'));
    expect(selectedKeys?.toString()).toEqual(['1'].toString());
  });
});
