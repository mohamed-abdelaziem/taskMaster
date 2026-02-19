import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGoal } from './new-goal';

describe('NewGoal', () => {
  let component: NewGoal;
  let fixture: ComponentFixture<NewGoal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewGoal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewGoal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
