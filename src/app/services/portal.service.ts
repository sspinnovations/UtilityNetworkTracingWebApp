import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { UNItem } from '../models/unitem';

@Injectable()
export class PortalService {

  constructor(private http: HttpClient,
            private _authService: AuthService) { }

  public authenticate(username: string, password: string): Observable<any> {
    let formData = new FormData();
    formData.append('username',username);
    formData.append('password',password);
    formData.append('referer', window.location.host);
    formData.append('expiration','840');
    formData.append('f','pjson');

    return this.http.post<any>(`${environment.portalBaseURL}sharing/rest/generateToken`,formData).pipe();
  }

  public items(amount: number): Observable<any> {
    let formData = new FormData();
    formData.append('token',this._authService.token());
    formData.append('f','pjson');
    formData.append('num',amount.toString());
    formData.append('q',`owner:${this._authService.userInfo().username}`);

    return this.http.post<any>(`${environment.portalBaseURL}sharing/rest/search`,formData).pipe();
  }

  public item_get(itemId: string): Observable<any> {
    const url = `${environment.portalBaseURL}/sharing/rest/content/items/${itemId}/data`;
    
    let formData = new FormData();
    formData.append('token',this._authService.token());
    formData.append('f','json');

    return this.http.post<any>(url,formData).pipe();
  }

  public webMaps_extract(itemData: any): UNItem[] {
    let webMaps: UNItem[] = new Array();
    let results = <any[]>itemData.results;
    results.forEach((item) => {
        if (item.type === 'Web Map')
          webMaps.push(item);
    });
    return webMaps;
  }

}
