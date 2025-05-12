import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  constructor(private router: Router) {}

  logout(): void {
    // Implement your logout logic here (e.g. clear token, call service, etc.)
    console.log('Logging out...');
    // Navigate to login page or homepage
    this.router.navigate(['/authentication']);
  }
}
