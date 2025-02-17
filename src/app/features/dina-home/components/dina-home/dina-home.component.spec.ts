import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DinaHomeComponent } from './dina-home.component';

describe('DinaHomeComponent', () => {
  let component: DinaHomeComponent;
  let fixture: ComponentFixture<DinaHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DinaHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DinaHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
