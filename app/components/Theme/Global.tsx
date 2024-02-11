import React, { useMemo, useEffect } from "react";
import {
  alpha,
  createTheme,
  darken,
  ThemeProvider,
} from "@mui/material/styles";
import { grey, yellow } from "@mui/material/colors";
import { parseCookie } from "@/services/utils";
import { CssBaseline } from "@mui/material";
import { Theme, useThemeState } from "@/redux/theme/themeSlice";

export interface GlobalTheme {
  children?: React.ReactNode;
}

/**
 * TODO: Clean this please
 * Generic Font Sizes
 */
export enum FONT_SIZE {
  Xxsmall = "calc(8px + 0.3vmax)",
  Xsmall = "calc(8px + 0.4vmax)",
  Small = "calc(8px + 0.5vmax)",
  Medium = "calc(10px + 0.5vmax)",
  Large = "calc(10px + 0.75vmax)",
  Xlarge = "calc(15px + 1vmax)",
  Xxlarge = "calc(20px + 1.35vmax)",
  Xxxlarge = "calc(40px + 2vmax)",
}

export const PAGE_HEIGHT = "calc(100vh - 200px)";

/** Check Module Augmentation to enable custom palette */
declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    mobile: true; // adds the `mobile` breakpoint
    tablet: true;
    laptop: true;
    desktop: true;
  }

  interface TypeBackground {
    paper: string;
    light: string;

    default: string;
    dark: string;
    darker: string;
  }
}

export const GlobalTheme: React.FC<GlobalTheme> = (props) => {
  const { children } = props;
  const { useTheme, toggleTheme, updateTheme } = useThemeState();
  const { theme: mode } = useTheme();

  /** TODO: Clean this please */
  const theme = useMemo(() => {
    return createTheme({
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            "@font-face": {
              fontFamily: "Roboto",
            },
            "*::-webkit-scrollbar": {
              width: 8,
              height: 8,
            },
            ...(mode === "light"
              ? {
                  "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                    // backgroundColor: '#7D8F69',
                  },
                  "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                    backgroundColor: "#557153",
                  },
                  "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
                    {
                      backgroundColor: "#7D8F69",
                    },
                }
              : {
                  "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                    // backgroundColor: grey[900],
                  },
                  "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                    backgroundColor: alpha(grey[800], 0.75),
                  },
                  "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
                    {
                      backgroundColor: alpha(yellow[800], 0.5),
                    },
                }),
          },
        },
      },
      breakpoints: {
        values: {
          // default
          xs: 0,
          sm: 600,
          md: 900,
          lg: 1200,
          xl: 1536,
          // custom
          mobile: 0,
          tablet: 640,
          laptop: 1024,
          desktop: 1200,
        },
      },
      palette: {
        mode,
        ...(mode === "light"
          ? {
              background: {
                paper: grey[100],
                default: grey[200],

                light: grey[50],
                dark: grey[300],
                darker: grey[400],
              },
              primary: {
                light: yellow[600],
                main: yellow[700],
                dark: darken(yellow[800], 0.25),
                contrastText: "#FFFFFF",
              },
              secondary: {
                light: grey[50],
                main: grey[200],
                dark: grey[300],
                contrastText: "#000000",
              },
            }
          : {
              background: {
                paper: darken(grey[900], 0.5),
                default: darken(grey[700], 0.75),

                light: grey[500],
                dark: darken(grey[900], 0.75),
                darker: darken(grey[900], 1),
              },
              primary: {
                light: yellow[700],
                main: yellow[800],
                dark: "#000000",
                contrastText: "#FFFFFF",
              },
              secondary: {
                main: alpha(yellow[800], 0.75),
                dark: grey[800],
                contrastText: "#FFFFFF",
              },
            }),
      },
    });
  }, [mode]);

  /** Use stored theme in cookies during initial load*/
  useEffect(() => {
    const app_theme = parseCookie("global-theme") || mode;
    updateTheme({ theme: app_theme as Theme });
    // eslint-why set mode only on initial load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Update stored theme in cookie */
  useEffect(() => {
    document.cookie = `global-theme=${mode}; path=/`;
  }, [mode]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </>
  );
};

export default GlobalTheme;
