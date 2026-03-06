export const getEntitiesOrMigrations = (modules: string[], folder: 'entities' | 'migrations'): string[] => {
    return modules.map(
        module => `libs/${module}/src/lib/infrastructure/typeorm/${folder}/*${folder === 'entities' ? '.entity' : ''}.{ts,js}`
    );
}
