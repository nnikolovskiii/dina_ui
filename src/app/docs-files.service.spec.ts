import { TestBed } from '@angular/core/testing';

import { DocsFilesService } from './docs-files.service';

describe('DocsFilesService', () => {
  let service: DocsFilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocsFilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
