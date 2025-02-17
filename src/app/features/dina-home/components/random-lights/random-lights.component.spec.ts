import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomLightsComponent } from './random-lights.component';

describe('RandomLightsComponent', () => {
  let component: RandomLightsComponent;
  let fixture: ComponentFixture<RandomLightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RandomLightsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RandomLightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
