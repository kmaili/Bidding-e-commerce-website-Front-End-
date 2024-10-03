import {UserModel} from "../../models/userModel";

export interface AuthState {
  isLoggedIn: boolean;
  user: UserModel;
  error: any;
}

export const initialState: AuthState = {
  isLoggedIn: false,
  user: new UserModel(),
  error: null,
};
