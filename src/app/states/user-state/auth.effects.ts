import { Actions, createEffect, ofType } from '@ngrx/effects';
import {AuthenticationService} from "../../services/authentication.service";
import {
  authenticateWithToken,
  login,
  loginFailure,
  loginSuccess, logout, logoutFailure, logoutSuccess,
  signup,
  signupFailure,
  signupSuccess, update, updateSuccess
} from "./auth.actions";
import {catchError, map, of, switchMap} from "rxjs";
import {Injectable} from "@angular/core";
import {ToastrService} from "ngx-toastr";

@Injectable()
export class AuthStateEffects {
  constructor(private action$: Actions, private authService: AuthenticationService, private toast: ToastrService) {
  }


  login$ = createEffect(() =>
    this.action$.pipe(
      ofType(login),
      switchMap(action => this.authService.login(action.user).pipe(
        map(user => {
          this.toast.success(`Welcome ${user.username}`); // Show toast on error
          window.location.reload()
          return loginSuccess({user})}),
        catchError(error => {
          this.toast.error('Login failed. Please check your credentials.'); // Show toast on error
          return of(loginFailure({ error }));
        })
      ))
    ));

  signup$ = createEffect(() =>
    this.action$.pipe(
      ofType(signup), // Listen for the signup action
      switchMap(action => this.authService.signup(action.user).pipe( // Call the signup service
        map(user => {
          this.toast.success(`Signup successful. Welcome ${user.username}!`); // Show success toast
          window.location.reload()
          return signupSuccess({ user }); // Dispatch signupSuccess action with user details
        }),
        catchError(error => {
          this.toast.error('Signup failed. Please try again.'); // Show failure toast
          return of(signupFailure({ error })); // Dispatch signupFailure action with error details
        })
      ))
    )
  );

  authenticateWithToken$ = createEffect(() =>
    this.action$.pipe(
      ofType(authenticateWithToken),
      switchMap(_ => this.authService.authenticateWithToken().pipe(
        map(user => {
          this.toast.success(`Welcome ${user.username}`, 'Welcome',{timeOut: 1500,progressAnimation: 'increasing'}); // Show toast on error
          console.log(user)
          return loginSuccess({user})}),
        catchError(error => {
          this.toast.error('Login again', 'Token expired', {timeOut: 1500,progressAnimation: 'increasing'});
          return of(loginFailure({ error }));
        })
      ))
    ));
  logout$ = createEffect(() =>
    this.action$.pipe(
      ofType(logout),
      switchMap(_ => this.authService.logout().pipe(
        map(user => {
          this.toast.info(`See you soon`, 'Good By',{timeOut: 1500,progressAnimation: 'increasing'}); // Show toast on error
          return logoutSuccess()}),
        catchError(error => {
          this.toast.error(`Failed to logout ${error}`, 'Error', {timeOut: 1500,progressAnimation: 'increasing'});
          return of(logoutFailure({ error }));
        })
      ))
    ));
  update$ = createEffect(() =>
    this.action$.pipe(
      ofType(update),
      switchMap(action => this.authService.update(action.field.toString(), action.value).pipe(
        map(updatedData => {
          this.toast.success(`${updatedData.field} Updated`, 'Updated',{timeOut: 1500,progressAnimation: 'increasing'}); // Show toast on error
          return updateSuccess({field: updatedData.field, newValue: updatedData.newValue})}),
        catchError(error => {
          this.toast.error(`Failed to logout ${error}`, 'Error', {timeOut: 1500,progressAnimation: 'increasing'});
          return of(logoutFailure({ error }));
        })
      ))
    ));
}
