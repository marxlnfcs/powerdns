import {IPowerDNSHttpError} from "../interfaces/http.interface";
import {PowerDNSException} from "./http.exception";

export class PowerDNSBadRequestException extends PowerDNSException {
    constructor(url: string, error: IPowerDNSHttpError, stack: any){
        super(
            url,
            400,
            'The supplied request was not valid',
            error,
            stack
        );
    }
}