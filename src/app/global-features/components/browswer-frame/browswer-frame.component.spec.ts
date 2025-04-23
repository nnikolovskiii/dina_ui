import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowswerFrameComponent } from './browswer-frame.component';

describe('BrowswerFrameComponent', () => {
  let component: BrowswerFrameComponent;
  let fixture: ComponentFixture<BrowswerFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowswerFrameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowswerFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
