import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentSidebarComponent } from './appointment-sidebar.component';

describe('AppointmentSidebarComponent', () => {
  let component: AppointmentSidebarComponent;
  let fixture: ComponentFixture<AppointmentSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
