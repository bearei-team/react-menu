import '@testing-library/jest-dom';
import {render} from '../utils/testUtils';
import React from 'react';
import userEvent from '@testing-library/user-event';
import Menu from '../../src/components/Menu';
import {pickHTMLAttributes} from '@bearei/react-util';
import type {BaseMenuItemProps} from '../../src/components/MenuItem';

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
  }: BaseMenuItemProps<HTMLElement>,
  onSelect?: (key: string) => void,
) => (
  <Menu.Item<HTMLDivElement>
    {...pickHTMLAttributes(props)}
    key={key}
    loading={loading}
    disabled={disabled}
    icon={icon}
    index={key}
    label={label}
    onClick={() => key && onSelect?.(key)}
    renderIcon={({...props}, element) => (
      <i
        {...pickHTMLAttributes(props)}
        data-cy={`ItemIcon-${key}`}
        data-key={key}
      >
        {element}
      </i>
    )}
    renderMain={({label, ...props}) => (
      <div
        {...pickHTMLAttributes(props)}
        data-cy={`ItemMain-${key}`}
        data-key={key}
      >
        {label}
      </div>
    )}
    renderContainer={({id, ...props}, element) => (
      <div data-id={id} data-cy={`Item-${key}`} {...pickHTMLAttributes(props)}>
        {element}
      </div>
    )}
  />
);

describe('test/components/Menu.test.ts', () => {
  test('It should be a render menu', async () => {
    const {getByDataCy} = render(
      <Menu<HTMLDivElement>
        items={menus}
        renderMain={({items, onSelect}) => (
          <div data-cy={'MenuMain'} data-main="Main">
            {items.map(item => renderMenuItem(item, onSelect))}
          </div>
        )}
        renderContainer={({id, ...props}, element) => (
          <div data-id={id} data-cy={'Menu'} {...pickHTMLAttributes(props)}>
            {element}
          </div>
        )}
      />,
    );

    expect(getByDataCy('Menu')).toHaveAttribute('data-id');
    expect(getByDataCy('MenuMain')).toHaveAttribute('data-main');
    expect(getByDataCy('ItemIcon-1')).toHaveAttribute('data-key');
    expect(getByDataCy('ItemMain-1')).toHaveAttribute('data-key');
    expect(getByDataCy('Item-1')).toHaveAttribute('data-id');
  });

  test('It should be a single selection of menu options', async () => {
    let selectedKeys!: string[] | undefined;
    const user = userEvent.setup();
    const {getByDataCy} = render(
      <Menu<HTMLDivElement>
        items={menus}
        selectedKeys={['1']}
        onSelect={props => (selectedKeys = props.selectedKeys)}
        renderMain={({items, onSelect}) => (
          <div data-cy={'MenuMain'} data-main="Main">
            {items.map(item => renderMenuItem(item, onSelect))}
          </div>
        )}
        renderContainer={({id, ...props}, element) => (
          <div data-id={id} data-cy={'Menu'} {...pickHTMLAttributes(props)}>
            {element}
          </div>
        )}
      />,
    );

    await user.click(getByDataCy('Item-1'));
    await user.click(getByDataCy('Item-2'));
    expect(selectedKeys?.toString()).toEqual(['2'].toString());
  });

  test('It should be menu options with multiple choices', async () => {
    let selectedKeys!: string[] | undefined;
    const user = userEvent.setup();
    const {getByDataCy} = render(
      <Menu<HTMLDivElement>
        items={menus}
        multiple
        defaultSelectedKeys={[]}
        onSelect={props => (selectedKeys = props.selectedKeys)}
        renderMain={({items, onSelect}) => (
          <div data-cy={'MenuMain'} data-main="Main">
            {items.map(item => renderMenuItem(item, onSelect))}
          </div>
        )}
        renderContainer={({id, ...props}, element) => (
          <div data-id={id} data-cy={'Menu'} {...pickHTMLAttributes(props)}>
            {element}
          </div>
        )}
      />,
    );

    await user.click(getByDataCy('Item-1'));
    await user.click(getByDataCy('Item-2'));
    expect(selectedKeys?.toString()).toEqual(['1', '2'].toString());

    await user.click(getByDataCy('Item-2'));
    expect(selectedKeys?.toString()).toEqual(['1'].toString());
  });
});
