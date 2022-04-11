export type IPowerDNSZoneKind = 'Native'|'Master'|'Slave'|'Forwarded';

export interface IPowerDNSZoneItem extends Omit<IPowerDNSZone, 'rrsets'>{}

export interface IPowerDNSZoneCreate extends
    Pick<IPowerDNSZone, 'name'|'kind'>,
    Pick<Partial<IPowerDNSZone>, 'dnssec'|'api_rectify'|'soa_edit'|'soa_edit_api'|'slave_tsig_key_ids'|'masters'>
{}
export interface IPowerDNSZoneUpdate extends Pick<Partial<IPowerDNSZone>, 'kind'|'masters'|'account'|'soa_edit'|'soa_edit_api'|'api_rectify'|'dnssec'|'nsec3param'>{}

export interface IPowerDNSZone {

    /** Opaque zone id (string), assigned by the server, should not be interpreted by the application. Guaranteed to be safe for embedding in URLs. */
    id: string;

    /** Name of the zone (e.g. "example.com."). MUST have a trailing dot */
    name: string;

    /** Set to "Zone" */
    type: 'Zone';

    /** API endpoint for this zone */
    url: string;

    /** Zone kind, one of "Native", "Master" and "Slave" */
    kind: IPowerDNSZoneKind;

    /** RRSets in this zone (for zones/{zone_id} endpoint only; omitted during GET on the .../zones list endpoint) */
    rrsets: IPowerDNSZoneRRSet[];

    /** The SOA serial number */
    serial: number;

    /** The SOA serial notifications have been sent out for */
    notified_serial: number;

    /** The SOA serial as seen in query responses. Calculated using the SOA-EDIT metadata, default-soa-edit and default-soa-edit-signed settings */
    edited_serial: number;

    /** List of IP addresses configured as a master for this zone (“Slave” type zones only) */
    masters: string[];

    /** Whether or not this zone is DNSSEC signed (inferred from presigned being true XOR presence of at least one cryptokey with active being true) */
    dnssec: boolean;

    /** The NSEC3PARAM record */
    nsec3param: string;

    /** Whether or not the zone uses NSEC3 narrow */
    nsec3narrow: boolean;

    /** Whether or not the zone is pre-signed */
    presigned: boolean;

    /** The SOA-EDIT metadata item */
    soa_edit: string;

    /** The SOA-EDIT-API metadata item */
    soa_edit_api: string;

    /** Whether or not the zone will be rectified on data changes via the API */
    api_rectify: boolean;

    /** MAY contain a BIND-style zone file when creating a zone */
    zone: string;

    /** MAY be set. Its value is defined by local policy */
    account: string;

    /** MAY be sent in client bodies during creation, and MUST NOT be sent by the server. Simple list of strings of nameserver names, including the trailing dot. Not required for slave zones. */
    nameservers: string[];

    /**
     * The id of the TSIG keys used for master operation in this zone
     *
     * @link https://doc.powerdns.com/authoritative/tsig.html#provisioning-outbound-axfr-access
     */
    master_tsig_key_ids: string[];

    /**
     * The id of the TSIG keys used for slave operation in this zone
     *
     * @link https://doc.powerdns.com/authoritative/tsig.html#provisioning-signed-notification-and-axfr-requests
     */
    slave_tsig_key_ids: string[];

}

export interface IPowerDNSZoneRRSet {

    /** Name for record set (e.g. “www.powerdns.com.”) */
    name?: string;

    /** Type of this record (e.g. “A”, “PTR”, “MX”) */
    type: string;

    /** DNS TTL of the records, in seconds. MUST NOT be included when changetype is set to “DELETE”. */
    ttl?: number;

    /**
     * MUST be added when updating the RRSet. Must be REPLACE or DELETE.
     * With DELETE:  All existing RRs matching name and type will be deleted, including all comments.
     * With REPLACE: When records are present, all existing RRs matching name and type will be deleted, and then new records given in records will be created.
     *               If no records are left, any existing comments will be deleted as well. When comments is present, all existing comments for the RRs matching name and type will be deleted, and then new comments given in comments will be created.
     */
    changetype?: 'DELETE'|'REPLACE';

    /** All records in this RRSet. When updating Records, this is the list of new records (replacing the old ones). Must be empty when changetype is set to DELETE. An empty list results in deletion of all records (and comments). */
    records?: IPowerDNSZoneRRSetRecord[];

    /** List of Comment. Must be empty when changetype is set to DELETE. An empty list results in deletion of all comments. modified_at is optional and defaults to the current server time. */
    comments?: IPowerDNSZoneRRSetComment[];

}

export interface IPowerDNSZoneRRSetRecord{

    /** The content of this record */
    content: string;

    /** Whether or not this record is disabled. When unset, the record is not disabled */
    disabled?: boolean;

}

export interface IPowerDNSZoneRRSetComment {

    /** The actual comment */
    content: string;

    /** Name of an account that added the comment */
    account?: string;

    /**
     * Timestamp of the last change to the comment
     * @readonly
     */
    modified_at?: number;

}