import { TestBed } from '@angular/core/testing';

import { DocsContentService } from './docs-content.service';

describe('CollectionDataService', () => {
  let service: DocsContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocsContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
