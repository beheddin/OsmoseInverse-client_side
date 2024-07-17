import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { CompteInterface } from '../Interfaces/compte.interface';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class CompteService {
  private baseUrl: string = environment.COMPTE_API_URL;

  //service to trigger ComptesComponent from CompteFormComponent to refresh the table
  private comptesUpdated = new Subject<void>();
  comptesUpdated$ = this.comptesUpdated.asObservable();

  //private http = inject(HttpClient);
  constructor(private http: HttpClient) {}

  getComptes(): Observable<CompteInterface[]> {
    return this.http.get<CompteInterface[]>(`${this.baseUrl}/get/all`);
  }

  getCompteById(id: string): Observable<CompteInterface> {
    return this.http.get<CompteInterface>(`${this.baseUrl}/get/${id}`);
  }

  // compte(user: CompteInterface): Observable<string> {
  postCompte(compte: CompteInterface): Observable<MessageResponseInterface> {
    // return this.http.post<string>(`${this.baseUrl}/post`, user);
    return (
      this.http
        .post<MessageResponseInterface>(`${this.baseUrl}/post`, compte)
        // transform the HTTP response into a MessageResponseInterface
        .pipe(map((response: MessageResponseInterface) => response))
    );
  }

  putCompte(
    id: string,
    compte: CompteInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(`${this.baseUrl}/put/${id}`, compte)
      .pipe(map((response: MessageResponseInterface) => response));
  }

  deleteCompte(id: string): Observable<MessageResponseInterface> {
    return this.http
      .delete<MessageResponseInterface>(`${this.baseUrl}/delete/${id}`)
      .pipe(map((response: MessageResponseInterface) => response));
  }

  changePassword(
    id: string,
    // changePassword: ChangePasswordInterface
    changePassword: any
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(
        `${this.baseUrl}/changePassword/${id}`,
        changePassword
      )
      .pipe(map((response: MessageResponseInterface) => response));
  }

  toggleAccess(id: string): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(`${this.baseUrl}/toggleAccess/${id}`, {})
      .pipe(map((response: MessageResponseInterface) => response));
  }

  //service to trigger ComptesComponent from CompteFormComponent to refresh the table
  notifyComptesUpdated() {
    this.comptesUpdated.next();
  }
}
