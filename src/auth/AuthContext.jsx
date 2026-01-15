import { createContext } from "react";

const AuthContext = createContext({
  admin: null,           // full admin object
  isAuthenticated: false,
  permissions: [],
  loading: true,         // true until /me is fetched
  login: async () => {}, // function to call login API
  logout: async () => {},// function to call logout API
  refresh: async () => {},// refetch /me
  can: (perm) => false,  // permission checker
});

export default AuthContext;
