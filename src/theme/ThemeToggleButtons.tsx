import { Box, Button, useTheme } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useContext } from 'react';
import { ColorModeContext } from './AppThemeProvider';

const ThemeToggleButtons = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const themeMode = theme.palette.mode;

  const activeStyle = theme.custom.toggleButton.active[themeMode];
  const inactiveStyle = theme.custom.toggleButton.inactive[themeMode];
  const containerBg = theme.custom.toggleButton.containerBg[themeMode];

  return (
    <Box
      sx={{
        p: 0.5,
        display: 'flex',
        bgcolor: containerBg,
        borderRadius: '10px',
        width: '100%',
      }}
    >
      <Button
        onClick={() => themeMode !== 'dark' && colorMode.toggleColorMode()}
        startIcon={<DarkModeIcon />}
        disableElevation
        disableRipple
        sx={{
          flex: 1,
          borderRadius: '10px',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.9rem',
          bgcolor: themeMode === 'dark' ? activeStyle.bgcolor : inactiveStyle.bgcolor,
          color: themeMode === 'dark' ? activeStyle.color : inactiveStyle.color,
          '&:hover': {
            bgcolor: themeMode === 'dark'
              ? activeStyle.hoverBg || activeStyle.bgcolor
              : inactiveStyle.hoverBg,
          },
        }}
      >
        Dark
      </Button>

      <Button
        onClick={() => themeMode !== 'light' && colorMode.toggleColorMode()}
        startIcon={<LightModeIcon />}
        disableElevation
        disableRipple
        sx={{
          flex: 1,
          borderRadius: '10px',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.9rem',
          bgcolor: themeMode === 'light' ? activeStyle.bgcolor : inactiveStyle.bgcolor,
          color: themeMode === 'light' ? activeStyle.color : inactiveStyle.color,
          '&:hover': {
            bgcolor: themeMode === 'light'
              ? activeStyle.hoverBg || activeStyle.bgcolor
              : inactiveStyle.hoverBg,
          },
        }}
      >
        Light
      </Button>
    </Box>
  );
};

export default ThemeToggleButtons;
