import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectGiturlComponent } from './select-giturl.component';

describe('SelectGiturlComponent', () => {
  let component: SelectGiturlComponent;
  let fixture: ComponentFixture<SelectGiturlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectGiturlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectGiturlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
