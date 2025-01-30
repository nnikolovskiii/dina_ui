import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectUrlComponent } from './select-url.component';

describe('SelectGiturlComponent', () => {
  let component: SelectUrlComponent;
  let fixture: ComponentFixture<SelectUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectUrlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
