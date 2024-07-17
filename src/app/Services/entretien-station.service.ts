import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { EntretienStationInterface } from '../Interfaces/entretien-station.interface';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class EntretienStationService {
  private baseUrl: string = environment.STATION_ENTRETIEN_API_URL;

  private entretiensStationsUpdated = new Subject<void>();
  entretiensStationsUpdated$ = this.entretiensStationsUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getEntretiensStations(): Observable<EntretienStationInterface[]> {
    return this.http.get<EntretienStationInterface[]>(
      `${this.baseUrl}/get/all`
    );
  }

  getEntretienStationById(id: string): Observable<EntretienStationInterface> {
    return this.http.get<EntretienStationInterface>(
      `${this.baseUrl}/get/${id}`
    );
  }

  postEntretienStation(
    entretienStation: EntretienStationInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .post<MessageResponseInterface>(`${this.baseUrl}/post`, entretienStation)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  putEntretienStation(
    id: string,
    entretienStation: EntretienStationInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(
        `${this.baseUrl}/put/${id}`,
        entretienStation
      )
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  deleteEntretienStation(id: string): Observable<MessageResponseInterface> {
    return this.http
      .delete<MessageResponseInterface>(`${this.baseUrl}/delete/${id}`)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  toggleIsExternalEntretienStation(
    id: string
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(
        `${this.baseUrl}/toggleIsExternalEntretienStation/${id}`,
        {}
      )
      .pipe(map((response: MessageResponseInterface) => response));
  }

  notifyEntretiensStationsUpdated() {
    this.entretiensStationsUpdated.next();
  }
}
