import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {interval, Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Slide} from '../models/slide';
import {flatMap, map} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded; application/json; charset=utf-8'
  })
};

@Injectable({
  providedIn: 'root'
})
export class DataService {

  activeSlide: EventEmitter<Slide> = new EventEmitter<Slide>();

  listSlide: Slide[] = [];

  constructor(private http: HttpClient) {
  }

  getListSlide(address): Observable<Slide[]> {
    return this.http.post(environment.apiUrl + '/display', JSON.stringify({ip_adr: address}), httpOptions)
      .pipe(map(res => {
        this.listSlide = [].slice.call(res);
        return this.listSlide = this.listSlide.map(function (data: any) {
          return {
            limit: data.limit,
            name: data.name,
            object_id: data.object_id,
            object_mosaic: data.object_mosaic,
            object_picture: data.object_picture,
            object_price: data.object_price,
            object_video: data.object_video,
            text: data.text,
            time_show: data.time_show,
            title: data.title,
            type_object_id: data.type_object_id
          };
        });
      }));
  }

  setActiveSlide(slide: Slide) {
    this.activeSlide.emit(slide);
  }

  updateMonitor(monitor): Observable<any> {
    return this.http.post(environment.apiUrl + '/display_update', JSON.stringify(monitor), httpOptions);
  }

  checkUpdate(address: string): Observable<any> {
    return interval(120000).pipe(flatMap(() => {
      return this.http.post(environment.apiUrl + '/display_fl', JSON.stringify({ip_adr: address}), httpOptions);
    }));
  }
}


