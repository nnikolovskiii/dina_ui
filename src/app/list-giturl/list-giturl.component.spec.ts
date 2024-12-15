import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGiturlComponent } from './list-giturl.component';

describe('ListGiturlComponent', () => {
  let component: ListGiturlComponent;
  let fixture: ComponentFixture<ListGiturlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListGiturlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListGiturlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
