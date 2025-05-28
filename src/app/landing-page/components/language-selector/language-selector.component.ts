import { Component, OnInit } from '@angular/core';
import {NgFor, NgIf} from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

interface Language {
  code: string;
  name: string;
  isStaticHighlight?: boolean; // To match the "Português (BR)" highlight from the image
}
@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [NgIf, NgFor, TranslateModule],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.css'
})
export class LanguageSelectorComponent implements OnInit {
  languages: Language[] = [
    { code: 'de', name: 'Deutsch' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt-BR', name: 'Português (BR)', isStaticHighlight: true },
    { code: 'pt-PT', name: 'Português (PT)' },
    { code: 'zh-CN', name: '简体中文' },
    { code: 'zh-TW', name: '繁體中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' }
  ];

  selectedLanguage: Language;
  isDropdownOpen: boolean = false; // Dropdown is open by default as per the image

  // Icons (Unicode characters for simplicity)
  iconCaretUp = '🔼';
  iconCaretDown = '🔽';
  iconBell = '🔔';
  iconCheck = '✓';

  constructor(private translate: TranslateService) {
    // Set English as the default selected language
    const defaultLanguage = this.languages.find(lang => lang.code === 'en');
    this.selectedLanguage = defaultLanguage || this.languages[0]; // Fallback to the first language

    // Set the default language for translations
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit(): void {
  }

  selectLanguage(language: Language, event: MouseEvent): void {
    event.stopPropagation(); // Prevent click on li from toggling dropdown if header is also toggleable
    this.selectedLanguage = language;

    // Use TranslateService to change the language
    this.translate.use(language.code);

    // Optional: close dropdown on selection
    // this.isDropdownOpen = false;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  get currentCaretIcon(): string {
    return this.isDropdownOpen ? this.iconCaretUp : this.iconCaretDown;
  }
}
