import {IPowerDNSHttpError} from "../interfaces/http.interface";
import {PowerDNSException} from "./http.exception";

export class PowerDNSInternalServerErrorException extends PowerDNSException {
    constructor(url: string, error: IPowerDNSHttpError, stack: any){
        super(
            url,
            500,
            'Internal server error',
            error,
            stack
        );
    }
}