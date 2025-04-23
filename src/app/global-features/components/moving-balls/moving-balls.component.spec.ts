import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovingBallsComponent } from './moving-balls.component';

describe('MovingBallsComponent', () => {
  let component: MovingBallsComponent;
  let fixture: ComponentFixture<MovingBallsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovingBallsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovingBallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
