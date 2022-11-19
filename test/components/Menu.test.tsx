import '@testing-library/jest-dom';
import {render} from '../utils/testUtils';
import React from 'react';
import userEvent from '@testing-library/user-event';
import {Menu} from '../../src/components/Menu';
import {MenuItem} from '../../src/components/MenuItem';

const items = [
  {label: 'MenuItem1', key: '1'},
  {label: 'MenuItem2', key: '2'},
  {label: 'MenuItem3', key: '3', disabled: true},
];

describe('test/components/Menu.test.ts', () => {
  test('It should be a render menu', async () => {
    const {getByDataCy} = render(
      <Menu items={items}>
        {items.map(({label, key}) => (
          <MenuItem key={key} index={key}>
            <div data-cy={`${label}-${key}`}>{label}</div>
          </MenuItem>
        ))}
      </Menu>,
    );

    expect(getByDataCy('MenuItem1-1')).toHaveTextContent('MenuItem1');
    expect(getByDataCy('MenuItem2-2')).toHaveTextContent('MenuItem2');
  });

  test('It should be a single selection of menu options', async () => {
    let selectedKeys!: string[] | undefined;
    const user = userEvent.setup();
    const {getByDataCy} = render(
      <Menu
        items={items}
        defaultSelectedKeys={['1']}
        onSelect={selectOptions => {
          selectedKeys = selectOptions.selectedKeys;
        }}
      >
        {items.map(({label, key}) => (
          <MenuItem key={key} index={key}>
            <div data-cy={`${label}-${key}`}>{label}</div>
          </MenuItem>
        ))}
      </Menu>,
    );

    await user.click(getByDataCy('MenuItem2-2'));
    await user.click(getByDataCy('MenuItem3-3'));
    expect(selectedKeys?.toString()).toEqual(['2'].toString());
  });

  test('It should be menu options with multiple choices', async () => {
    let selectedKeys!: string[] | undefined;
    const user = userEvent.setup();
    const {getByDataCy} = render(
      <Menu
        items={items}
        multiple
        selectedKeys={['1']}
        onSelect={selectOptions => {
          selectedKeys = selectOptions.selectedKeys;
        }}
      >
        {items.map(({label, key}) => (
          <MenuItem key={key} index={key}>
            <div data-cy={`${label}-${key}`}>{label}</div>
          </MenuItem>
        ))}
      </Menu>,
    );

    await user.click(getByDataCy('MenuItem2-2'));
    await user.click(getByDataCy('MenuItem3-3'));
    expect(selectedKeys?.toString()).toEqual(['1', '2'].toString());

    await user.click(getByDataCy('MenuItem2-2'));
    expect(selectedKeys?.toString()).toEqual(['1'].toString());
  });
});
