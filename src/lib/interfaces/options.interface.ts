export interface IPowerDNSOptions {
    baseUrl: string;
    apiKey: string;
    timeout?: number;
    proxy?: IPowerDNSOptionsProxy|string;
    rejectUnauthorized?: boolean;
}

export interface IPowerDNSOptionsProxy {
    url?: string;
    host?: string;
    port?: number;
    auth?: {
        username: string;
        password: string;
    };
    protocol?: 'http'|'https';
}