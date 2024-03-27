import { Route, Routes } from "react-router-dom";

import LoginPage from "./LoginPage.jsx";
import RegisterPage from "./RegisterPage.jsx";
import UserContextProvider from "../lib/contexts/UserContext.jsx";
import AccountPage from "./AccountPage.jsx";
import Layout from "../Layout.jsx";

export default function IndexPage() {
  function IndexPage() {
    return <div>Index Page</div>;
  }

  function BrowserRoutes() {
    return (
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account/:subpage?" element={<AccountPage />} />
            <Route
              path="/account/:subpage/:action?"
              element={<AccountPage />}
            />
          </Route>
        </Routes>
      </UserContextProvider>
    );
  }
  return (
    BrowserRoutes()
  );
}
