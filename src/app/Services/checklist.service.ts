import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { ChecklistInterface } from '../Interfaces/checklist.interface';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  private baseUrl: string = environment.CHECKLIST_API_URL;

  private checklistsUpdated = new Subject<void>();
  checklistsUpdated$ = this.checklistsUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getChecklists(): Observable<ChecklistInterface[]> {
    return this.http.get<ChecklistInterface[]>(`${this.baseUrl}/get/all`);
  }

  getChecklistById(id: string): Observable<ChecklistInterface> {
    return this.http.get<ChecklistInterface>(`${this.baseUrl}/get/${id}`);
  }

  postChecklist(
    checklist: ChecklistInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .post<MessageResponseInterface>(`${this.baseUrl}/post`, checklist)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  putChecklist(
    id: string,
    checklist: ChecklistInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(`${this.baseUrl}/put/${id}`, checklist)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  deleteChecklist(id: string): Observable<MessageResponseInterface> {
    return this.http
      .delete<MessageResponseInterface>(`${this.baseUrl}/delete/${id}`)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  notifyChecklistsUpdated() {
    this.checklistsUpdated.next();
  }
}
