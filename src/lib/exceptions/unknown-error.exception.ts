import {PowerDNSException} from "./http.exception";

export class PowerDNSUnknownErrorException extends PowerDNSException {
    constructor(url: string, stack: any){
        super(
            url,
            900,
            'Unknown error',
            { error: 'Unknown error' },
            stack
        );
    }
}