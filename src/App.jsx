import React, { Suspense } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, CssBaseline } from "@mui/material";
import store from "./redux/store/index";
import RootNavigation from "./RootNavigation";
import LoadingSpinner from "./components/common/LoadingSpinner";
import theme from "./theme";
import { ThemeProvider as AppThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ReduxProvider store={store}>
      <AppThemeProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <RootNavigation />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
      </AppThemeProvider>
    </ReduxProvider>
  );
}

export default App;
