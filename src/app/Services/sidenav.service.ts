import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  private isOpenSidenav = new BehaviorSubject<boolean>(false);

  getSidenavState(): Observable<boolean> {
    return this.isOpenSidenav.asObservable();
  }

  toggleSidenav() {
    this.isOpenSidenav.next(!this.isOpenSidenav.value);
  }
}
