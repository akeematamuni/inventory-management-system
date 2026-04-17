import { Module } from '@nestjs/common';
import { PrometheusModule, makeCounterProvider, makeHistogramProvider } from '@willsoto/nestjs-prometheus';

@Module({
    imports: [
        PrometheusModule.register({
            path: '/metrics',
            defaultMetrics: { enabled: true }
        }),
    ],
    providers: [
        // track total HTTP requests by method, route, status
        makeCounterProvider({
            name: 'ims_http_requests_total',
            help: 'Total number of HTTP requests',
            labelNames: ['method', 'route', 'status_code'],
        }),

        // track HTTP request duration
        makeHistogramProvider({
            name: 'ims_http_request_duration_seconds',
            help: 'HTTP request duration in seconds',
            labelNames: ['method', 'route', 'status_code'],
            buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
        }),

        // track domain events published
        makeCounterProvider({
            name: 'ims_domain_events_published_total',
            help: 'Total domain events published',
            labelNames: ['event_name', 'transport'],
        }),

        // track stock movements
        makeCounterProvider({
            name: 'ims_stock_movements_total',
            help: 'Total stock movements recorded',
            labelNames: ['movement_type', 'warehouse_id'],
        }),
    ],
    exports: [PrometheusModule],
})
export class MetricsModule {}
