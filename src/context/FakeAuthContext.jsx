import { createContext, useContext, useReducer } from "react";

const Authcontext = createContext();

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const initialState = {
  user: null,
  isAuthenticated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };

    case "logout":
      return { ...state, user: null, isAuthenticated: false };
  }
}
function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function login(password, email) {
    if (password === FAKE_USER.password && email === FAKE_USER.email)
      dispatch({ type: "login", payload: FAKE_USER });
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <Authcontext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </Authcontext.Provider>
  );
}

function useAuth() {
  const context = useContext(Authcontext);
  if (context === undefined)
    throw new Error("some crap about not having a context");
  return context;
}

export { AuthProvider, useAuth };
