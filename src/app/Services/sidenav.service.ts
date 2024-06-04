import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  private isSidenavOpened = new BehaviorSubject<boolean>(false);

  toggleSidenav() {
    this.isSidenavOpened.next(!this.isSidenavOpened.value);
  }

  getSidenavState(): Observable<boolean> {
    return this.isSidenavOpened.asObservable();
  }
}
