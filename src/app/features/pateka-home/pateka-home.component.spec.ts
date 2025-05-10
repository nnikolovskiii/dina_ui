import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatekaHomeComponent } from './pateka-home.component';

describe('PatekaHomeComponent', () => {
  let component: PatekaHomeComponent;
  let fixture: ComponentFixture<PatekaHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatekaHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatekaHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
