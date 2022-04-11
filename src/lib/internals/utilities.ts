import {isArray, isNil, isObject} from "lodash";

/**
 * Converts the name to an absolute domainName (e.g. example.com => example.com.)
 * @param name
 * @internal
 */
export function toAbsoluteDomainName(name: string): string|null {
    if(typeof name !== 'string') throw new TypeError('name must be typeof string');
    switch(name) {
        case '@': return null;
        default: return !name.trim().endsWith('.') ? `${name}.` : name;
    }
}

/**
 * Appends the absoluteDomainName to the recordName if not present
 * @param domainName
 * @param recordName
 * @internal
 */
export function appendAbsoluteDomainName(domainName: string, recordName: string): string {
    if(typeof domainName !== 'string') throw new TypeError('domainName must be typeof string');
    domainName = toAbsoluteDomainName(domainName);
    if(recordName){
        recordName = toAbsoluteDomainName(recordName);
        return recordName.endsWith(domainName) ? recordName : `${recordName}${domainName}`;
    }
    return domainName;
}

/**
 * Removes all nil keys in object recursively
 * @param obj
 * @internal
 */
export function omitByRecursively<T extends any>(obj: T): T {
    if(!isNil(obj) && (isArray(obj) || isObject(obj))) {
        for(const [key, value] of (isArray(obj) ? obj.entries() : Object.entries(obj))){
            if(isNil(value)){
                delete obj[key];
            }
            obj[key] = omitByRecursively(value);
        }
    }
    return obj;
}