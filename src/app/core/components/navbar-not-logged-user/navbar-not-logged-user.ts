import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-navbar-not-logged-user',
  imports: [RouterLink],
  templateUrl: './navbar-not-logged-user.html',
  styleUrl: './navbar-not-logged-user.css',
})
export class NavbarNotLoggedUser {
@ViewChild('linksContainer')
linksContainer !: ElementRef;


toggleNav(){
console.log(this.linksContainer.nativeElement);
(this.linksContainer.nativeElement as HTMLElement).classList.toggle('left-[-1000%]')
}
}
