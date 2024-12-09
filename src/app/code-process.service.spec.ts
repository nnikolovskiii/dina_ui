import { TestBed } from '@angular/core/testing';

import { CodeProcessService } from './code-process.service';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {provideHttpClient} from '@angular/common/http';

describe('CodeProcessService', () => {
  let service: CodeProcessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodeProcessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
