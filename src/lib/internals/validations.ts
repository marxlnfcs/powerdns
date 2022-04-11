import {isNil, isArray, isString} from "lodash";

/** @internal */
export function isEqual(text1: string, text2: string): boolean {
    return text1?.trim()?.toLowerCase() === text2?.trim()?.toLowerCase();
}

/** @internal */
export function contains(source: string, searchFor: string): boolean {
    if(isNil(source) || isNil(searchFor)) return false;
    return source.trim().toLowerCase().includes(searchFor.trim().toLowerCase());
}

/** @internal */
export function arrayIncludes(arr: any[], searchFor: any): boolean {
    if(isNil(arr) || isNil(searchFor) || !isArray(arr)) return false;
    return arr.map(i => isString(i) ? i.trim().toLowerCase() : i).includes(isString(searchFor) ? searchFor.trim().toLowerCase() : searchFor);
}