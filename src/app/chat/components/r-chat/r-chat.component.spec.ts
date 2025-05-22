import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RChatComponent } from './r-chat.component';

describe('RChatComponent', () => {
  let component: RChatComponent;
  let fixture: ComponentFixture<RChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
