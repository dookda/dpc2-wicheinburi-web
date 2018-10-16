import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public cgiUrl: any = 'http://cgi.uru.ac.th/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature';

  constructor(
    private http: HttpClient
  ) {
  }

  getParcelInfo(lon: number, lat: number) {
    return new Promise((resolve, reject) => {
      this.http.get(this.cgiUrl + '&typeName=cashew:cashew_4326&CQL_FILTER=INTERSECTS(geom,POINT(' +
        lon + '%20' + lat + '))&outputFormat=application%2Fjson')
        .subscribe((res: any) => {
          resolve(res);
        }, (error) => {
          reject(error);
        });
    });
  }

  getParcel() {
    return new Promise((resolve, reject) => {
      this.http.get(this.cgiUrl + '&typeName=cashew:cashew_4326&outputFormat=application%2Fjson')
        .subscribe((res: any) => {
          resolve(res);
        }, (error) => {
          reject(error);
        });
    });
  }

  // getAccCheckpoint(): Observable<Item[]> {
  //   return this.http.get(this.url + '&typeName=hms:ac_checkpoint2018_v&outputFormat=application%2Fjson')
  //     .map(res => <Item[]>res);
  // }
}
