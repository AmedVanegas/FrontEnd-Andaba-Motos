import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
   @ViewChild('heroBg') heroBg?: ElementRef<HTMLElement>;

  private ticking = false;
  private reducedMotion = false;
  private readonly speed = 0.5;

  ngAfterViewInit() {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  @HostListener('window:scroll')
  onScroll() {
    if (this.reducedMotion || this.ticking || !this.heroBg) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      const heroHeight = this.heroBg!.nativeElement.parentElement?.clientHeight ?? window.innerHeight;
      const clampedScroll = Math.min(window.scrollY, heroHeight);
      const offset = clampedScroll * this.speed;
      this.heroBg!.nativeElement.style.transform = `translate3d(0, ${offset}px, 0)`;
      this.ticking = false;
    });
  }
}

