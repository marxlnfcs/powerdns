import {IPowerDNSHttpError} from "../interfaces/http.interface";

export class PowerDNSException extends Error {

    /** Variables **/
    url: string|null;
    status: number;
    statusMessage: string;
    error: string;
    errors: string[];

    /** Constructor */
    constructor(url: string, status: number, statusMessage: string, error: IPowerDNSHttpError, stack: any) {

        // set error message
        super(error?.error);

        // set information
        this.url = url;
        this.status = status;
        this.statusMessage = statusMessage;
        this.error = error.error;
        this.errors = error.errors || [];

        // set stack if available
        if(stack){
            this.stack = stack;
        }

    }

}