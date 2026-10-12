import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import renderer, { act } from 'react-test-renderer';
import Home from '../../src/learn/home.jsx';

const theme = createTheme();

describe('Home', () => {
  test('should render a Home component', () => {
    let component;
    act(() => {
      component = renderer.create(
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <Home />
          </MemoryRouter>
        </ThemeProvider>,
      );
    });

    const app = component.toJSON();
    expect(app).toMatchSnapshot();
  });
});
