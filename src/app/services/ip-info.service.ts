import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IpInfoService {

  private apiUrl = 'https://ipinfo.io?token=a8d800cc163bbf';

  constructor(private http: HttpClient) { }

  getIpInfo(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
