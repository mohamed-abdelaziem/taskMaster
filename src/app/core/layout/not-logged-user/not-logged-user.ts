import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarNotLoggedUser } from "../../components/navbar-not-logged-user/navbar-not-logged-user";

@Component({
  selector: 'app-not-logged-user',
  imports: [RouterOutlet, NavbarNotLoggedUser],
  templateUrl: './not-logged-user.html',
  styleUrl: './not-logged-user.css',
})
export class NotLoggedUser {



}
