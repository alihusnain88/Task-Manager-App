import React, { useMemo, useContext } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { toggleMode } from "../store/slices/themeSlice";

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

export default function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useSelector((state: RootState) => state.theme.mode); 
  const dispatch = useDispatch<AppDispatch>();

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => dispatch(toggleMode()),
    }),
    [dispatch] 
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode as 'dark' | 'light',
          ...(mode === "dark"
            ? {
              customColor: {main: '#f09'},
                primary: { main: "#2563eb", contrastText: "#ffffff" },
                background: { default: "#2a2d32", paper: "#1c1c1e" },
                text: { primary: "#ffffff", secondary: "rgba(255,255,255,0.7)" },
              }
            : {
                primary: { main: "#2563eb" },
                background: { default: "#eaecefff", paper: "#ffffff" },
                text: { primary: "#2a2d32", secondary: "#4b5563" },
              }),
        },

        shape: { borderRadius: 5 },

        shadows:
          mode === "dark"
            ? [
                "none",
                "0 1px 3px rgba(0,0,0,0.5)",
                "0 4px 8px rgba(0,0,0,0.7)",
                ...Array(22).fill("none"),
              ]
            : [
                "none",
                "0 1px 3px rgba(0,0,0,0.1)",
                "0 4px 8px rgba(0,0,0,0.15)",
                ...Array(22).fill("none"),
              ],

        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          button: { textTransform: "none", fontWeight: 600 },
        },

        custom: {
          toggleButton: {
            active: {
              dark: { bgcolor: "#1a1b1f", color: "#ffffff", hoverBg: "#1a1b1f" },
              light: { bgcolor: "#e0e0e0", color: "#000000", hoverBg: "#d6d6d6" },
            },
            inactive: {
              dark: { bgcolor: "transparent", color: "#ffffff", hoverBg: "rgba(26,27,31,0.08)" },
              light: { bgcolor: "transparent", color: "#000000", hoverBg: "rgba(0,0,0,0.08)" },
            },
            containerBg: { dark: "#3a3e44", light: "#d9d9d9" },
          },
          interactiveBorder: {
            width: "1.5px",
            active: { borderColor: "#3562e3" },
            inactive: { borderColor: "transparent" },
            hover: { inactiveBorderColor: mode === "dark" ? "#6b7280" : "#9ca3af" },
            background: "transparent",
          },
          taskCard: {
            shadow: {
              default: mode === "dark" ? "0 1px 3px rgba(0,0,0,0.5)" : "0 1px 3px rgba(0,0,0,0.1)",
              hover: mode === "dark" ? "0 4px 8px rgba(0,0,0,0.7)" : "0 4px 8px rgba(0,0,0,0.15)",
            },
            borderRadius: "6px",
          },
        },

        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 50,
                boxShadow: "none",
                backgroundColor: mode === "dark" ? "#2563eb" : "rgb(195 218 250)",
                color: mode === "dark" ? "#ffffff" : "inherit",
                "&:hover": {
                  boxShadow: "none",
                  backgroundColor: mode === "dark" ? "#1d4ed8" : "rgb(175 198 230)",
                },
              },
            },
          },

          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                "& fieldset": { borderColor: mode === "dark" ? "#454547" : "#e0e0e0" },
                "&:hover fieldset": { borderColor: mode === "dark" ? "#888" : "#aaa" },
                "&.Mui-focused fieldset": { borderColor: "#2563eb" },
              },
            },
          },

          MuiDialog: {
            styleOverrides: {
              paper: {
                backgroundColor: mode === "dark" ? "#1c1c1e" : "#ffffff",
                backgroundImage: "none",
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> 
        {children} 
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
