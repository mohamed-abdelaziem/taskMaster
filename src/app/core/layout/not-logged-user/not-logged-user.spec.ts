import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotLoggedUser } from './not-logged-user';

describe('NotLoggedUser', () => {
  let component: NotLoggedUser;
  let fixture: ComponentFixture<NotLoggedUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotLoggedUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotLoggedUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
