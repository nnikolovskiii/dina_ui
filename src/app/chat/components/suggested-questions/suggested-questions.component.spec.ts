import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedQuestionsComponent } from './suggested-questions.component';

describe('SuggestedQuestionsComponent', () => {
  let component: SuggestedQuestionsComponent;
  let fixture: ComponentFixture<SuggestedQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuggestedQuestionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuggestedQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
