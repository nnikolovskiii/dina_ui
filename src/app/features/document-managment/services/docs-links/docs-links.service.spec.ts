import { TestBed } from '@angular/core/testing';

import { DocsLinksService } from './docs-links.service';

describe('LinksService', () => {
  let service: DocsLinksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocsLinksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
