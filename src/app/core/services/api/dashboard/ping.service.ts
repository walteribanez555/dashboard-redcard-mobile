import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PingService {


  private environment = environment;
  private http = inject(HttpClient);

  constructor() { }

  ping() {
    return this.http.get(`${this.environment.apiUrl}`);
  }

}
