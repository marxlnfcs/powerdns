import {IPowerDNSHttpError} from "../interfaces/http.interface";
import {PowerDNSException} from "./http.exception";

export class PowerDNSNotFoundException extends PowerDNSException {
    constructor(url: string, error: IPowerDNSHttpError, stack: any){
        super(
            url,
            404,
            'Requested item was not found',
            error,
            stack
        );
    }
}