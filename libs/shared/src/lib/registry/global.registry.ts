/* eslint-disable @typescript-eslint/no-explicit-any */
export class GlobalRegistry {
    public static readonly entities: any[] = [];
    public static readonly migrations: any[] = [];
    public static readonly controllers: any[] = [];

    public static addEntities(entities: any[]) {
        this.entities.push(...entities);
    }

    public static addMigrations(migrations: any[]) {
        this.migrations.push(...migrations);
    }

    public static addControllers(controllers: any[]) {
        this.controllers.push(...controllers);
    }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
