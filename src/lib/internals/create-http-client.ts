import * as axios from "axios";
import {Axios, AxiosError, AxiosProxyConfig} from "axios";
import {createInvalidProxyConfigException, createInvalidProxyUrlException} from "../exceptions/invalid-proxy.exception";
import {PowerDNSBadRequestException} from "../exceptions/bad-request.exception";
import {PowerDNSException} from "../exceptions/http.exception";
import {PowerDNSNotFoundException} from "../exceptions/not-found.exception";
import {PowerDNSUnprocessableEntityException} from "../exceptions/unprocessable-entity.exception";
import {PowerDNSInternalServerErrorException} from "../exceptions/internal-server-error.exception";
import {PowerDNSUnknownErrorException} from "../exceptions/unknown-error.exception";
import {PowerDNSTimeoutException} from "../exceptions/timeout.exception";
import {omitByRecursively} from "./utilities";
import {isNil, isObject, isString} from "lodash";
import {IPowerDNSOptions} from "../interfaces/options.interface";

/** @internal */
export function createHttpClient(options: IPowerDNSOptions): Axios {
    return axios.default.create({
        baseURL: options.baseUrl,
        headers: {
            'x-api-key': options.apiKey
        },
        transformRequest: (data: any) => !isNil(data) && isObject(data) ? JSON.stringify(omitByRecursively(data)) : data,
        proxy: createHttpProxySettings(options)
    })
}

/** @internal */
export function createHttpProxySettings(options: IPowerDNSOptions): AxiosProxyConfig|false {

    // check if proxy url or host is defined
    if(typeof options?.proxy !== 'string' && !options?.proxy?.url && !options?.proxy?.host){
        return false;
    }

    // parse proxy url if available
    if(isString(options.proxy) || options?.proxy?.url){
        try{
            const url = new URL(isString(options.proxy) ? options.proxy : options.proxy.url);
            return {
                host: url.hostname,
                port: parseInt(url.port),
                protocol: url.protocol + ':',
                auth: !isString(options?.proxy) ? options?.proxy?.auth : null
            }
        }catch(e){
            throw createInvalidProxyUrlException(isString(options.proxy) ? options.proxy : options.proxy.url);
        }
    }

    // check if host, port and protocol are defined
    if(!options.proxy?.host || !options.proxy?.port || !options.proxy?.protocol){
        throw createInvalidProxyConfigException(options as IPowerDNSOptions);
    }

    // return proxy config
    return {
        host: options.proxy.host,
        port: options.proxy.port,
        protocol: options.proxy.protocol + ':',
        auth: options.proxy.auth
    }

}

/** @internal */
export function createHttpException(e: AxiosError): PowerDNSException {

    // define error defaults
    let [url, status, data] = [e?.config?.url, null, null, null];

    // check if axios response is available
    if (e?.response) {
        status = e.response.status;
        data = e.response.data || null;
    }else if(e?.request){
        status = 408;
    }

    // create exceptions
    switch(status){
        case 400: return new PowerDNSBadRequestException(url, data, e?.stack);
        case 404: return new PowerDNSNotFoundException(url, data, e?.stack);
        case 408: return new PowerDNSTimeoutException(url, e?.stack);
        case 422: return new PowerDNSUnprocessableEntityException(url, data, e?.stack);
        case 500: return new PowerDNSInternalServerErrorException(url, data, e?.stack);
        default: return new PowerDNSUnknownErrorException(url, e?.stack);
    }

}