import {PowerDNSAdvancedClient} from "./client/advanced-client";
import {PowerDNSSimpleClient} from "./client/simple-client";
import {IPowerDNSOptions} from "./interfaces/options.interface";

export function createPowerDNSSimpleClient(options: IPowerDNSOptions, selectedServer: string = 'localhost'): PowerDNSSimpleClient {
    return new PowerDNSSimpleClient(options, selectedServer);
}

export function createPowerDNSAdvancedClient(options: IPowerDNSOptions, selectedServer: string = 'localhost'): PowerDNSAdvancedClient {
    return new PowerDNSAdvancedClient(options, selectedServer);
}
