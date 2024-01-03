import { createTheme } from "@mui/material";
import color from "./colors";

export const theme = createTheme({
  palette: {
    error: {
      main: color.background[400],
    },
    gray: {
      main: color.text[300],
    },
    background: {
      primary: color.background[100],
      secondary: color.background[200],
      third: color.background[300],
      hovered: color.background[400],
    },
    text: {
      primary: color.text[100],
      second: color.text[200],
      third: color.text[300],
      onStatus: color.text[400],
      checked: color.text[500],
      active: color.text[600],
      buttonText: color.text[700],
      pending: color.text[800],
    },
  },
  typography: {
    fontFamily: `"Inter", sans-serif `,
    button: {
      textTransform: "none",
    },
    fontWeightBold: 700,
    fontWeightSemiBold: 600,
    fontWeightMedium: 500,
    fontWeightRegular: 400,
    fontWeightLight: 300,
  },
});
