import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarWithLogged } from "../../components/navbar-with-logged/navbar-with-logged";

@Component({
  selector: 'app-logged-user',
  imports: [RouterOutlet, NavbarWithLogged],
  templateUrl: './logged-user.html',
  styleUrl: './logged-user.css',
})
export class LoggedUser {

}
