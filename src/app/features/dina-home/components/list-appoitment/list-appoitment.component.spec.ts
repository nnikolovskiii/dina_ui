import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAppoitmentComponent } from './list-appoitment.component';

describe('ListAppoitmentComponent', () => {
  let component: ListAppoitmentComponent;
  let fixture: ComponentFixture<ListAppoitmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAppoitmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAppoitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
