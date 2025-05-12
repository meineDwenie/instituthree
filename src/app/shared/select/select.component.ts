import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent {
  selected = 'en';
  languages = [
    { code: 'en', label: 'English', flag: 'assets/flags/en.png' },
    { code: 'es', label: 'Spanish', flag: 'assets/flags/es.png' },
    { code: 'fr', label: 'French', flag: 'assets/flags/fr.png' },
  ];
  getSelectedLang() {
    return this.languages.find((lang) => lang.code === this.selected);
  }
}
