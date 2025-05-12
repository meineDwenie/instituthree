import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SelectComponent } from '../select/select.component';

@Component({
  selector: 'app-header-nav',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, SelectComponent],
  templateUrl: './header-nav.component.html',
  styleUrl: './header-nav.component.scss',
})
export class HeaderNavComponent {}
