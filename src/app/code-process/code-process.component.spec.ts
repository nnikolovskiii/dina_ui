import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeProcessComponent } from './code-process.component';

describe('CodeProcessComponent', () => {
  let component: CodeProcessComponent;
  let fixture: ComponentFixture<CodeProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeProcessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
