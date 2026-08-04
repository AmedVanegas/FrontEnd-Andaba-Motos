import { Component, inject } from '@angular/core';
import { HttpCategories } from '../../../core/services/http-categories';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-categories-list',
  imports: [AsyncPipe, RouterLink, RouterLinkActive],
  templateUrl: './categories-list.html',
  styleUrl: './categories-list.css',
})
export default class CategoriesList {
  private httpCategory = inject(HttpCategories);
  private router = inject(Router);
  categoryList$ = new BehaviorSubject<any>([]);

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    this.httpCategory.getCategory().subscribe({
      next: (res) => {
        this.categoryList$.next(res.data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  onEdit(id: string) {
    this.router.navigateByUrl(`/categories/edit/${id}`);
  }

  onDelete(id: string) {
    this.httpCategory.deleteCategory(id).subscribe({
      next: () => {
        this.onLoadData();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getAllCategories() {
    return this.categoryList$.value.length;
  }
}