import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  signupApiUrl: string = "http://localhost:8080/api/users/add";
  loginApiUrl: string = "http://localhost:8080/api/users/authenticate";
  authApiUrl: string = "http://localhost:8080/api/users/profile";
  logoutApiUrl: string = "http://localhost:8080/api/users/logout";
  updateUserApiUrl: string = "http://localhost:8080/api/users/update";

  constructor(private http: HttpClient) { }

  signup(userData: any): Observable<any> {
    return this.http.post(this.signupApiUrl, userData, {withCredentials: true});
  }

  login(userData: any): Observable<any> {
    return this.http.post(this.loginApiUrl, userData, {withCredentials: true});
  }

  authenticateWithToken(): Observable<any> {
    return this.http.get(this.authApiUrl, {withCredentials: true});
  }

  logout(): Observable<any> {
    return this.http.post(this.logoutApiUrl, {}, {withCredentials: true});
  }

  update(field: string, value: string): Observable<any> {
    return this.http.patch(this.updateUserApiUrl, { 'field': field, 'value': value }, {withCredentials: true});
  }
}
