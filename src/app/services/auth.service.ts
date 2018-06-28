import { Injectable } from '@angular/core';
import { AppStorage_Token, UserInfo as UI } from '../models/constants';
import { Router } from '@angular/router';
import { UserInfo } from '../models/user';

@Injectable()
export class AuthService {

  constructor(private _router: Router) { }

  public loggedIn(): boolean {
    if (localStorage[AppStorage_Token] != null) {
      return true;
    }

    return false;
  }

  public logout(): void {
    localStorage.clear();
    this._router.navigate(['home']);
  }

  public inspectResponse(response: any): boolean {
    if (response.hasOwnProperty('error'))
      return false;

    return true;
  }

  public token(): string {
    return localStorage[AppStorage_Token];
  }

  public token_set(token: string): void {
    localStorage[AppStorage_Token] = token;
  }

  public userInfo(): UserInfo {
    return <UserInfo>JSON.parse(localStorage[UI]);
  }

  public userInfo_set(username: string, password: string): void {
    const ui = new UserInfo();
    ui.username = username;
    ui.password = password;
    localStorage[UI] = JSON.stringify(ui);
  }

}
