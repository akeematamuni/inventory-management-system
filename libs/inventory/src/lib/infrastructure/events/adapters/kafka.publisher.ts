import { Injectable, OnModuleInit, Logger, Inject, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientKafka } from "@nestjs/microservices";
import { firstValueFrom  } from "rxjs";
import { IInventoryEventPublisher, InventoryDomainEvent } from "../../../domain";

@Injectable()
export class InventoryPublisherKafka implements IInventoryEventPublisher, OnModuleInit, OnModuleDestroy {
    // @Client({
    //     transport: Transport.KAFKA,
    //     options: {
    //         client: {
    //             clientId: 'inventory',
    //             brokers: [process.env['KAFKA_BROKER'] ?? 'localhost:9092']
    //         },
    //         producer: {
    //             allowAutoTopicCreation: true
    //         }
    //     }
    // })
    private readonly client: ClientKafka | null = null;
    private logger = new Logger(InventoryPublisherKafka.name);

    constructor(
        @Inject(ConfigService)
        private readonly configService: ConfigService
    ) {
        const kafkaEnabled = configService.get('KAFKA_ENABLED') === 'true';

        if (kafkaEnabled) {
            this.client = new ClientKafka({
                client: {
                    clientId: 'inventory',
                    brokers: [this.configService.getOrThrow('KAFKA_BROKER')]
                },
                producer: {
                    allowAutoTopicCreation: true
                }
            });
        }
    }

    private resolveTopicName(event: InventoryDomainEvent): string {
        const value = event.constructor.name
            .replace('Event', '')
            .replace(/([A-Z])/g, 
                (_, letter, offset) => offset > 0 ? `_${letter.toLowerCase()}` : letter.toLowerCase()
            );

        return `inventory.${value}`;
    }

    private resolveKey(event: InventoryDomainEvent): string {
        if ('productId' in event) return event.productId as string;
        if ('transferId' in event) return event.transferId as string;
        if ('adjustmentId' in event) return event.adjustmentId as string;
        if ('cycleCountId' in event) return event.cycleCountId as string;
        return 'inventory';
    }

    async onModuleInit(): Promise<void> {
        /** In case there is a switch from the traditional fire and forget */
        // const topics = [
        //     'inventory.stock_received',
        //     'inventory.stock_transfer_dispatched',
        //     'inventory.stock_transfer_received',
        //     'inventory.adjustment_created',
        //     'inventory.cycle_count_approved',
        //     'inventory.opening_stock_set',
        // ];

        // topics.forEach(topic => this.client.subscribeToResponseOf(topic));
        await this.client?.connect();
    }

    async onModuleDestroy(): Promise<void> {
        await this.client?.close();
    }

    async publish(event: InventoryDomainEvent): Promise<void> {
        if (!this.client) return;
        
        const topic = this.resolveTopicName(event);
        const payload = { 
            key: this.resolveKey(event), 
            value: event 
        };

        try {
            /** NOTE: If there is failure check JSON serialization */
            await firstValueFrom(this.client.emit(topic, payload));
        } catch (error) {
            this.logger.error(`Failed to publish event to topic ${topic}`, error);
            throw error; 
        }
    }
}
