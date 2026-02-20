
import {  ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ViewportScroller } from '@angular/common';
@Component({
  selector: 'app-navbar-not-logged-user',
  imports: [RouterLink],
  templateUrl: './navbar-not-logged-user.html',
  styleUrl: './navbar-not-logged-user.css',
})
export class NavbarNotLoggedUser {
@ViewChild('linksContainer')
linksContainer !: ElementRef;
constructor(private router: Router, private viewportScroller: ViewportScroller) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const tree = this.router.parseUrl(this.router.url);
        if (tree.fragment) {
          setTimeout(() => {
            this.viewportScroller.scrollToAnchor(tree.fragment!);
          }, 50);
        }
      }
    });
  }

toggleNav(){
console.log(this.linksContainer.nativeElement);
(this.linksContainer.nativeElement as HTMLElement).classList.toggle('left-[-1000%]')
}
}
