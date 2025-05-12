import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderNavComponent } from '../shared/header-nav/header-nav.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-roles',
  imports: [CommonModule, HeaderNavComponent, SidebarComponent],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
})
export class RolesComponent {}
