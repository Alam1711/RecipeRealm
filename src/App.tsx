import { ChakraProvider, theme } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppShell from "./authentication/AppShell";
import AuthProvider from "./authentication/authProvider";
import SignUp from "./pages/Login/signup";
import store from "./redux/store";

export const App = () => (
  <Provider store={store}>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="Signup" element={<SignUp />} />
        </Routes>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  </Provider>
);
