import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarWithLogged } from './navbar-with-logged';

describe('NavbarWithLogged', () => {
  let component: NavbarWithLogged;
  let fixture: ComponentFixture<NavbarWithLogged>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarWithLogged]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarWithLogged);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
