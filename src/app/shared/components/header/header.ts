<<<<<<< HEAD
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive],
=======
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
>>>>>>> 1534da5b0e706c65a98f3f9960cbcf7fc3e4e2dd
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
<<<<<<< HEAD
  navLinks: NavLink[] = [
    { label: 'Home', path: '/home' },
    { label: 'Brochure', path: '/brochure' },
    { label: 'Services', path: '/services' },
    { label: 'About Us', path: '/about' },
    // "Contact" todavía no tiene ruta creada en app.routes.ts.
    // Cuando la crees, cambia este path a la ruta real.
    { label: 'Contact', path: '/contact' },
  ];

  isMobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
=======
  menuOpen = false;

toggleMenu() {
  this.menuOpen = !this.menuOpen;
}
}


>>>>>>> 1534da5b0e706c65a98f3f9960cbcf7fc3e4e2dd
