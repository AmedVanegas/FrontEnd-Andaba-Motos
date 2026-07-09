import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { HttpAppointment } from '../../../app/core/services/http-appointment';
import { JsonPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';

@Component({
  selector: 'app-appointment-list',
  imports: [JsonPipe],
  templateUrl: './appointment-list.html',
  styleUrl: './appointment-list.css',
})
export class AppointmentList implements OnInit, OnDestroy {
  appointment: any = {};

  private httpAppointment = inject(HttpAppointment);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.httpAppointment.getAppointment()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          console.log('componente', data);
          this.appointment = data; // ✅ ahora sí se guarda
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {}
      });
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');
  }
}