import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NumberValueAccessor,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpCategories } from '../../../core/services/http-categories';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { HttpProducts } from '../../../core/services/http-products';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export default class ProductForm {
  private httpcategory = inject(HttpCategories);
  categoryList$ = new BehaviorSubject<any[]>([]);
  private httpProducts = inject(HttpProducts);
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
      name: new FormControl('', [Validators.required]),
      nr: new FormControl('', [Validators.required]),
      category: new FormControl('', Validators.required),
      productImage: new FormControl('', Validators.minLength(3)),
      description: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      price: new FormControl(0, [Validators.required, Validators.min(1000)]),
      stock: new FormControl(0, [Validators.required, Validators.min(1)]),
    });
  }

  onSubmit() {
    if (this.formData.valid) {
      const formValue = this.formData.value;

      if (this.isEditMode && this.productId) {
        this.httpProducts.editProduct(this.productId, formValue).subscribe({
          next: (data) => {
            console.log(data);
            this.router.navigate(['/products']);
          },
          error: (error) => {
            console.log(error);
          },
          complete: () => {},
        });
      } else {
        if (formValue.productImage == '') {
          delete formValue.productImage;
        }

        this.httpProducts.createProducts(this.formData.value).subscribe({
          next: (res) => {
            console.log(res);
            this.formData.reset();
            this.router.navigate(['/products']);
          },

          error: (error) => {
            console.log(error);
          },

          complete: () => {
            console.log('complete execute');
          },
        });
      }
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

  get description() {
    return this.formData.get('description');
  }

  get price() {
    return this.formData.get('price');
  }

  get stock() {
    return this.formData.get('stock');
  }
}
