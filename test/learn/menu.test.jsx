import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import renderer, { act } from 'react-test-renderer';
import Menu from '../../src/learn/menu.jsx';

const theme = createTheme();

describe('Menu', () => {
  test('should render a Menu component', () => {
    let component;
    act(() => {
      component = renderer.create(
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <Menu />
          </MemoryRouter>
        </ThemeProvider>,
      );
    });

    const app = component.toJSON();
    expect(app).toMatchSnapshot();
  });
});
