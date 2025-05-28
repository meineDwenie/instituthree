import { Component, inject } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { HeaderNavComponent } from '../../shared/header-nav/header-nav.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderNavComponent, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  isSidebarOpen = true;

  private sidebarService = inject(SidebarService);

  constructor() {
    this.sidebarService.isOpen$.subscribe((state: boolean) => {
      this.isSidebarOpen = state;
    });
  }
}
