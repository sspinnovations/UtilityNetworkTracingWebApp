import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable()
export class AuthguardGuard implements CanActivate {
  constructor(private _authService: AuthService,
            private _router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      if (this._authService.loggedIn()) {
        return true;
      }

        this._router.navigate(['/authenticate']);
        return false;
  }
}
