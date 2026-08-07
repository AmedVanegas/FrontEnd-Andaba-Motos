import { CurrencyPipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ChangeDetectorRef,
  inject
} from '@angular/core';
import { CartService } from '../../../core/services/http-cart';
import { AlertService } from '../../../core/services/alert';
import { ImageUrlPipe } from '../../../core/pipes/image-url.pipe';

@Component({
  selector: 'product-brochure-detail',
  imports: [CurrencyPipe, UpperCasePipe, ImageUrlPipe],
  templateUrl: './product-brochure-detail.html',
  styleUrl: './product-brochure-detail.css',
})
export class ProductBrochureDetail implements AfterViewInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  cartService = inject(CartService)
  alert = inject(AlertService)
  @Input() product: any;
  // Rect de la card que se clickeó: punto de partida de la animación.
  // Si es null, se hace un fade+scale genérico desde el centro.
  @Input() originRect: DOMRect | null = null;
  @Output() close = new EventEmitter<void>();

  @ViewChild('panel') panelRef!: ElementRef<HTMLElement>;

  currentImage = 0;
  isOpen = false;
  isAnimating = false;
  showContent = false;
  private isClosing = false;

    addToCart() {
    this.cartService.addItem(this.product._id, 1).subscribe({
      error: (err) => {
        console.error(err.error?.msg);
        this.alert.error('No se pudo añadir al carrito', err.error?.msg)
      },
    });
  }

  get images(): string[] {
    return this.product?.productImages?.length ? this.product.productImages : [];
  }

  get hasMultipleImages(): boolean {
    return this.images.length > 1;
  }

  ngAfterViewInit() {
    this.playOpenAnimation();
  }

  private playOpenAnimation() {
    const panel = this.panelRef.nativeElement;

    if (!this.originRect) {
      this.isOpen = true;
      this.showContent = true;
      this.cdr.detectChanges();
      return;
    }

    // Set opening state
    this.isOpen = true;
    this.isAnimating = true;
    this.cdr.detectChanges(); // Trigger blur immediately

    const finalRect = panel.getBoundingClientRect();

    // Initial state: same size/position as origin card.
    // Also, isAnimating class makes the grid 1fr 0px so the image fills the card.
    panel.style.transition = 'none';
    panel.style.position = 'fixed';
    panel.style.margin = '0';
    panel.style.left = `${this.originRect.left}px`;
    panel.style.top = `${this.originRect.top}px`;
    panel.style.width = `${this.originRect.width}px`;
    panel.style.height = `${this.originRect.height}px`;
    panel.style.borderRadius = '14px';

    // Force reflow
    void panel.offsetWidth;

    // Start transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const bezier = 'cubic-bezier(0.16, 1, 0.3, 1)';
        const duration = '0.45s';
        panel.style.transition = `left ${duration} ${bezier}, top ${duration} ${bezier}, width ${duration} ${bezier}, height ${duration} ${bezier}, border-radius ${duration} ease, grid-template-columns ${duration} ${bezier}`;

        panel.style.left = `${finalRect.left}px`;
        panel.style.top = `${finalRect.top}px`;
        panel.style.width = `${finalRect.width}px`;
        panel.style.height = `${finalRect.height}px`;
        panel.style.borderRadius = '20px';

        // Remove the animation class to let the grid transition to its normal columns
        panel.classList.remove('is-animating');
        this.showContent = true;
        this.cdr.detectChanges();

        setTimeout(() => {
          if (!this.isClosing) {
            panel.style.transition = '';
            panel.style.position = '';
            panel.style.left = '';
            panel.style.top = '';
            panel.style.width = '';
            panel.style.height = '';
            panel.style.margin = '';
            panel.style.borderRadius = '';

            this.isAnimating = false;
          }
        }, 500); // 50ms buffer to ensure transition finishes cleanly
      });
    });
  }

  requestClose() {
    if (this.isClosing) return;
    this.isClosing = true;

    this.showContent = false;
    this.isAnimating = true;
    this.cdr.detectChanges();

    const panel = this.panelRef?.nativeElement;

    if (panel && this.originRect) {
      const currentRect = panel.getBoundingClientRect();

      // Lock into fixed position at current size
      panel.style.transition = 'none';
      panel.style.position = 'fixed';
      panel.style.margin = '0';
      panel.style.left = `${currentRect.left}px`;
      panel.style.top = `${currentRect.top}px`;
      panel.style.width = `${currentRect.width}px`;
      panel.style.height = `${currentRect.height}px`;

      void panel.offsetWidth;

      // Animate back to origin card
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.isOpen = false;
          this.showContent = false;
          this.cdr.detectChanges(); // Trigger blur removal and text hide

          panel.classList.add('is-animating'); // collapse grid

          const bezier = 'cubic-bezier(0.16, 1, 0.3, 1)';
          const duration = '0.4s';
          panel.style.transition = `left ${duration} ${bezier}, top ${duration} ${bezier}, width ${duration} ${bezier}, height ${duration} ${bezier}, border-radius ${duration} ease, grid-template-columns ${duration} ${bezier}`;
          panel.style.left = `${this.originRect!.left}px`;
          panel.style.top = `${this.originRect!.top}px`;
          panel.style.width = `${this.originRect!.width}px`;
          panel.style.height = `${this.originRect!.height}px`;
          panel.style.borderRadius = '14px';
        });
      });
    } else {
      this.isOpen = false;
      this.cdr.detectChanges();
    }

    setTimeout(() => this.close.emit(), 400);
  }

  onBackdropClick() {
    this.requestClose();
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.requestClose();
  }

  @HostListener('document:keydown.arrowright')
  onArrowRight() {
    this.nextImage();
  }

  @HostListener('document:keydown.arrowleft')
  onArrowLeft() {
    this.prevImage();
  }

  nextImage() {
    if (!this.hasMultipleImages) return;
    this.currentImage = (this.currentImage + 1) % this.images.length;
  }

  prevImage() {
    if (!this.hasMultipleImages) return;
    this.currentImage = (this.currentImage - 1 + this.images.length) % this.images.length;
  }

  goToImage(i: number) {
    this.currentImage = i;
  }

  displayPrice(): number {
    return this.product.price + this.product.price * (this.product.roi ?? 0);
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }
}
