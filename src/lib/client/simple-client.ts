import {PowerDNSAdvancedClient} from "./advanced-client";
import {IPowerDNSZone, IPowerDNSZoneItem, IPowerDNSZoneKind, IPowerDNSZoneRRSet} from "../interfaces/zone.interface";
import {IPowerDNSHttpGetZoneOptions, IPowerDNSHttpGetZonesOptions} from "../interfaces/http.interface";
import {arrayIncludes, isEqual} from "../internals/validations";
import {IPowerDNSSimpleRecord, IPowerDNSSimpleRecordWrite} from "../interfaces/simple/simple-record.interface";
import {SimpleSetupOptions} from "../interfaces/simple/simple-setup.interface";
import {isArray, isNil} from "lodash";
import {appendAbsoluteDomainName, toAbsoluteDomainName} from "../internals/utilities";
import {findSimpleRecord, mergeSimpleRecords} from "../internals/pdns-records-helper";
import {createPowerDNSAdvancedClient} from "../powerdns";
import {IPowerDNSOptions} from "../interfaces/options.interface";

export class PowerDNSSimpleClient {

    /** Base client */
    private baseClient: PowerDNSAdvancedClient = createPowerDNSAdvancedClient(this.options, this.selectedServer);

    /**
     * Constructor
     * @param options
     * @param selectedServer
     */
    constructor(
        private options: IPowerDNSOptions,
        private selectedServer: string = 'localhost'
    ){}

    /**
     * Returns a new instance of the client for the selected server
     *
     * @param   serverId
     * @returns PowerDNSAuthoritativeClient
     */
    useServer(serverId: string): PowerDNSSimpleClient {
        return this.selectedServer !== serverId ? new PowerDNSSimpleClient(this.options, serverId) : this;
    }

    /**
     * List all domains in a server
     * @see https://doc.powerdns.com/authoritative/http-api/zone.html#get--servers-server_id-zones
     *
     * @param   options - Options for this request
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns Promise<IPowerDNSZone[]>
     */
    getDomains(options?: IPowerDNSHttpGetZonesOptions): Promise<IPowerDNSZoneItem[]> {
        return this.baseClient.getZones(options);
    }

    /**
     * Returns information in the selected domain
     *
     * @param   domainName - Name of the domain
     * @param   options - Options for this request
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns IPowerDNSZone
     */
    getDomain(domainName: string, options?: IPowerDNSHttpGetZoneOptions): Promise<IPowerDNSZone> {
        return this.baseClient.getZone(domainName, {
            ...(options || {}),
            rrsets: false
        });
    }

    /**
     * Returns true if the server has the specified domain
     *
     * @param   domainName - Name of the domain
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     */
    hasDomain(domainName: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try{
                resolve((await this.getDomains({ dnssec: false })).filter(d => isEqual(d.name, toAbsoluteDomainName(domainName))).length > 0);
            }catch(e){
                reject(e);
            }
        });
    }

    /**
     * Creates a new zone. Returns the Zone on creation.
     *
     * @param   domainName - Name of the domain
     * @param   kind - Kind of the domain
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns IPowerDNSZone
     */
    createDomain(domainName: string, kind: IPowerDNSZoneKind = 'Native'): Promise<IPowerDNSZone> {
        return this.baseClient.createZone({ name: domainName, kind });
    }

    /**
     * Deletes this domain, all attached metadata and rrsets.
     *
     * @param   domainName - Name of the domain
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns void
     */
    deleteDomain(domainName: string): Promise<void> {
        return this.baseClient.deleteZone(domainName);
    }

    /**
     * Returns all records in this domain
     *
     * @param   domainName - Name of the domain
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns IPowerDNSZoneRRSet[]
     */
    getRecords(domainName: string): Promise<IPowerDNSSimpleRecord[]> {
        return new Promise<IPowerDNSSimpleRecord[]>(async (resolve, reject) => {
            this.baseClient.getZone(domainName)
                .then(r => resolve((r.rrsets || []).map(record => ({
                    name: record.name,
                    type: record.type,
                    ttl: record.ttl,
                    content: (record.records || []).map(r => r.content),
                    comments: (record.comments || []).map(r => r.content),
                }))))
                .catch(reject);
        });
    }

    /**
     * Returns true if the zone has one record with the specified conditions
     *
     * @param   domainName - Name of the domain
     * @param   recordType - Type of the record (e.g. "A", "MX")
     * @param   recordName - Name of the record
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     */
    hasRecord(domainName: string, recordType: string, recordName?: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            this.baseClient.getZone(domainName)
                .then(domain => resolve((domain.rrsets || []).filter(record => {
                    if(!recordName){
                        return isEqual(record.type, recordType);
                    }
                    return isEqual(record.type, recordType) && isEqual(record.name, recordName);
                }).length > 0))
                .catch(reject);
        });
    }

    /**
     * Returns the searched record if exists
     *
     * @param domainName
     * @param type
     * @param name
     */
    findRecords(domainName: string, type: string, name?: string): Promise<IPowerDNSSimpleRecord[]> {
        return new Promise<IPowerDNSSimpleRecord[]>((resolve, reject) => {
            this.baseClient.getZone(domainName, { rrsets: true, rrset_type: type })
                .then((domain) => {
                    const records: IPowerDNSSimpleRecord[] = [];
                    for(let record of (domain.rrsets || [])){
                        if(name && !isEqual(record.name, appendAbsoluteDomainName(domainName, name))) continue;
                        if(isEqual(record.type, type)){
                            records.push({
                                type: record.type,
                                name: record.name,
                                ttl: record.ttl,
                                content: (record.records || []).map(r => r.content),
                                comment: (record.comments || []).map(r => r.content)
                            });
                        }
                    }
                    resolve(records);
                })
                .catch(reject);
        });
    }

    /**
     * Add a record to the specified domain
     *
     * @param   domainName - Name of the domain
     * @param   record - Record to add
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns void
     */
    addRecord(domainName: string, record: IPowerDNSSimpleRecordWrite): Promise<void> {
        return this.addRecords(domainName, [record]);
    }

    /**
     * Adds multiple records to the specified domain
     *
     * @param   domainName - Name of the domain
     * @param   records - Array of records to add
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns void
     */
    addRecords(domainName: string, records: IPowerDNSSimpleRecordWrite[]): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try{

                // skip if no records are present
                if(records.length === 0){
                    return resolve();
                }

                // define array for records
                const dnsRecords = records.length > 1 ? await this.getRecords(domainName) : await this.findRecords(domainName, records[0].type, records[0].name);
                const recordList: IPowerDNSSimpleRecord[] = [];

                // add records to list
                for(let record of records){

                    // format record values
                    if(record.name) record.name = appendAbsoluteDomainName(domainName, record.name);

                    // get dns record if exists. Otherwise, create a new one
                    const dnsRecord = findSimpleRecord(dnsRecords, record.type, record.name);

                    // append content if dnsRecord is not null
                    if(dnsRecord){
                        if(record.content) dnsRecord.content = [ ...(dnsRecord.content || []), ...(isArray(record.content) ? record.content : [record.content]) ];
                        if(record.comment) dnsRecord.comment = [ ...(dnsRecord.comment || []), ...(isArray(record.comment) ? record.comment : [record.comment]) ];
                        if(record.ttl) dnsRecord.ttl = record.ttl;
                        if(!findSimpleRecord(recordList, dnsRecord.type, dnsRecord.name)) recordList.push(dnsRecord);
                    }

                    // add record if dnsRecord is null
                    recordList.push({
                        type: record.type,
                        name: record.name,
                        ttl: record.ttl,
                        content: !isNil(record.content) ? isArray(record.content) ? record.content : [record.content] : [],
                        comment: !isNil(record.comment) ? isArray(record.comment) ? record.comment : [record.comment] : [],
                    });

                }

                // set records
                this.setRecords(domainName, recordList)
                    .then(resolve)
                    .catch(reject);

            }catch(e){
                reject(e);
            }
        });
    }

    /**
     * Replaces all records with the specific name with the new one
     *
     * @param   domainName - Name of the domain
     * @param   record - Record to add
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns void
     */
    setRecord(domainName: string, record: IPowerDNSSimpleRecordWrite): Promise<void> {
        return this.setRecords(domainName, [record]);
    }

    /**
     * Replaces all records with de records collection
     *
     * @param   domainName - Name of the domain
     * @param   records - Array of records to add
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns void
     */
    setRecords(domainName: string, records: IPowerDNSSimpleRecordWrite[]): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try{

                // skip if no records are present
                if(records.length === 0){
                    return resolve();
                }

                // convert records
                const recordList: IPowerDNSSimpleRecord[] = records.map(record => ({
                    type: record.type,
                    name: record.name,
                    ttl: record.ttl,
                    content: !isNil(record.content) ? isArray(record.content) ? record.content : [record.content] : [],
                    comment: !isNil(record.comment) ? isArray(record.comment) ? record.comment : [record.comment] : [],
                }));

                // update records
                await this.baseClient.updateZoneRecords(domainName, mergeSimpleRecords(recordList).map((record): IPowerDNSZoneRRSet => ({
                    type: record.type,
                    name: record.name,
                    ttl: record.ttl,
                    changetype: 'REPLACE',
                    records: record.content.map(r => ({ content: r, disabled: false })),
                    comments: record.comment.map(r => ({ content: r })),
                })));

                // done
                resolve();

            }catch(e){
                reject(e);
            }
        });
    }

    /**
     * Removes one record from the specified domain
     *
     * @param   domainName - Name of the domain
     * @param   record - Record to add
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns void
     */
    removeRecord(domainName: string, record: Omit<IPowerDNSSimpleRecord, 'disabled'|'ttl'|'comment'>): Promise<void> {
        return this.removeRecords(domainName, [record]);
    }

    /**
     * Removes multiple records from the specified domain
     *
     * @param   domainName - Name of the domain
     * @param   records - Array of records to remove
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns void
     */
    removeRecords(domainName: string, records: Array<Omit<IPowerDNSSimpleRecord, 'content'|'disabled'|'ttl'|'comment'> & { content?: string|string[] }>): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try{

                // skip if no records are available
                if(!isArray(records) || records.length === 0){
                    return resolve();
                }

                // find existing record
                const dnsRecords = records.length > 1 ? await this.getRecords(domainName) : await this.findRecords(domainName, records[0].type, records[0].name);

                // skip if record not found
                if(dnsRecords){
                    return resolve();
                }

                // create array of records to be updated/deleted
                const recordList: IPowerDNSZoneRRSet[] = [];

                // iterate through records and add them to the record list
                for(let record of records){
                    const dnsRecord = findSimpleRecord(dnsRecords, record.type, record.name);
                    const recordsToDelete = !isNil(record.content) ? Array.isArray(record.content) ? record.content : [record.content] : [];
                    recordList.push({
                        type: record.type,
                        name: record.name,
                        records: dnsRecord && recordsToDelete.length > 0
                            ? dnsRecord.content.filter(c => !arrayIncludes(recordsToDelete, c)).map(c => ({
                                content: c
                              }))
                            : []
                    });
                }

                // update records
                await this.baseClient.updateZoneRecords(domainName, recordList.map(record => ({
                    type: record.type,
                    name: record.name,
                    changetype: ((record.records?.length || 0) === 0) ? 'DELETE' : 'REPLACE'
                })));

                // resolve
                resolve();

            }catch(e){
                reject(e);
            }
        });
    }

    /**
     * Removes multiple records from the specified domain
     *
     * @param   options - Options for the creation
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns void
     */
    setupDomain(options: SimpleSetupOptions): Promise<true> {
        return new Promise<true>(async (resolve, reject) => {
            try{

                // validate options
                if(isNil(options)) throw new Error('No domain object provided');
                if(isNil(options?.domain)) throw new Error('No domain specified');
                if(!isArray(options?.nameserver)) throw new Error('No nameserver provided');
                if(!options.nameserver.length) throw new Error('Your zone needs to have at least one nameserver');
                if(isNil(options?.hostmaster)) throw new Error('No hostmaster email provided');

                // format domainName and nameservers
                options.domain = toAbsoluteDomainName(options.domain);
                options.nameserver = options.nameserver.map(n => toAbsoluteDomainName(n));
                options.hostmaster = options.hostmaster.replace('@', '.');

                // create zone
                if(!await this.hasDomain(options.domain)){
                    await this.createDomain(options.domain);
                }

                // add hostmaster record
                await this.setRecord(options.domain, {
                    type: 'SOA',
                    ttl: 3600,
                    content: [
                        `${options.nameserver[0]} ${options.hostmaster}. 2020111501 10800 3600 604800 3600`
                    ]
                });

                // add custom records
                if(Array.isArray(options.records)){
                    await this.setRecords(options.domain, options.records);
                }

                // add nameserver record
                await this.setRecord(options.domain, {
                    name: options.domain,
                    type: 'NS',
                    ttl: 3600,
                    content: options.nameserver
                });

                // create crypto key
                if((await this.baseClient.getCryptoKeys(options.domain)).length === 0){
                    await this.baseClient.createCryptoKey(options.domain, {
                        keytype: 'ksk',
                        active: true
                    });
                }

                // successfully
                resolve(true);

            }catch(e){
                reject(e);
            }
        });
    }

}