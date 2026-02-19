import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarNotLoggedUser } from './navbar-not-logged-user';

describe('NavbarNotLoggedUser', () => {
  let component: NavbarNotLoggedUser;
  let fixture: ComponentFixture<NavbarNotLoggedUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarNotLoggedUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarNotLoggedUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
