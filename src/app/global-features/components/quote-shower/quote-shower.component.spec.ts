import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteShowerComponent } from './quote-shower.component';

describe('QuoteShowerComponent', () => {
  let component: QuoteShowerComponent;
  let fixture: ComponentFixture<QuoteShowerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteShowerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuoteShowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
