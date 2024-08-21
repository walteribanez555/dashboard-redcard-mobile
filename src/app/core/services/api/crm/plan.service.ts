
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Plan } from '../../../models/plan.model';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/planes';

  constructor() {}
  getAll(): Observable<Plan[]> {
    return this.http.get<Plan[]>(this.apiUrl);
  }

  //Get with the id_service
  getOne(id: string | number): Observable<Plan[]> {
    return this.http.get<Plan[]>(this.apiUrl + `?id=${id}`);
  }
  create(item: Plan): Observable<Plan> {
    throw new Error('Method not implemented.');
  }
  update(id: string | number, item: Plan): Observable<Plan> {
    throw new Error('Method not implemented.');
  }
  delete(id: string | number): Observable<any> {
    throw new Error('Method not implemented.');
  }

}
