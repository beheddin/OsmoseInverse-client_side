import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { StationInterface } from '../Interfaces/station.interface';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class StationService {
  private baseUrl: string = environment.STATION_API_URL;

  private stationsUpdated = new Subject<void>();
  stationsUpdated$ = this.stationsUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getStations(): Observable<StationInterface[]> {
    return this.http.get<StationInterface[]>(`${this.baseUrl}/get/all`);
  }

  getStationById(id: string): Observable<StationInterface> {
    return this.http.get<StationInterface>(`${this.baseUrl}/get/${id}`);
  }

  postStation(station: StationInterface): Observable<MessageResponseInterface> {
    return this.http
      .post<MessageResponseInterface>(`${this.baseUrl}/post`, station)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  putStation(
    id: string,
    station: StationInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(`${this.baseUrl}/put/${id}`, station)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  deleteStation(id: string): Observable<MessageResponseInterface> {
    return this.http
      .delete<MessageResponseInterface>(`${this.baseUrl}/delete/${id}`)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  toggleIsActive(id: string): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(`${this.baseUrl}/toggleIsActive/${id}`, {})
      .pipe(map((response: MessageResponseInterface) => response));
  }

  notifyStationsUpdated() {
    this.stationsUpdated.next();
  }
}
