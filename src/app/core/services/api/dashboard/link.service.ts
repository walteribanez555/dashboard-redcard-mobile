import { inject, Injectable } from '@angular/core';
import { Link } from '../../../../modules/dashboard/models/link.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LinkService {

  constructor() { }

  // id? : number,
  // link_id? : number,
  // title : string,
  // subtitle: string,
  // url : string,
  // status : number,

  apiMobile = environment.apiMobile+'/links';
  private http = inject(HttpClient);

  // mockData : Link[] = [
  //   {
  //     id: 1,
  //     link_id: 1,
  //     title: 'Google',
  //     subtitle: 'Search Engine',
  //     url: 'https://www.google.com',
  //     status: 2
  //   },
  //   {
  //     id: 2,
  //     link_id: 2,
  //     title: 'Facebook',
  //     subtitle: 'Social Media',
  //     url: 'https://www.facebook.com',
  //     status: 1
  //   },
  //   {
  //     id: 3,
  //     link_id: 3,
  //     title: 'Twitter',
  //     subtitle: 'Social Media',
  //     url: 'https://www.twitter.com',
  //     status: 1
  //   }
  // ]



  getLinks() : Observable<Link[]> {

    return this.http.get<Link[]>(this.apiMobile);


  }

  getLinkById(id: number) : Observable<Link[]> {
    return this.http.get<Link[]>(`${this.apiMobile}?id=${id}`);

    // return new Observable<Link>(observer => {
    //   observer.next(this.mockData.find(link => link.id === id));
    //   observer.complete();
    // })
  }

  createLink(link : Link) : Observable<Link> {
    return this.http.post<Link>(this.apiMobile, link);
  }

  updateLink(link : Link)  {
    return this.http.put<Link>(`${this.apiMobile}/${link.id}`, link);

  }

  deleteLink(id : number) {
    return this.http.delete<Link>(`${this.apiMobile}/${id}`);
    // return new Observable<Link>(observer => {
    //   let index = this.mockData.findIndex(link => link.id === id);
    //   let link = this.mockData[index];
    //   this.mockData.splice(index, 1);
    //   observer.next(link);
    //   observer.complete();
    // })
  }



}
