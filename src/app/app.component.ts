import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private _router: Router,
            private _authService: AuthService) {}

  public logout(): void {
    localStorage.clear();
    this._router.navigate(['/authenticate']);
  }

  public loggedIn(): boolean {
    return this._authService.loggedIn();
  }
}
