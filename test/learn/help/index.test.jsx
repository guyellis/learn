import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import renderer, { act } from 'react-test-renderer';
import Help from '../../../src/learn/help/index.jsx';

const theme = createTheme();

describe('Help', () => {
  test('should render the Help component', () => {
    let component;
    act(() => {
      component = renderer.create(
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <Help />
          </MemoryRouter>
        </ThemeProvider>,
      );
    });

    const app = component.toJSON();
    expect(app).toMatchSnapshot();
  });
});
