import { Component, OnInit } from '@angular/core';
import { PortalService } from '../../services/portal.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ErrorDetails } from '../../models/serviceerror';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css'],
  providers: [PortalService]
})
export class AuthenticateComponent implements OnInit {

  constructor(private _portalService: PortalService,
            private _router: Router,
          private _authService: AuthService) { }

  public username: string;
  public password: string;
  public errorMessage: string;

  ngOnInit() {
  }

  public login(): void {
    this.errorMessage = null;
      this._portalService.authenticate(this.username, this.password)
        .subscribe(resp => {
          if (this._authService.inspectResponse(resp)) {
            this._authService.token_set(resp.token);
            this._authService.userInfo_set(this.username, this.password);
            this._router.navigate(['home']);
          } else {
            this.errorSet(resp.error);
          }
        });
  }

  private errorSet(errorObject: ErrorDetails): void {
      this.errorMessage = errorObject.message;
  }

}
