import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private isOpenSubject = new BehaviorSubject<boolean>(true);
  isOpen$ = this.isOpenSubject.asObservable();

  toggleSidebar() {
    this.isOpenSubject.next(!this.isOpenSubject.value);
  }

  setSidebarState(open: boolean) {
    this.isOpenSubject.next(open);
  }

  get isOpen(): boolean {
    return this.isOpenSubject.value;
  }
}
