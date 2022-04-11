import {PowerDNSException} from "./http.exception";

export class PowerDNSTimeoutException extends PowerDNSException {
    constructor(url: string, stack: any){
        super(
            url,
            400,
            'Request timeout',
            { error: 'Request timeout' },
            stack
        );
    }
}