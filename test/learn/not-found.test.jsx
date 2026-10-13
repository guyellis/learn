import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../../src/learn/not-found.jsx';

const theme = createTheme();

describe('NotFound', () => {
  test('should render a NotFound component', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <NotFound />
        </MemoryRouter>
      </ThemeProvider>,
    );

    expect(screen.getByRole('heading', { level: 1, name: /Oops! Page Not Found/i })).toBeDefined();
    expect(screen.getByText(/We couldn't find the page you were looking for/i)).toBeDefined();

    const img = screen.getByAltText('404 Page Not Found');
    expect(img.getAttribute('src')).toEqual('/404.webp');

    const link = screen.getByRole('link', { name: /Back to Home/i });
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toEqual('/');

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
