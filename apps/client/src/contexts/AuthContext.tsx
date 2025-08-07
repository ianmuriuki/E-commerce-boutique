import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { User } from "../types";
import { authService } from "../services/authService";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_LOADING"; payload: boolean };

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true, error: null };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    // Check for stored auth token on app load
    const token = localStorage.getItem("luxora_token");
    if (token) {
      // In a real app, you'd validate the token with the server
      const userData = localStorage.getItem("luxora_user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          dispatch({ type: "LOGIN_SUCCESS", payload: user });
        } catch (error) {
          localStorage.removeItem("luxora_token");
          localStorage.removeItem("luxora_user");
        }
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: "LOGIN_START" });

    try {
      const response = await authService.login({ email, password });
      localStorage.setItem("luxora_token", response.data.accessToken);
      const user: User = {
        ...response.data.user,
        _id: response.data.user.id ?? "",
        address: response.data.user.address
          ? {
              street: response.data.user.address.street ?? "",
              city: response.data.user.address.city ?? "",
              state: response.data.user.address.state ?? "",
              zipCode: response.data.user.address.zipCode ?? "",
              country: response.data.user.address.country ?? "",
            }
          : undefined,
        createdAt: response.data.user.createdAt ?? "",
        updatedAt: response.data.user.updatedAt ?? "",
      };
      localStorage.setItem("luxora_user", JSON.stringify(user));
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    dispatch({ type: "LOGIN_START" });

    try {
      const response = await authService.signup({ email, password, name });
      if (response.data.accessToken) {
        localStorage.setItem("luxora_token", response.data.accessToken);
        const user: User = {
          ...response.data.user,
          _id: response.data.user.id ?? "",
          address: response.data.user.address
            ? {
                street: response.data.user.address.street ?? "",
                city: response.data.user.address.city ?? "",
                state: response.data.user.address.state ?? "",
                zipCode: response.data.user.address.zipCode ?? "",
                country: response.data.user.address.country ?? "",
              }
            : undefined,
          createdAt: response.data.user.createdAt ?? "",
          updatedAt: response.data.user.updatedAt ?? "",
        };
        localStorage.setItem("luxora_user", JSON.stringify(user));
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Signup failed";
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("luxora_token");
    localStorage.removeItem("luxora_user");
    dispatch({ type: "LOGOUT" });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
