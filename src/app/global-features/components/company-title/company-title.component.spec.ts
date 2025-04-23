import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyTitleComponent } from './company-title.component';

describe('CompanyTitleComponent', () => {
  let component: CompanyTitleComponent;
  let fixture: ComponentFixture<CompanyTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
