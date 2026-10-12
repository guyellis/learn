import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../../src/learn/not-found.jsx';

const theme = createTheme();

describe('NotFound', () => {
  test('should render a NotFound component', () => {
    let component;
    act(() => {
      component = renderer.create(
        <ThemeProvider theme={theme}>
          <MemoryRouter>
            <NotFound />
          </MemoryRouter>
        </ThemeProvider>,
      );
    });

    const app = component.toJSON();
    expect(app).toMatchSnapshot();

    const img = component.root.findByProps({ alt: '404 Page Not Found' });
    expect(img.props.src).toEqual('/404.webp');

    const link = component.root.findByProps({ to: '/' });
    expect(link).toBeDefined();
  });
});
