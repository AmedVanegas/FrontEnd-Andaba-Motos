import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpAuth } from '../../../core/services/http-auth';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  menuOpen = false;
  private httpAuth = inject(HttpAuth)

  currentUser$ = this.httpAuth.currentUser$

toggleMenu() {
  this.menuOpen = !this.menuOpen;
}

logOut(){

  this.httpAuth.logoutUser()

}

logged(){
  return this.httpAuth.isLogged()
}
}


