import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  private isSidenavOpen = new BehaviorSubject<boolean>(false);

  getSidenavState(): Observable<boolean> {
    return this.isSidenavOpen.asObservable();
  }

  toggleSidenav() {
    this.isSidenavOpen.next(!this.isSidenavOpen.value);
  }
}
