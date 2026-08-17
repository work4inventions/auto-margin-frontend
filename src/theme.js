import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#5B5FEF",
      light: "#7C83FF",
      dark: "#4549D6",
      contrastText: "#ffffff",
    },

    secondary: {
      main: "#8B5CF6",
      light: "#A78BFA",
      dark: "#7C3AED",
      contrastText: "#ffffff",
    },

    success: {
      main: "#10B981",
    },

    warning: {
      main: "#F59E0B",
    },

    error: {
      main: "#EF4444",
    },

    info: {
      main: "#3B82F6",
    },

    text: {
      primary: "#111827",
      secondary: "#6B7280",
    },

    background: {
      default: "#F5F7FB",
      paper: "#FFFFFF",
    },

    divider: "#E5E7EB",
  },

  gradients: {
    primary: "linear-gradient(135deg, #5B5FEF 0%, #8B5CF6 100%)",

    secondary: `
      linear-gradient(
        180deg,
        rgba(91,95,239,0.05) 0%,
        rgba(139,92,246,0.05) 100%
      )
    `,
  },

  typography: {
    fontFamily: `'Inter', 'Roboto', 'Arial', sans-serif`,

    h1: {
      color: "#111827",
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.2,
    },

    h2: {
      color: "#111827",
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: 1.3,
    },

    h3: {
      color: "#111827",
      fontWeight: 600,
      fontSize: "1.5rem",
    },

    h4: {
      color: "#111827",
      fontWeight: 600,
      fontSize: "1.25rem",
    },

    h5: {
      color: "#111827",
      fontWeight: 600,
    },

    h6: {
      color: "#111827",
      fontWeight: 600,
    },

    body1: {
      color: "#6B7280",
      fontSize: "1rem",
      lineHeight: 1.7,
    },

    body2: {
      color: "#6B7280",
      fontSize: "0.9rem",
      lineHeight: 1.6,
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
      fontSize: "0.95rem",
    },
  },

  shape: {
    borderRadius: 16,
  },

  shadows: [
    "none",
    "0 1px 2px rgba(0,0,0,0.05)",
    "0 4px 10px rgba(0,0,0,0.06)",
    "0 10px 30px rgba(0,0,0,0.08)",
    ...Array(21).fill("0 10px 30px rgba(0,0,0,0.08)"),
  ],

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F5F7FB",
          color: "#111827",
          scrollBehavior: "smooth",

          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },

          "&::-webkit-scrollbar-thumb": {
            background: "#C7D2FE",
            borderRadius: "999px",
          },

          "&::-webkit-scrollbar-track": {
            background: "#EEF2FF",
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
          background: "#FFFFFF",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          border: "1px solid #E5E7EB",
          backdropFilter: "blur(10px)",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "18px",
          backgroundImage: "none",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          padding: "10px 20px",
          transition: "all 0.3s ease",
          boxShadow: "none",

          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 20px rgba(91,95,239,0.25)",
          },
        },

        containedPrimary: {
          background:
            "linear-gradient(135deg, #5B5FEF 0%, #8B5CF6 100%)",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "14px",
          backgroundColor: "#FFFFFF",

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#5B5FEF",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#5B5FEF",
            borderWidth: "2px",
            boxShadow: "0 0 0 4px rgba(91,95,239,0.12)",
          },
        },

        notchedOutline: {
          borderColor: "#E5E7EB",
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #F1F5F9",
          padding: "16px",
        },

        head: {
          color: "#111827",
          fontWeight: 700,
          backgroundColor: "#F9FAFB",
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          fontWeight: 600,
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#111827",
          color: "#ffffff",
          borderRight: "none",
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 1px 10px rgba(0,0,0,0.04)",
          color: "#111827",
        },
      },
    },
  },
});

export default theme;