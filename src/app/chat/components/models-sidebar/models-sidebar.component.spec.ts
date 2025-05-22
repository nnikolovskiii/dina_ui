import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelsSidebarComponent } from './models-sidebar.component';

describe('ChatSidebarComponent', () => {
  let component: ModelsSidebarComponent;
  let fixture: ComponentFixture<ModelsSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelsSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
