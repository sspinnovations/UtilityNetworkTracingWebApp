import { Observable, from, of, merge} from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable, Inject, Optional } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpResponseBase, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { AuthService } from './auth.service';
import { TraceType } from '../models/enums';
import { QueryNetworkMoments } from '../models/querynetworkmoments';
import { TracePayload } from '../models/tracepayload';
import { TraceResults } from '../models/traceresults';
import { TraceLocations } from '../models/tracelocations';
import { TraceConfiguration } from '../models/traceconfiguration';

@Injectable()
export class TraceService {
    private http: HttpClient;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(HttpClient) http: HttpClient, private _authService: AuthService) {
        this.http = http;
        this.baseUrl = environment.portalBaseURL;
    }

    /**
     * @f f
     * @traceType traceType
     * @traceLocations traceLocations
     * @traceConfiguration Trace Configuration
     * @return OK
     */
    public trace(tracePayload: TracePayload): Observable<TraceResults> {
        const ar = tracePayload.featureServiceUrl.split('/');
        ar[ar.length - 1] = 'UtilityNetworkServer';
        const traceUrl = `${ar.join('/')}/trace`;

        const formData = new FormData();
        formData.append('token', this._authService.token());
        formData.append('f', 'json');
        formData.append('gdbVersion', tracePayload.gdbVersion);
        formData.append('traceType', tracePayload.traceType);
        formData.append('traceLocations', JSON.stringify(tracePayload.traceLocations));
        formData.append('traceConfiguration', JSON.stringify(tracePayload.traceConfiguration));
        return this.http.post<TraceResults>(traceUrl, formData).pipe();
    }
}

export class SwaggerException extends Error {
    message: string;
    status: number; 
    response: string; 
    headers: { [key: string]: any; };
    result: any; 

    constructor(message: string, status: number, response: string, headers: { [key: string]: any; }, result: any) {
        super();

        this.message = message;
        this.status = status;
        this.response = response;
        this.headers = headers;
        this.result = result;
    }

    protected isSwaggerException = true;

    static isSwaggerException(obj: any): obj is SwaggerException {
        return obj.isSwaggerException === true;
    }
}

function blobToText(blob: any): Observable<string> {
    return new Observable<string>((observer: any) => {
        if (!blob) {
            observer.next("");
            observer.complete();
        } else {
            let reader = new FileReader(); 
            reader.onload = function() { 
                observer.next(this.result);
                observer.complete();
            }
            reader.readAsText(blob); 
        }
    });
}