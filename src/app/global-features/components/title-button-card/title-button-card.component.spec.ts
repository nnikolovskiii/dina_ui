import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleButtonCardComponent } from './title-button-card.component';

describe('TitleButtonCardComponent', () => {
  let component: TitleButtonCardComponent;
  let fixture: ComponentFixture<TitleButtonCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleButtonCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitleButtonCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
