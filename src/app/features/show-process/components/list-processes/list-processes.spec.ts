import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProcesses } from './list-processes';

describe('ProcessListComponent', () => {
  let component: ListProcesses;
  let fixture: ComponentFixture<ListProcesses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListProcesses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListProcesses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
