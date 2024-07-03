import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoPopoverComponent } from './todo-popover.component';

describe('TodoPopoverComponent', () => {
  let component: TodoPopoverComponent;
  let fixture: ComponentFixture<TodoPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodoPopoverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
