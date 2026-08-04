import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpCategories } from '../../../core/services/http-categories';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { HttpProducts } from '../../../core/services/http-products';
import { AlertService } from '../../../core/services/alert';
import { ActivatedRoute, Router } from '@angular/router';
import { BackButton } from '../../../shared/components/back-button/back-button';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, AsyncPipe, BackButton],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export default class ProductForm {
  private httpcategory = inject(HttpCategories);
  categoryList$ = new BehaviorSubject<any[]>([]);
  private httpProducts = inject(HttpProducts);
  private alert = inject(AlertService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  formData: FormGroup;

  isEditMode = false;
  formTitle: string = 'Registrar producto';
  formButton: string = 'Crear producto';
  productId: string | null = null;

  constructor() {
    // Define la estructura equivalente del formulario en HTML
    this.formData = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
      nr: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(17),
        Validators.pattern(/^[0-9]+$/),
      ]),
      category: new FormControl('', Validators.required),
      productImage: new FormControl('', Validators.minLength(3)),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(1500),
      ]),
      status: new FormControl('', Validators.required),
      price: new FormControl(0, [Validators.required, Validators.min(1000)]),
      stock: new FormControl(0, [Validators.required, Validators.min(0)]),
      roi: new FormControl(0.3, [Validators.min(0.1)]),
    });
  }

  async onSubmit() {
    if (!this.formData.valid) {
      return;
    }

    const formValue = this.formData.value;

    if (this.isEditMode && this.productId) {
      // Confirmación antes de guardar los cambios (modo edición)
      const confirmed = await this.alert.confirmSave('el producto', true);
      if (!confirmed) {
        return;
      }

      this.httpProducts.editProduct(this.productId, formValue).subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (error) => {
          this.alert.error('No se pudo editar el producto', error.error?.msg);
          console.log(error);
        },
        complete: () => {
          this.alert.success('Guardado!', 'Producto actualizado');
          this.router.navigate(['/products']);
        },
      });
    } else {
      if (formValue.productImage == '') {
        delete formValue.productImage;
      }

      this.httpProducts.createProducts(this.formData.value).subscribe({
        next: (res) => {
          console.log(res);
          this.formData.reset();
        },

        error: (error) => {
          this.alert.error('No se pudo crear el producto', error.error?.msg);
          console.log(error);
        },

        complete: () => {
          console.log('complete execute');
          this.alert.success('Creado!', 'Producto creado');
          this.router.navigate(['/products']);
        },
      });
    }
  }

  // Hook: ciclo de vida que se ejecuta al inicializar el componente
  ngOnInit() {
    this.loadCategories();

    this.productId = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.productId) {
      this.loadProduct(this.productId);
      this.isEditMode = true;
      this.formTitle = 'Editar producto';
      this.formButton = 'Editar';
    }
  }

  //getters

  loadCategories() {
    this.httpcategory.getCategory().subscribe({
      next: (data) => {
        console.log(data);

        // Guarda las categorías obtenidas
        this.categoryList$.next(data.data);
      },

      error: (err) => {
        console.log(err);
      },

      complete: () => {
        // No hay acciones al completar
      },
    });
  }

  loadProduct(productId: string) {
    this.httpProducts.getProductById(productId).subscribe({
      next: (data) => {
        const { product } = data;
        this.formData.patchValue(product);
      },
      error: () => {},
      complete: () => {},
    });
  }
  get name() {
    return this.formData.get('name');
  }

  get nr() {
    return this.formData.get('nr');
  }

  get category() {
    return this.formData.get('category');
  }

  get productImage() {
    return this.formData.get('productImage');
  }

  get description() {
    return this.formData.get('description');
  }

  get status() {
    return this.formData.get('status');
  }

  get price() {
    return this.formData.get('price');
  }

  get stock() {
    return this.formData.get('stock');
  }

  get roi() {
    return this.formData.get('roi');
  }
}