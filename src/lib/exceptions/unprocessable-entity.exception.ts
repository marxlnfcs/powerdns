import {IPowerDNSHttpError} from "../interfaces/http.interface";
import {PowerDNSException} from "./http.exception";

export class PowerDNSUnprocessableEntityException extends PowerDNSException {
    constructor(url: string, error: IPowerDNSHttpError, stack: any){
        super(
            url,
            422,
            'The input to the operation was not valid',
            error,
            stack
        );
    }
}