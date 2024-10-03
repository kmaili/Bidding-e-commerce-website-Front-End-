import {createAction, props} from "@ngrx/store";
import {UserModel} from "../../models/userModel";

export const update = createAction(
  '[Auth] Update User',
  props<{ field: keyof UserModel, value: string}>()
)
export const updateSuccess = createAction(
  '[Auth] Update User Success',
  props<{ field: keyof UserModel, newValue: string}>()
)

export const updateFailure = createAction(
  '[Auth] Update User Failure',
  props<{ error: any }>()
)
export const login = createAction (
  '[Auth] Login',
  props<{user: UserModel}>()
);
export const signup = createAction(
  '[Auth] Signup',
  props<{user: UserModel}>()
);
export const authenticateWithToken = createAction(
  '[Auth] Authenticate with Token',
)
export const logout = createAction ('[Auth] Logout');
export const logoutSuccess = createAction (
  '[Auth] Logout Success'
);
export const logoutFailure = createAction (
  '[Auth] Logout Failure',
  props<{error: any}>()
);
export const loginSuccess = createAction (
  '[Auth] Login Success',
  props<{user: UserModel}>()
);
export const signupSuccess = createAction (
  '[Auth] Signup Success',
  props<{user: UserModel}>()
);
export const authenticateWithTokenSuccess = createAction (
  '[Auth] authenticate with Token Success',
  props<{user: UserModel}>()
);
export const loginFailure = createAction (
  '[Auth] Login Failure',
  props<{error: any}>()
);
export const signupFailure = createAction (
  '[Auth] Signup Failure',
  props<{error: any}>()
);
export const authenticateWithTokenFailure = createAction (
  '[Auth] authenticate with Token Failure',
  props<{error: any}>()
);

