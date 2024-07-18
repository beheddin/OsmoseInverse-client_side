import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { CartoucheInterface } from '../Interfaces/cartouche.interface';
import { MessageResponseInterface } from '../Interfaces/message-response.interface';

@Injectable({
  providedIn: 'root',
})
export class CartoucheService {
  private baseUrl: string = environment.CARTOUCHE_API_URL;

  private cartouchesUpdated = new Subject<void>();
  cartouchesUpdated$ = this.cartouchesUpdated.asObservable();

  constructor(private http: HttpClient) {}

  getCartouches(): Observable<CartoucheInterface[]> {
    return this.http.get<CartoucheInterface[]>(`${this.baseUrl}/get/all`);
  }

  getCartoucheById(id: string): Observable<CartoucheInterface> {
    return this.http.get<CartoucheInterface>(`${this.baseUrl}/get/${id}`);
  }

  postCartouche(
    cartouche: CartoucheInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .post<MessageResponseInterface>(`${this.baseUrl}/post`, cartouche)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  putCartouche(
    id: string,
    cartouche: CartoucheInterface
  ): Observable<MessageResponseInterface> {
    return this.http
      .put<MessageResponseInterface>(`${this.baseUrl}/put/${id}`, cartouche)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  deleteCartouche(id: string): Observable<MessageResponseInterface> {
    return this.http
      .delete<MessageResponseInterface>(`${this.baseUrl}/delete/${id}`)
      .pipe(
        map((response: MessageResponseInterface) => {
          return response;
        })
      );
  }

  notifyCartouchesUpdated() {
    this.cartouchesUpdated.next();
  }
}
