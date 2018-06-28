import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class FeatureService {

  private _featureServiceUrl: string;

  constructor(private _http: HttpClient, private _authService: AuthService) { 
    this._featureServiceUrl = "https://cen0-pddemo01.sspinnovations.com/server/rest/services/Electric_Distribution_Utility_Network/FeatureServer/";
  }

  public getFeatures(layerId: number, gdbVersion: string, objectIds: Array<number>): Observable<any> {
    const strObjectIds = objectIds.join(",");

    const queryUrl = this._featureServiceUrl + layerId + "/query";

    let formData = new FormData();
    formData.append('token', this._authService.token());
    formData.append('f', 'json');
    formData.append('gdbVersion', gdbVersion);
    formData.append('objectIds', strObjectIds);
    formData.append('outFields', '*')

    return this._http.post<any>(queryUrl, formData).pipe();
  }

}
