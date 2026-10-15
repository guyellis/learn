import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export type ToolbarMenuProps = Record<string, never>;

function ToolbarMenu() {
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isDrill = location.pathname.startsWith('/math/drill');
  const isScore = location.pathname === '/math/score';
  const isHelp = location.pathname === '/help';

  const getButtonSx = (isActive: boolean) =>
    isActive
      ? {
          '&:hover': {
            bgcolor: (theme: { palette: { mode: string } }) =>
              theme.palette.mode === 'dark' ? '#e2e8f0' : '#f1f5f9',
          },
          bgcolor: (theme: { palette: { mode: string } }) =>
            theme.palette.mode === 'dark' ? '#f8fafc' : '#ffffff',
          boxShadow: 2,
          color: (theme: { palette: { mode: string } }) =>
            theme.palette.mode === 'dark' ? '#0f172a' : 'primary.dark',
          fontWeight: 700,
          minHeight: '48px',
        }
      : {
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.15)',
          },
          color: 'primary.contrastText',
          minHeight: '48px',
        };

  return (
    <AppBar position="static">
      <Toolbar sx={{ flexWrap: 'wrap', gap: 1, py: 1 }}>
        <Link to="/">
          <Button
            aria-current={isHome ? 'page' : undefined}
            size="large"
            sx={getButtonSx(isHome)}
            variant={isHome ? 'contained' : 'text'}
          >
            Home
          </Button>
        </Link>
        <Link to="/math/drill">
          <Button
            aria-current={isDrill ? 'page' : undefined}
            size="large"
            sx={getButtonSx(isDrill)}
            variant={isDrill ? 'contained' : 'text'}
          >
            Drill
          </Button>
        </Link>
        <Link to="/math/score">
          <Button
            aria-current={isScore ? 'page' : undefined}
            size="large"
            sx={getButtonSx(isScore)}
            variant={isScore ? 'contained' : 'text'}
          >
            Score
          </Button>
        </Link>
        <Link to="/help">
          <Button
            aria-current={isHelp ? 'page' : undefined}
            size="large"
            sx={getButtonSx(isHelp)}
            variant={isHelp ? 'contained' : 'text'}
          >
            Help
          </Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
}

export default ToolbarMenu;
