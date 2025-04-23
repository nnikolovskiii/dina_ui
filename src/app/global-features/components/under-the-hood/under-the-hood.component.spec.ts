import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderTheHoodComponent } from './under-the-hood.component';

describe('UnderTheHoodComponent', () => {
  let component: UnderTheHoodComponent;
  let fixture: ComponentFixture<UnderTheHoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnderTheHoodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnderTheHoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
