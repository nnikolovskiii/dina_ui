import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoCostBanterComponent } from './no-cost-banter.component';

describe('NoCostBanterComponent', () => {
  let component: NoCostBanterComponent;
  let fixture: ComponentFixture<NoCostBanterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoCostBanterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoCostBanterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
