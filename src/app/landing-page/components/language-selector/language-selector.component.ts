import {Component, OnInit} from '@angular/core';
import {NgFor, NgIf} from '@angular/common';
import {TranslateService, TranslateModule} from '@ngx-translate/core';

interface Language {
  code: string;
  name: string;
  isStaticHighlight?: boolean;
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
    {code: 'de', name: 'Deutsch'},
    {code: 'en', name: 'English'},
    {code: 'es', name: 'Español'},
    {code: 'mk', name: 'Македонски'},
    {code: 'fr', name: 'Français'},
    {code: 'it', name: 'Italiano'},
    {code: 'pt-BR', name: 'Português (BR)', isStaticHighlight: true},
    {code: 'pt-PT', name: 'Português (PT)'},
    {code: 'zh-CN', name: '简体中文'},
    {code: 'zh-TW', name: '繁體中文'},
    {code: 'ja', name: '日本語'},
    {code: 'ko', name: '한국어'}
  ];

  selectedLanguage: Language;
  isDropdownOpen: boolean = false;

  iconCaretUp = '🔼';
  iconCaretDown = '🔽';
  iconBell = '🔔';
  iconCheck = '✓';

  constructor(private translate: TranslateService) {
    const defaultLanguage = this.languages.find(lang => lang.code === 'en');
    this.selectedLanguage = defaultLanguage || this.languages[0];

    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit(): void {
  }

  selectLanguage(language: Language, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedLanguage = language;

    this.translate.use(language.code);

    this.isDropdownOpen = false;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  get currentCaretIcon(): string {
    return this.isDropdownOpen ? this.iconCaretUp : this.iconCaretDown;
  }
}
