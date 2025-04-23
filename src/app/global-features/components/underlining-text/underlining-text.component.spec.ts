import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderliningTextComponent } from './underlining-text.component';

describe('UnderliningTextComponent', () => {
  let component: UnderliningTextComponent;
  let fixture: ComponentFixture<UnderliningTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnderliningTextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnderliningTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
