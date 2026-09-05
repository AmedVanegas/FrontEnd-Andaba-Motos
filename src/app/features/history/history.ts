import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import { HttpServiceRecord } from '../../core/services/http-service-record';
import { HttpOrders } from '../../core/services/http-orders';
import { BackButton } from '../../shared/components/back-button/back-button';

interface ClientHistorySummary {
    clientId: string;
    username: string;
    serviceCount: number;
    orderCount: number;
    totalSpent: number;
}

@Component({
    selector: 'app-history',
    imports: [CurrencyPipe, RouterLink, BackButton],
    templateUrl: './history.html',
    styleUrl: './history.css',
})
export default class History implements OnInit {
    private httpServiceRecord = inject(HttpServiceRecord);
    private httpOrders = inject(HttpOrders);
    private destroyRef = inject(DestroyRef);
    private location = inject(Location);

    clients = signal<ClientHistorySummary[]>([]);
    searchTerm = signal('');

    filteredClients = computed(() => {
        const term = this.searchTerm().toLowerCase().trim();
        if (!term) return this.clients();
        return this.clients().filter((c) => c.username?.toLowerCase().includes(term));
    });

    getInitials(username: string): string {
        if (!username) return '?';
        const parts = username.trim().split(/\s+/);
        if (parts.length === 1) {
            return parts[0].substring(0, 2).toUpperCase();
        }
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    ngOnInit(): void {
        this.loadSummary();
    }

    goBack(): void {
        this.location.back();
    }

    onSearchChange(term: string): void {
        this.searchTerm.set(term);
    }

    private loadSummary(): void {
        this.httpServiceRecord.getServiceRecords()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res: any) => {
                    // getServiceRecords() devuelve la respuesta cruda {msg, data} sin desempaquetar
                    const records = res?.data ?? [];

                    this.httpOrders.getOrders()
                        .pipe(takeUntilDestroyed(this.destroyRef))
                        .subscribe({
                            next: (orders) => this.buildSummary(records, orders),
                            error: (error) => console.error(error),
                        });
                },
                error: (error) => console.error(error),
            });
    }

    private buildSummary(records: any[], orders: any[]): void {
        const map = new Map<string, ClientHistorySummary>();

        for (const record of records) {
            const client = record.appointment?.client;
            if (!client?._id) continue;

            const entry = map.get(client._id) ?? {
                clientId: client._id,
                username: client.username,
                serviceCount: 0,
                orderCount: 0,
                totalSpent: 0,
            };
            entry.serviceCount++;
            entry.totalSpent += record.finalCost || 0;
            map.set(client._id, entry);
        }

        for (const order of orders) {
            const user = order.user;
            if (!user?._id) continue;

            const entry = map.get(user._id) ?? {
                clientId: user._id,
                username: user.username,
                serviceCount: 0,
                orderCount: 0,
                totalSpent: 0,
            };
            entry.orderCount++;
            entry.totalSpent += order.total || 0;
            map.set(user._id, entry);
        }

        this.clients.set(Array.from(map.values()).sort((a, b) => a.username?.localeCompare(b.username)));
    }
}
