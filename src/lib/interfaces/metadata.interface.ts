export type IPowerDNSMetadataKind =
    'ALLOW-AXFR-FROM'|'API-RECTIFY'|'AXFR-SOURCE'|'ALLOW-DNSUPDATE-FROM'|'TSIG-ALLOW-DNSUPDATE'|'FORWARD-DNSUPDATE'|'SOA-EDIT-DNSUPDATE'|'NOTIFY-DNSUPDATE'|
    'ALSO-NOTIFY'|'AXFR-MASTER-TSIG'|'GSS-ALLOW-AXFR-PRINCIPAL'|'IXFR'|'LUA-AXFR-SCRIPT'|'NSEC3NARROW'|'NSEC3PARAM'|'PRESIGNED'|'PUBLISH-CDNSKEY'|'PUBLISH-CDS'|
    'SLAVE-RENOTIFY'|'SOA-EDIT'|'SOA-EDIT-API'|'TSIG-ALLOW-AXFR'|'TSIG-ALLOW-DNSUPDATE'|string
;

export interface IPowerDNSMetadataCreate extends Pick<IPowerDNSMetadata, 'kind'|'metadata'>{}

export interface IPowerDNSMetadata {

    /** Set to "Metadata" */
    type: 'Metadata';

    /**
     * Kind of the metadata
     * @description Custom metadata must have the 'X-' prefix. Otherwise, the request gets rejected.
     * @see https://doc.powerdns.com/authoritative/domainmetadata.html
     */
    kind: IPowerDNSMetadataKind;

    /** Array with all values for this metadata kind */
    metadata: string[];

}