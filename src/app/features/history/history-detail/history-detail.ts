import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import { HttpServiceRecord } from '../../../core/services/http-service-record';
import { HttpOrders } from '../../../core/services/http-orders';
import { HttpMotorcycles } from '../../../core/services/http-motorcycles';
import { HttpServices } from '../../../core/services/http-services';
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
    private httpMotorcycles = inject(HttpMotorcycles);
    private httpServices = inject(HttpServices);
    private route = inject(ActivatedRoute);
    private location = inject(Location);
    private alert = inject(AlertService);
    private destroyRef = inject(DestroyRef);

    clientId!: string;
    clientName = signal('');
    records = signal<ServiceRecordItem[]>([]);
    orders = signal<OrderRecord[]>([]);

    // Mapas por _id para resolver motorcycle/service cuando el backend
    // devuelve appointment.motorcycle / appointment.service como IDs
    // sueltos en vez de objetos poblados (bug actual del populate anidado).
    // El fix correcto está en el backend; esto es un respaldo mientras tanto.
    private motorcyclesById = signal<Record<string, any>>({});
    private servicesById = signal<Record<string, any>>({});

    ngOnInit(): void {
        this.clientId = this.route.snapshot.paramMap.get('userId')!;
        this.loadLookups();
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

    /**
     * Devuelve el objeto de la moto de un registro, ya sea que venga
     * poblada dentro de appointment o solo como ID (en cuyo caso se
     * busca en el mapa cargado con la lista completa de motos).
     */
    getMotorcycle(record: ServiceRecordItem): any {
        const motorcycle = record.appointment?.motorcycle as any;
        if (motorcycle && typeof motorcycle === 'object') return motorcycle;
        if (typeof motorcycle === 'string') return this.motorcyclesById()[motorcycle] ?? null;
        return null;
    }

    /**
     * Igual que getMotorcycle pero para el nombre del servicio.
     */
    getServiceName(record: ServiceRecordItem): string {
        const service = record.appointment?.service as any;
        if (service && typeof service === 'object') return service.name ?? 'N/A';
        if (typeof service === 'string') return this.servicesById()[service]?.name ?? 'N/A';
        return 'N/A';
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

    private loadLookups(): void {
        this.httpMotorcycles.getMotorcycles()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (data: any) => {
                    const list: any[] = data?.data ?? data ?? [];
                    const map: Record<string, any> = {};
                    list.forEach((m) => (map[m._id] = m));
                    this.motorcyclesById.set(map);
                },
                error: (err) => console.error(err),
            });

        this.httpServices.getServices()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (data: any) => {
                    const list: any[] = data?.data ?? data ?? [];
                    const map: Record<string, any> = {};
                    list.forEach((s) => (map[s._id] = s));
                    this.servicesById.set(map);
                },
                error: (err) => console.error(err),
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