import { DarkMode, LightMode, Share } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import FloatingActionButton from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppTheme } from '../theme/app-theme-provider.js';
import { VALID_THEME_PALETTES } from '../theme/theme-storage.js';
import { PALETTES, ThemeMode } from '../theme/theme.js';

function share() {
  navigator
    .share({
      text: 'Math Exercises for Kids',
      title: 'Math Drill',
      url: 'https://learn.headvert.com',
    })
    // eslint-disable-next-line no-console
    .then(() => console.log('Successful share'))
    // eslint-disable-next-line no-console
    .catch((error) => console.log('Error sharing', error));
}

function shareComponent() {
  if (!navigator.share) {
    return null;
  }
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
      <Tooltip title="Share">
        <FloatingActionButton aria-label="Share" color="primary" onClick={share}>
          <Share />
        </FloatingActionButton>
      </Tooltip>
    </Box>
  );
}

function Home() {
  const { setThemeMode, setThemePalette, themeMode, themePalette } = useAppTheme();

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      {shareComponent()}
      <Stack spacing={2}>
        <Link style={{ textDecoration: 'none' }} to="/math/drill">
          <Button
            color="primary"
            fullWidth
            size="large"
            sx={{ minHeight: '48px' }}
            variant="contained"
          >
            Math Drill
          </Button>
        </Link>
        <Link style={{ textDecoration: 'none' }} to="/math/score">
          <Button
            color="primary"
            fullWidth
            size="large"
            sx={{ minHeight: '48px' }}
            variant="contained"
          >
            Scoreboard
          </Button>
        </Link>
        <Link style={{ textDecoration: 'none' }} to="/help">
          <Button
            color="primary"
            fullWidth
            size="large"
            sx={{ minHeight: '48px' }}
            variant="contained"
          >
            Help
          </Button>
        </Link>
      </Stack>

      <Box sx={{ mt: 4 }}>
        <Typography component="h2" sx={{ fontWeight: 600, mb: 1.5 }} variant="h6">
          Theme
        </Typography>
        <Box sx={{ mb: 2 }}>
          <ToggleButtonGroup
            aria-label="Theme mode"
            color="primary"
            exclusive
            onChange={(_event, newMode: ThemeMode | null) => {
              if (newMode) {
                setThemeMode(newMode);
              }
            }}
            value={themeMode}
          >
            <ToggleButton
              aria-label="Light mode"
              aria-pressed={themeMode === 'light'}
              sx={{ minHeight: '48px', minWidth: '100px' }}
              value="light"
            >
              <LightMode sx={{ mr: 1 }} /> Light
            </ToggleButton>
            <ToggleButton
              aria-label="Dark mode"
              aria-pressed={themeMode === 'dark'}
              sx={{ minHeight: '48px', minWidth: '100px' }}
              value="dark"
            >
              <DarkMode sx={{ mr: 1 }} /> Dark
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: {
              sm: 'repeat(4, 1fr)',
              xs: 'repeat(2, 1fr)',
            },
          }}
        >
          {VALID_THEME_PALETTES.map((key) => {
            const palette = PALETTES[key];
            const isSelected = key === themePalette;
            return (
              <Button
                aria-label={`${palette.name} palette`}
                aria-pressed={isSelected}
                key={key}
                onClick={() => setThemePalette(key)}
                sx={{
                  alignItems: 'center',
                  bgcolor: isSelected ? 'action.selected' : 'transparent',
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  borderWidth: isSelected ? 2 : 1,
                  display: 'flex',
                  flexDirection: 'column',
                  fontWeight: isSelected ? 700 : 500,
                  gap: 1,
                  minHeight: '48px',
                  py: 1,
                }}
                variant="outlined"
              >
                <Box sx={{ display: 'flex', gap: 0.75 }}>
                  <Box
                    aria-hidden="true"
                    sx={{
                      bgcolor: palette.primary[500],
                      borderRadius: '50%',
                      boxShadow: 1,
                      height: 18,
                      width: 18,
                    }}
                  />
                  <Box
                    aria-hidden="true"
                    sx={{
                      bgcolor: palette.secondary[500],
                      borderRadius: '50%',
                      boxShadow: 1,
                      height: 18,
                      width: 18,
                    }}
                  />
                </Box>
                <span>{palette.name}</span>
              </Button>
            );
          })}
        </Box>
      </Box>
    </Container>
  );
}

export default Home;
