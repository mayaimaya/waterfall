import { alpha, createTheme, responsiveFontSizes } from "@mui/material";

const violetBase = '#7F00FF';
const violetMain = alpha(violetBase, 0.7);
const styleOverrides =  { components: {
  MuiButton: {
    styleOverrides: {
      outlinedPrimary: {
        borderRadius: 20,
      },
    },
  },
  MuiTypography: {
    styleOverrides: {
      root: {
        fontFamily: 'Roboto, Arial, sans-serif',
        color: 'palette.text.primary',
      }
    }},
  MuiFab: {
    styleOverrides: {
      root: ({ ownerState }: { ownerState: { size?: string } }) => ({
        ...(ownerState.size === "large" && {
          width: 100,
          height: 100,
        }),
      }),
    },
    defaultProps: {
      size: "medium",
    },
    // variants: [
    //   {
    //     props: { variant: "square" },
    //     style: {
    //       borderRadius: 10,
    //     },
    //   },
    // ],
  },
}}
export const lightTheme = createTheme({
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
  },
    palette: {
      primary: {
        main: violetMain,
        light: alpha(violetBase, 0.5),
        dark: alpha(violetBase, 0.9),
      },
      background: {
        default: '#fff',
        paper: '#f5f5f5',
      },
      text: {
        primary: '#000',  
        secondary: '#555',
      },
      // secondary: {
      //   main: red[500],
      // },
      // success: {
      //   main: purple[500],
      // ,
      // ...styleOverrides
    }
    
});

export const darkTheme = createTheme({
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  palette: {
    primary: {
      main: violetMain,
      light: alpha(violetBase, 0.5),
      dark: alpha(violetBase, 0.9),
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#fff',
      secondary: '#ccc',
    },  
  },
  // ...styleOverrides
});

// export default responsiveFontSizes(theme);
