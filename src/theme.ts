// import { Theme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      toggleButton: {
        active: { dark: { bgcolor: string; color: string; hoverBg: string }; light: { bgcolor: string; color: string; hoverBg: string } };
        inactive: { dark: { bgcolor: string; color: string; hoverBg: string }; light: { bgcolor: string; color: string; hoverBg: string } };
        containerBg: { dark: string; light: string };
      };
      interactiveBorder: {
        width: string;
        active: { borderColor: string };
        inactive: { borderColor: string };
        hover: { inactiveBorderColor: string };
        background: string;
      };
      taskCard: {
        shadow: { default: string; hover: string };
        borderRadius: string;
      };
    };
  }

  interface ThemeOptions {
    custom?: Theme["custom"];
  }
}
