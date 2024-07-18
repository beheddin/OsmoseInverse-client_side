import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { ParametreStationInterface } from '../Interfaces/parametre-station.interface';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ParametreStationService {
  private baseUrl: string = environment.PARAMETRE_STATION_API_URL;

  private parametresStationsUpdated = new Subject<void>();
  parametresStationsUpdated$ = this.parametresStationsUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getParametresStations(): Observable<ParametreStationInterface[]> {
    return this.http.get<ParametreStationInterface[]>(
      `${this.baseUrl}/get/all`
    );
  }

  getParametreStationById(id: string): Observable<ParametreStationInterface> {
    return this.http.get<ParametreStationInterface>(
      `${this.baseUrl}/get/${id}`
    );
  }

  postParametreStation(
    parametreStation: ParametreStationInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .post<MessageResponseInterface>(`${this.baseUrl}/post`, parametreStation)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  putParametreStation(
    id: string,
    parametreStation: ParametreStationInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(
        `${this.baseUrl}/put/${id}`,
        parametreStation
      )
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  deleteParametreStation(id: string): Observable<MessageResponseInterface> {
    return this.http
      .delete<MessageResponseInterface>(`${this.baseUrl}/delete/${id}`)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  notifyParametresStationsUpdated() {
    this.parametresStationsUpdated.next();
  }
}
