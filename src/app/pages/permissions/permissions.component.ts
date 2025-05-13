import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderNavComponent } from '../../shared/header-nav/header-nav.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-permissions',
  imports: [CommonModule, HeaderNavComponent, SidebarComponent],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.scss',
})
export class PermissionsComponent {}
