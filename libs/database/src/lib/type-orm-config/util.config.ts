import { glob } from 'glob';

export const getEntities = (modules: string[]): string[] => {
    return modules.map(m => `libs/${m}/src/lib/infrastructure/typeorm/entities/*.entity.ts`);
}

export const getMigrations = async (): Promise<string[]> => {
    return await glob('libs/database/src/lib/migrations/*.ts');
}
