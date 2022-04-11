export interface IPowerDNSSearchResult {
    content: string;
    disabled: boolean;
    name: string;
    zone_id: string;
    zone: string;
    type: string;
    ttl: number;

    /** Set to one of "record", "zone" or "comment" */
    object_type: string;
}