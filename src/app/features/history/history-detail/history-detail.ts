import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import { HttpServiceRecord } from '../../../core/services/http-service-record';
import { HttpOrders } from '../../../core/services/http-orders';
import { BackButton } from '../../../shared/components/back-button/back-button';
import { AlertService } from '../../../core/services/alert';
import { ServiceRecordItem } from '../../../core/models/ServiceRecord';
import { OrderRecord } from '../../../core/models/Order';

@Component({
    selector: 'app-history-detail',
    imports: [CurrencyPipe, DatePipe, BackButton],
    templateUrl: './history-detail.html',
    styleUrl: './history-detail.css',
})
export default class HistoryDetail implements OnInit {
    private httpServiceRecord = inject(HttpServiceRecord);
    private httpOrders = inject(HttpOrders);
    private route = inject(ActivatedRoute);
    private location = inject(Location);
    private alert = inject(AlertService);
    private destroyRef = inject(DestroyRef);

    clientId!: string;
    clientName = signal('');
    records = signal<ServiceRecordItem[]>([]);
    orders = signal<OrderRecord[]>([]);

    ngOnInit(): void {
        this.clientId = this.route.snapshot.paramMap.get('userId')!;
        this.loadRecords();
        this.loadOrders();
    }

    goBack(): void {
        this.location.back();
    }

    getTotalServices(): number {
        return this.records().reduce((sum, r) => sum + (r.finalCost || 0), 0);
    }

    getTotalOrders(): number {
        return this.orders().reduce((sum, o) => sum + (o.total || 0), 0);
    }

    async onDeleteRecord(id: string) {
        const confirmed = await this.alert.confirmDelete('el registro de', 'este servicio');
        if (!confirmed) return;

        this.httpServiceRecord.deleteServiceRecord(id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.alert.success('Eliminado', 'El registro se eliminó correctamente');
                    this.loadRecords();
                },
                error: (error) => this.alert.error('Error al eliminar', error.error?.msg),
            });
    }

    async onDeleteOrder(id: string) {
        const confirmed = await this.alert.confirmDelete('la orden de', 'esta compra');
        if (!confirmed) return;

        this.httpOrders.deleteOrder(id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.alert.success('Eliminada', 'La orden se eliminó correctamente');
                    this.loadOrders();
                },
                error: (error) => this.alert.error('Error al eliminar', error.error?.msg),
            });
    }

    private loadRecords(): void {
        this.httpServiceRecord.getServiceRecordsByUser(this.clientId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res: any) => {
                    // getServiceRecordsByUser() devuelve la respuesta cruda {msg, data} sin desempaquetar
                    const data: ServiceRecordItem[] = res?.data ?? [];
                    this.records.set(data);
                    if (data[0]?.appointment?.client) {
                        this.clientName.set((data[0].appointment.client as any).username);
                    }
                },
                error: (error) => console.error(error),
            });
    }

    private loadOrders(): void {
        this.httpOrders.getOrdersByUserId(this.clientId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res: any) => {
                    // getOrdersByUserId() devuelve la respuesta cruda {msg, data} sin desempaquetar
                    const data: OrderRecord[] = res?.data ?? [];
                    this.orders.set(data);
                    if (!this.clientName() && data[0]?.user) {
                        this.clientName.set((data[0].user as any).username);
                    }
                },
                error: (error) => console.error(error),
            });
    }
}
