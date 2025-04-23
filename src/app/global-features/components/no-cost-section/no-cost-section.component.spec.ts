import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoCostSectionComponent } from './no-cost-section.component';

describe('NoCostSectionComponent', () => {
  let component: NoCostSectionComponent;
  let fixture: ComponentFixture<NoCostSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoCostSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoCostSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
