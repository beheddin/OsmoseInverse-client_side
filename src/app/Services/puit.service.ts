import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { PuitInterface } from '../Interfaces/puit.interface';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class PuitService {
  private baseUrl: string = environment.PUIT_API_URL;

  private puitsUpdated = new Subject<void>();
  puitsUpdated$ = this.puitsUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getPuits(): Observable<PuitInterface[]> {
    return this.http.get<PuitInterface[]>(`${this.baseUrl}/get/all`);
  }

  getPuitById(id: string): Observable<PuitInterface> {
    return this.http.get<PuitInterface>(`${this.baseUrl}/get/${id}`);
  }

  postPuit(puit: PuitInterface): Observable<MessageResponseInterface> {
    return this.http
      .post<MessageResponseInterface>(`${this.baseUrl}/post`, puit)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  putPuit(
    id: string,
    puit: PuitInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(`${this.baseUrl}/put/${id}`, puit)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  deletePuit(id: string): Observable<MessageResponseInterface> {
    return this.http
      .delete<MessageResponseInterface>(`${this.baseUrl}/delete/${id}`)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  notifyPuitsUpdated() {
    this.puitsUpdated.next();
  }
}
