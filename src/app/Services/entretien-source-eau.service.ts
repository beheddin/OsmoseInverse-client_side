import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { EntretienSourceEauInterface } from '../Interfaces/entretien-source-eau.interface';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class EntretienSourceEauService {
  private baseUrl: string = environment.SOURCE_EAU_ENTRETIEN_API_URL;

  private sourcesEauEntretiensUpdated = new Subject<void>();
  entretiensSourcesEauUpdated$ =
    this.sourcesEauEntretiensUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getEntretiensSourcesEau(): Observable<EntretienSourceEauInterface[]> {
    return this.http.get<EntretienSourceEauInterface[]>(
      `${this.baseUrl}/get/all`
    );
  }

  getEntretienSourceEauById(
    id: string
  ): Observable<EntretienSourceEauInterface> {
    return this.http.get<EntretienSourceEauInterface>(
      `${this.baseUrl}/get/${id}`
    );
  }

  postEntretienSourceEau(
    sourcesEauEntretien: EntretienSourceEauInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .post<MessageResponseInterface>(
        `${this.baseUrl}/post`,
        sourcesEauEntretien
      )
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  putEntretienSourceEau(
    id: string,
    sourcesEauEntretien: EntretienSourceEauInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(
        `${this.baseUrl}/put/${id}`,
        sourcesEauEntretien
      )
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  deleteEntretienSourceEau(id: string): Observable<MessageResponseInterface> {
    return this.http
      .delete<MessageResponseInterface>(`${this.baseUrl}/delete/${id}`)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  toggleIsExternalEntretienSourceEau(
    id: string
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(
        `${this.baseUrl}/toggleIsExternalEntretienSourceEau/${id}`,
        {}
      )
      .pipe(map((response: MessageResponseInterface) => response));
  }

  notifyEntretiensSourcesEauUpdated() {
    this.sourcesEauEntretiensUpdated.next();
  }
}
