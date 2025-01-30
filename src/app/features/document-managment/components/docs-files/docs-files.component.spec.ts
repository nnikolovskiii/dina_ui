import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsFilesComponent } from './docs-files.component';

describe('DocsFilesComponent', () => {
  let component: DocsFilesComponent;
  let fixture: ComponentFixture<DocsFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsFilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocsFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
