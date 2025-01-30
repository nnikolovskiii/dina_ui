import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmProcessingComponent } from './confirm-processing.component';

describe('FinishComponent', () => {
  let component: ConfirmProcessingComponent;
  let fixture: ComponentFixture<ConfirmProcessingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmProcessingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
