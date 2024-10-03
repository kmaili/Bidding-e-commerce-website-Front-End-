import { Action, createReducer, on } from '@ngrx/store';
import { AuthState, initialState } from './auth.state';
import {
  authenticateWithToken, authenticateWithTokenFailure, authenticateWithTokenSuccess,
  login, loginFailure, loginSuccess,
  logout, logoutFailure, logoutSuccess,
  signup, signupFailure, signupSuccess, update, updateFailure, updateSuccess
} from './auth.actions';
import {state} from "@angular/animations";
import {UserModel} from "../../models/userModel";

export const AuthReducer = createReducer(
  initialState,
  on(login, signup, authenticateWithToken, (state) => ({ ...state, error: null })),
  on(loginSuccess, signupSuccess, authenticateWithTokenSuccess, (state, { user }) => ({ ...state, isLoggedIn: true, user, error: null })),
  on(loginFailure, signupFailure, authenticateWithTokenFailure, (state, { error }) => ({ ...state, isLoggedIn: false, error })),
  on(logout, (state) => ({ ...state, error: null })),
  on(logoutSuccess, (state) => ({ ...state, isLoggedIn: false, user: new UserModel(), error: null })),
  on(logoutFailure, (state, { error }) => ({ ...state, error })),
  on(update, (state) => ({...state, error: null })),
  on(updateSuccess, (state, { field, newValue }) => ({
    ...state, // Spread the existing state
    user: {
      ...state.user, // Spread the existing user object
      [field]: newValue, // Update the specific field using a computed property name
    },
  })),
  on(updateFailure, (state, {error}) => ({...state, error})),
);

export function reducer(state: AuthState | undefined, action: Action) {
  return AuthReducer(state, action);
}
