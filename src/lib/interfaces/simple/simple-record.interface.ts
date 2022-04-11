import {IPowerDNSZoneRRSet} from "../zone.interface";

export interface IPowerDNSSimpleRecordWrite extends Omit<IPowerDNSZoneRRSet, 'content'|'comment'> {

    /** Values of the record */
    content: string|string[];

    /** Comments of the record */
    comment?: string|string[];

}

export interface IPowerDNSSimpleRecord extends Pick<IPowerDNSZoneRRSet, 'name'|'type'|'ttl'> {

    /** Value of the record */
    content: string[];

    /** Comment of the record */
    comment?: string[];

}