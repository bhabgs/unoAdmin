export declare const startNacos: (serverName: string) => Promise<{
    port: number;
}>;
export declare const getNacosConfig: ({ name, group, }: {
    name: string;
    group?: string;
}) => Promise<any>;
