export interface IPowerDNSHttpError {

    /** A human readable error message */
    error: string;

    /** Optional array of multiple errors encountered during processing */
    errors?: string[];

}

export interface IPowerDNSHttpGetZonesOptions {

    /**
     * When set to the name of a zone, only this zone is returned. If no zone with that name exists, the response is an empty array. This can e.g. be used to check if a zone exists in the database without having to guess/encode the zone's id or to check if a zone exists.
     *
     * @default not set
     */
    zone?: string;

    /**
     * “true” (default) or “false”, whether to include the “dnssec” and ”edited_serial” fields in the Zone objects. Setting this to ”false” will make the query a lot faster.
     *
     * @default true
     */
    dnssec?: boolean;

}

export interface IPowerDNSHttpGetZoneOptions {

    /**
     * “true” (default) or “false”, whether to include the “rrsets” in the response Zone object.
     *
     * @default true
     */
    rrsets?: boolean;

    /**
     * Limit output to RRsets for this name.
     */
    rrset_name?: string;

    /**
     * Limit output to the RRset of this type. Can only be used together with rrset_name.
     */
    rrset_type?: string;


}

export interface IPowerDNSHttpCreateZoneOptions {

    /**
     * “true” (default) or “false”, whether to include the “rrsets” in the response Zone object.
     *
     * @default true
     */
    rrsets?: boolean;

}

export interface IPowerDNSHttpSearchOptions {

    /** Maximum number of entries to return */
    max?: number;

    /**
     * Type of data to search for. One of "all", "zone", "record", or "comment"
     *
     * @default all
     */
    object_type?: 'all'|'zone'|'record'|'comment';

}

export interface IPowerDNSHttpGetStatisticsOptions {

    /**
     * When set to the name of a specific statistic, only this value is returned. If no statistic with that name exists, the response has a 422 status and an error message.
     */
    statistic?: string;

    /**
     *  “true” (default) or “false”, whether to include the Ring items, which can contain thousands of log messages or queried domains. Setting this to ”false” may make the response a lot smaller.
     *
     *  @default true
     */
    includerings: boolean;

}