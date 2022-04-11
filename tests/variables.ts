import {createPowerDNSAdvancedClient, createPowerDNSSimpleClient} from "../src/lib/powerdns";

export const SIMPLE_CLIENT = createPowerDNSSimpleClient({
    baseUrl: 'http://localhost:8082/api/v1',
    apiKey: 'apikey'
});

export const ADVANCED_CLIENT = createPowerDNSAdvancedClient({
    baseUrl: 'http://localhost:8082/api/v1',
    apiKey: 'apikey'
});