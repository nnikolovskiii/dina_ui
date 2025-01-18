import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUrlsComponent } from './list-urls.component';

describe('ListGiturlComponent', () => {
  let component: ListUrlsComponent;
  let fixture: ComponentFixture<ListUrlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListUrlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListUrlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
