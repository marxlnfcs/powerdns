import {IPowerDNSZoneKind} from "../zone.interface";
import {IPowerDNSSimpleRecordWrite} from "./simple-record.interface";

export interface SimpleSetupOptions {

    /** Name of the domain */
    domain: string;

    /**
     * Kind of the domain
     * @default Native
     */
    kind?: IPowerDNSZoneKind;

    /** Array of nameservers for this domain */
    nameserver: string[];

    /** Email of the hostmaster */
    hostmaster: string;

    /** Records to add */
    records?: IPowerDNSSimpleRecordWrite[];

}