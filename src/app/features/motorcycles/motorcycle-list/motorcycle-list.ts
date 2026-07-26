import { Component, inject } from '@angular/core';
import { HttpMotorcycles } from '../../../core/services/http-motorcycles';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import MotorcycleListCard from '../motorcycle-list-card/motorcycle-list-card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-motorcycle-list',
  imports: [AsyncPipe, MotorcycleListCard, RouterLink],
  templateUrl: './motorcycle-list.html',
  styleUrl: './motorcycle-list.css',
})
export default class MotorcycleList {
  motorcycles$ = new BehaviorSubject<any[]>([]);
  // Se injecta la dependecia de el servicio
  private httpMotorcycles = inject(HttpMotorcycles);

  ngOnInit() {
    this.httpMotorcycles.getMotorcycles().subscribe({
      next: (data) => {
        console.log(data);
        this.motorcycles$.next(data);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        console.log('Se traen las motocicletas');
      },
    });
  }

  onDelete(id: string) {
    console.log(id);
    this.httpMotorcycles.deleteMotorcycle(id).subscribe({
      next: (data) => {
        console.log(data);
        this.ngOnInit();
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('se elimino la motocicleta');
      },
    });
  }

  getAllMotorcycles() {
    return this.motorcycles$.value.length;
  }

  getActiveMotorcycles() {
    let number = 0;
    this.motorcycles$.value.forEach(function (motorcycle) {
      if (motorcycle.status == true) {
        number++;
      }
    });
    return number;
  }

  getInactiveMotorcycles() {
    let number = 0;
    this.motorcycles$.value.forEach(function (motorcycle) {
      if (motorcycle.status == false) {
        number++;
      }
    });
    return number;
  }
}
