import {IPowerDNSOptions} from "../interfaces/options.interface";
import {createHttpClient, createHttpException} from "../internals/create-http-client";
import {IPowerDNSServer, IPowerDNSServerConfig} from "../interfaces/server.interface";
import {
    IPowerDNSZone,
    IPowerDNSZoneCreate,
    IPowerDNSZoneItem,
    IPowerDNSZoneRRSet,
    IPowerDNSZoneUpdate
} from "../interfaces/zone.interface";
import {
    IPowerDNSHttpCreateZoneOptions,
    IPowerDNSHttpGetStatisticsOptions,
    IPowerDNSHttpGetZoneOptions,
    IPowerDNSHttpGetZonesOptions,
    IPowerDNSHttpSearchOptions
} from "../interfaces/http.interface";
import {IPowerDNSCryptoKey, IPowerDNSCryptoKeyCreate} from "../interfaces/crypto-key.interface";
import {IPowerDNSMetadata, IPowerDNSMetadataCreate} from "../interfaces/metadata.interface";
import {
    IPowerDNSTSIGKey,
    IPowerDNSTSIGKeyCreate,
    IPowerDNSTSIGKeyItem,
    IPowerDNSTSIGKeyUpdate
} from "../interfaces/tsig-key.interface";
import {IPowerDNSAutoPrimaryServer} from "../interfaces/autoprimary-server.interface";
import {IPowerDNSSearchResult} from "../interfaces/search-result.interface";
import {IPowerDNSStatistic} from "../interfaces/statistic.interface";
import {IPowerDNSCacheFlushResult} from "../interfaces/cache-flush-result.interface";
import {appendAbsoluteDomainName, toAbsoluteDomainName} from "../internals/utilities";
import {isArray} from "lodash";

export class PowerDNSAdvancedClient {

    /** Variables */
    protected http = createHttpClient(this.options);

    /**
     * Constructor
     * @param options
     * @param selectedServer
     */
    constructor(
        protected options: IPowerDNSOptions,
        protected selectedServer: string = 'localhost'
    ){}

    /**
     * Returns a new instance of the client for the selected server
     *
     * @param   serverId
     * @returns PowerDNSHttpClient
     */
    useServer(serverId: string): PowerDNSAdvancedClient {
        return this.selectedServer !== serverId ? new PowerDNSAdvancedClient(this.options, serverId) : this;
    }

    /**
     * List all servers
     * @see https://doc.powerdns.com/authoritative/http-api/server.html#get--servers
     *
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns Promise<IPowerDNSServer[]>
     */
    getServers(): Promise<IPowerDNSServer[]> {
        return new Promise<IPowerDNSServer[]>((resolve, reject) => {
            this.http.get<IPowerDNSServer[]>('/servers')
                .then(r => resolve(r.data))
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * Get a server
     * @see https://doc.powerdns.com/authoritative/http-api/server.html#get--servers-server_id
     *
     * @param   serverId - The id of the server to retrieve
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns Promise<IPowerDNSServer>
     */
    getServer(serverId: string = this.selectedServer): Promise<IPowerDNSServer> {
        return new Promise<IPowerDNSServer>((resolve, reject) => {
           this.http.get<IPowerDNSServer>(`/servers/${serverId}`)
               .then(r => resolve(r.data))
               .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * Returns all configurations in the selected server
     *
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns Promise<IPowerDNSServerConfig[]>
     */
    getConfigs(): Promise<IPowerDNSServerConfig[]> {
        return new Promise<IPowerDNSServerConfig[]>((resolve, reject) => {
            this.http.get<IPowerDNSServerConfig[]>(`/servers/${this.selectedServer}/config`)
                .then(r => resolve(r.data))
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * List all Zones in a server
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
    getZones(options?: IPowerDNSHttpGetZonesOptions): Promise<IPowerDNSZoneItem[]>{
        return new Promise<IPowerDNSZoneItem[]>((resolve, reject) => {
           this.http.get<IPowerDNSZoneItem[]>(`/servers/${this.selectedServer}/zones`, { params: options })
               .then(r => resolve(r.data))
               .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * Returns information in the selected zone
     * @see https://doc.powerdns.com/authoritative/http-api/zone.html#get--servers-server_id-zones-zone_id
     *
     * @param   zoneId - The id of the zone to retrieve
     * @param   options - Options for this request
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns IPowerDNSZone
     */
    getZone(zoneId: string, options?: IPowerDNSHttpGetZoneOptions): Promise<IPowerDNSZone> {
        return new Promise<IPowerDNSZone>((resolve, reject) => {
            this.http.get<IPowerDNSZone>(`/servers/${this.selectedServer}/zones/${zoneId}`, { params: options })
                .then(r => resolve(r.data))
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * Returns the zone in AXFR format.
     * @see https://doc.powerdns.com/authoritative/http-api/zone.html#get--servers-server_id-zones-zone_id-export
     *
     * @param   zoneId - The id of the zone to retrieve
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns string
     */
    exportZone(zoneId: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.http.get<string>(`/servers/${this.selectedServer}/zones/${zoneId}/export`)
                .then(r => resolve(r.data))
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * Rectify the zone data.
     * @description This does not take into account the API-RECTIFY metadata. Fails on slave zones and zones that do not have DNSSEC.
     * @see https://doc.powerdns.com/authoritative/http-api/zone.html#put--servers-server_id-zones-zone_id-rectify
     *
     * @param   zoneId - The id of the zone to retrieve
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns string
     */
    rectifyZone(zoneId: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.http.get<string>(`/servers/${this.selectedServer}/zones/${toAbsoluteDomainName(zoneId)}/rectify`)
                .then(r => resolve(r.data))
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * Creates a new zone. Returns the Zone on creation.
     * @see https://doc.powerdns.com/authoritative/http-api/zone.html#post--servers-server_id-zones
     *
     * @param   dto - The zone to create
     * @param   options - Options for this request
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns IPowerDNSZone
     */
    createZone(dto: IPowerDNSZoneCreate, options?: IPowerDNSHttpCreateZoneOptions): Promise<IPowerDNSZone> {
        return new Promise<IPowerDNSZone>((resolve, reject) => {
            this.http.post<IPowerDNSZone>(`/servers/${this.selectedServer}/zones`, { ...dto, name: toAbsoluteDomainName(dto.name) }, { params: options })
                .then(r => resolve(r.data))
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * Modifies basic zone data.
     * @description The only fields in the zone structure which can be modified are: kind, masters, account, soa_edit, soa_edit_api, api_rectify, dnssec, and nsec3param. All other fields are ignored.
     * @see https://doc.powerdns.com/authoritative/http-api/zone.html#put--servers-server_id-zones-zone_id
     *
     * @param   zoneId - The zone to update
     * @param   dto - Values to update
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns void
     */
    updateZone(zoneId: string, dto: IPowerDNSZoneUpdate): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http.put(`/servers/${this.selectedServer}/zones/${toAbsoluteDomainName(zoneId)}`, dto)
                .then(r => resolve(r.data))
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * Creates/modifies/deletes RRsets present in the payload and their comments
     * @see https://doc.powerdns.com/authoritative/http-api/zone.html#put--servers-server_id-zones-zone_id
     *
     * @param   zoneId - The zone to update
     * @param   records
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns void
     */
    updateZoneRecords(zoneId: string, records: IPowerDNSZoneRRSet[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            records = (records || []).filter(r => r.type).map(record => {
                record.name = appendAbsoluteDomainName(zoneId, record.name);
                record.ttl = record.ttl || 3600;
                record.comments = (record.comments).filter(c => !!c.content).map(c => {
                    c.account = c.account || '';
                    return c;
                })
                return record;
            });

            this.http.patch(`/servers/${this.selectedServer}/zones/${toAbsoluteDomainName(zoneId)}`, { rrsets: records })
                .then(() => resolve())
                .catch(e => {
                    console.log(createHttpException(e));
                    reject(createHttpException(e));
                });
        });
    }

    /**
     * Deletes this zone, all attached metadata and rrsets.
     * @see https://doc.powerdns.com/authoritative/http-api/zone.html#delete--servers-server_id-zones-zone_id
     *
     * @param   zoneId - The zone to update
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns void
     */
    deleteZone(zoneId: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http.delete(`/servers/${this.selectedServer}/zones/${toAbsoluteDomainName(zoneId)}`)
                .then(() => resolve())
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * Retrieve slave zone from its master.
     * @description Fails when zone kind is not Slave, or slave is disabled in the configuration. Clients MUST NOT send a body.
     * @see https://doc.powerdns.com/authoritative/http-api/zone.html#put--servers-server_id-zones-zone_id-axfr-retrieve
     *
     * @param   zoneId - The zone to update
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns void
     */
    retrieveSlaveFromMaster(zoneId: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http.put(`/servers/${this.selectedServer}/zones/${toAbsoluteDomainName(zoneId)}/axfr-retrieve`)
                .then(() => resolve())
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * Send a DNS NOTIFY to all slaves.
     * @description Fails when zone kind is not Master or Slave, or master and slave are disabled in the configuration. Only works for Slave if renotify is on. Clients MUST NOT send a body.
     * @see https://doc.powerdns.com/authoritative/http-api/zone.html#put--servers-server_id-zones-zone_id-notify
     *
     * @param   zoneId - The zone to update
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns void
     */
    notifyAllSlaves(zoneId: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http.put(`/servers/${this.selectedServer}/zones/${toAbsoluteDomainName(zoneId)}/notify`)
                .then(() => resolve())
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * Get all CryptoKeys for a zone, except the privatekey
     * @see https://doc.powerdns.com/authoritative/http-api/cryptokey.html#get--servers-server_id-zones-zone_id-cryptokeys
     *
     * @param   zoneId - The id of the zone to retrieve
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns void
     */
    getCryptoKeys(zoneId: string): Promise<IPowerDNSCryptoKey[]> {
        return new Promise<IPowerDNSCryptoKey[]>((resolve, reject) => {
            this.http.get<IPowerDNSCryptoKey[]>(`/servers/${this.selectedServer}/zones/${toAbsoluteDomainName(zoneId)}/cryptokeys`)
                .then(r => resolve(r.data))
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * Returns all data about the CryptoKey, including the privatekey.
     * @see https://doc.powerdns.com/authoritative/http-api/cryptokey.html#get--servers-server_id-zones-zone_id-cryptokeys-cryptokey_id
     *
     * @param   zoneId - The id of the zone to retrieve
     * @param   cryptoKeyId - The cryptoKey to retrieve
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns void
     */
    getCryptoKey(zoneId: string, cryptoKeyId: number): Promise<IPowerDNSCryptoKey> {
        return new Promise<IPowerDNSCryptoKey>((resolve, reject) => {
            this.http.get<IPowerDNSCryptoKey>(`/servers/${this.selectedServer}/zones/${toAbsoluteDomainName(zoneId)}/cryptokeys/${cryptoKeyId}`)
                .then(r => resolve(r.data))
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * Creates a Cryptokey
     * @description This method adds a new key to a zone. The key can either be generated or imported by supplying the content parameter. if content, bits and algo are null, a key will be generated based on the default-ksk-algorithm and default-ksk-size settings for a KSK and the default-zsk-algorithm and default-zsk-size options for a ZSK.
     * @see https://doc.powerdns.com/authoritative/http-api/cryptokey.html#post--servers-server_id-zones-zone_id-cryptokeys
     *
     * @param   zoneId - The id of the zone to retrieve
     * @param   dto - The cryptoKey to create
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns IPowerDNSZone
     */
    createCryptoKey(zoneId: string, dto?: IPowerDNSCryptoKeyCreate): Promise<IPowerDNSCryptoKey> {
        return new Promise<IPowerDNSCryptoKey>((resolve, reject) => {
            this.http.post<IPowerDNSCryptoKey>(`/servers/${this.selectedServer}/zones/${toAbsoluteDomainName(zoneId)}/cryptokeys`, dto)
                .then(r => resolve(r.data))
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * This method (de)activates a key.
     * @see https://doc.powerdns.com/authoritative/http-api/cryptokey.html#put--servers-server_id-zones-zone_id-cryptokeys-cryptokey_id
     *
     * @param   zoneId - The id of the zone to retrieve
     * @param   cryptoKeyId - The cryptoKey to retrieve
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns void
     */
    toggleCryptoKeyActiveState(zoneId: string, cryptoKeyId: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http.put<void>(`/servers/${this.selectedServer}/zones/${toAbsoluteDomainName(zoneId)}/cryptokeys/${cryptoKeyId}`)
                .then(() => resolve())
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * This method deletes a key specified by cryptokey_id.
     * @see https://doc.powerdns.com/authoritative/http-api/cryptokey.html#delete--servers-server_id-zones-zone_id-cryptokeys-cryptokey_id
     *
     * @param   zoneId - The id of the zone to retrieve
     * @param   cryptoKeyId - The cryptoKey to retrieve
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns void
     */
    deleteCryptoKey(zoneId: string, cryptoKeyId: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http.delete(`/servers/${this.selectedServer}/zones/${toAbsoluteDomainName(zoneId)}/cryptokeys/${cryptoKeyId}`)
                .then(() => resolve())
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * Get all the Metadata associated with the zone.
     * @see https://doc.powerdns.com/authoritative/http-api/metadata.html#get--servers-server_id-zones-zone_id-metadata
     *
     * @param   zoneId - The id of the zone to retrieve
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns IPowerDNSMetadata[]
     */
    getMetadata(zoneId: string): Promise<IPowerDNSMetadata[]> {
        return new Promise<IPowerDNSMetadata[]>((resolve, reject) => {
            this.http.get<IPowerDNSMetadata[]>(`/servers/${this.selectedServer}/zones/${toAbsoluteDomainName(zoneId)}/metadata`)
                .then(r => resolve(r.data))
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * Get the content of a single kind of domain metadata as a Metadata object.
     * @see https://doc.powerdns.com/authoritative/http-api/metadata.html#get--servers-server_id-zones-zone_id-metadata-metadata_kind
     *
     * @param   zoneId - The id of the zone to retrieve
     * @param   metadataKind - The kind of the metadata to retrieve
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns IPowerDNSMetadata
     */
    getMetadataContents(zoneId: string, metadataKind: string): Promise<IPowerDNSMetadata> {
        return new Promise<IPowerDNSMetadata>((resolve, reject) => {
            this.http.get<IPowerDNSMetadata>(`/servers/${this.selectedServer}/zones/${toAbsoluteDomainName(zoneId)}/metadata/${metadataKind}`)
                .then(r => resolve(r.data))
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * Creates a set of metadata entries
     * @see https://doc.powerdns.com/authoritative/http-api/metadata.html#post--servers-server_id-zones-zone_id-metadata
     *
     * @param   zoneId - The id of the zone to retrieve
     * @param   dto - Set of metadata to create
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns IPowerDNSMetadata
     */
    createMetadata(zoneId: string, dto: IPowerDNSMetadataCreate): Promise<IPowerDNSMetadata> {
        return new Promise<IPowerDNSMetadata>((resolve, reject) => {
            this.http.post<IPowerDNSMetadata>(`/servers/${this.selectedServer}/zones/${toAbsoluteDomainName(zoneId)}/metadata`, dto)
                .then(r => resolve(r.data))
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * Replace the content of a single kind of domain metadata.
     * @see https://doc.powerdns.com/authoritative/http-api/metadata.html#put--servers-server_id-zones-zone_id-metadata-metadata_kind
     *
     * @param   zoneId - The id of the zone to retrieve
     * @param   metadataKind - The kind of the metadata to retrieve
     * @param   metadata - Values to update
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns IPowerDNSMetadata
     */
    updateMetadata(zoneId: string, metadataKind: string, metadata: string|string[]): Promise<IPowerDNSMetadata> {
        return new Promise<IPowerDNSMetadata>((resolve, reject) => {
            this.http.put<IPowerDNSMetadata>(`/servers/${this.selectedServer}/zones/${toAbsoluteDomainName(zoneId)}/metadata/${metadataKind}`, { metadata: isArray(metadata) ? metadata : [metadata] })
                .then(r => resolve(r.data))
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * Delete all items of a single kind of domain metadata.
     * @see https://doc.powerdns.com/authoritative/http-api/metadata.html#delete--servers-server_id-zones-zone_id-metadata-metadata_kind
     *
     * @param   zoneId - The id of the zone to retrieve
     * @param   metadataKind - The kind of the metadata to retrieve
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns void
     */
    deleteMetadata(zoneId: string, metadataKind: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http.delete(`/servers/${this.selectedServer}/zones/${toAbsoluteDomainName(zoneId)}/metadata/${metadataKind}`)
                .then(() => resolve())
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * Get all TSIGKeys on the server, except the actual key
     * @see https://doc.powerdns.com/authoritative/http-api/tsigkey.html#get--servers-server_id-tsigkeys
     *
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns IPowerDNSTSIGKeyItem[]
     */
    getTSIGKeys(): Promise<IPowerDNSTSIGKeyItem[]> {
        return new Promise<IPowerDNSTSIGKeyItem[]>((resolve, reject) => {
            this.http.get<IPowerDNSTSIGKeyItem[]>(`/servers/${this.selectedServer}/tsigkeys`)
                .then(r => resolve(r.data))
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * Get a specific TSIGKeys on the server, including the actual key
     * @see https://doc.powerdns.com/authoritative/http-api/tsigkey.html#get--servers-server_id-tsigkeys-tsigkey_id
     *
     * @param   keyId - The id of the key to retrieve
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns IPowerDNSTSIGKey
     */
    getTSIGKey(keyId: string): Promise<IPowerDNSTSIGKey> {
        return new Promise<IPowerDNSTSIGKey>((resolve, reject) => {
            this.http.get<IPowerDNSTSIGKey>(`/servers/${this.selectedServer}/tsigkeys/${keyId}`)
                .then(r => resolve(r.data))
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * Add a TSIG key
     * @description This methods add a new TSIGKey. The actual key can be generated by the server or be provided by the client
     * @see https://doc.powerdns.com/authoritative/http-api/tsigkey.html#post--servers-server_id-tsigkeys
     *
     * @param   dto - Key to create
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns IPowerDNSTSIGKey
     */
    createTSIGKey(dto: IPowerDNSTSIGKeyCreate): Promise<IPowerDNSTSIGKey> {
        return new Promise<IPowerDNSTSIGKey>((resolve, reject) => {
            this.http.post<IPowerDNSTSIGKey>(`/servers/${this.selectedServer}/tsigkeys`, dto)
                .then(r => resolve(r.data))
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * Updates the specific TSIGKey on the server.
     * @description The TSIGKey at tsigkey_id can be changed in multiple ways: Changing the Name, this will remove the key with tsigkey_id after adding. Changing the Algorithm. Changing the Key.
     * @see https://doc.powerdns.com/authoritative/http-api/tsigkey.html#put--servers-server_id-tsigkeys-tsigkey_id
     *
     * @param   keyId - The id of the key to retrieve
     * @param   dto - Values to update
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns IPowerDNSMetadata
     */
    updateTSIGKey(keyId: string, dto: IPowerDNSTSIGKeyUpdate): Promise<IPowerDNSTSIGKey> {
        return new Promise<IPowerDNSTSIGKey>((resolve, reject) => {
            this.http.post<IPowerDNSTSIGKey>(`/servers/${this.selectedServer}/tsigkeys/${keyId}`, dto)
                .then(r => resolve(r.data))
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * Delete the TSIGKey
     * @see https://doc.powerdns.com/authoritative/http-api/tsigkey.html#delete--servers-server_id-tsigkeys-tsigkey_id
     *
     * @param   keyId - The id of the key to retrieve
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns void
     */
    deleteTSIGKey(keyId: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http.delete(`/servers/${this.selectedServer}/tsigkeys/${keyId}`)
                .then(() => resolve())
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * Get a list of autoprimary servers
     * @see https://doc.powerdns.com/authoritative/http-api/autoprimaries.html#get--servers-server_id-autoprimaries
     *
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns IPowerDNSAutoPrimaryServer[]
     */
    getAutoPrimaries(): Promise<IPowerDNSAutoPrimaryServer[]> {
        return new Promise<IPowerDNSAutoPrimaryServer[]>((resolve, reject) => {
            this.http.get<IPowerDNSAutoPrimaryServer[]>(`/servers/${this.selectedServer}/autoprimaries`)
                .then(r => resolve(r.data))
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * Add an autoprimary server
     * @description This methods add a new autoprimary server.
     * @see https://doc.powerdns.com/authoritative/http-api/autoprimaries.html#post--servers-server_id-autoprimaries
     *
     * @param   dto - Key to create
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns IPowerDNSTSIGKey
     */
    addAutoPrimary(dto: IPowerDNSAutoPrimaryServer): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http.post<void>(`/servers/${this.selectedServer}/autoprimaries`, dto)
                .then(r => resolve(r.data))
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * Delete the autoprimary entry
     * @see https://doc.powerdns.com/authoritative/http-api/autoprimaries.html#delete--servers-server_id-autoprimaries-ip-nameserver
     *
     * @param   ip - IP address of autoprimary
     * @param   nameserver - DNS name of the autoprimary
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns void
     */
    deleteAutoPrimary(ip: string, nameserver: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.http.delete(`/servers/${this.selectedServer}/autoprimaries/${ip}/${nameserver}`)
                .then(() => resolve())
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * Search the data inside PowerDNS
     * @see https://doc.powerdns.com/authoritative/http-api/search.html#get--servers-server_id-search-data
     *
     * @param   search - The string to search for
     * @param   options - The request options
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns IPowerDNSSearchResult
     */
    search(search: string, options?: IPowerDNSHttpSearchOptions): Promise<IPowerDNSSearchResult> {
        return new Promise<IPowerDNSSearchResult>((resolve, reject) => {
            this.http.get<IPowerDNSSearchResult>(`/servers/${this.selectedServer}/search-data`, { params: { q: search, max: options?.max, object_type: options?.object_type || 'all' } })
                .then(r => resolve(r.data))
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * Query PowerDNS internal statistics.
     * @see https://doc.powerdns.com/authoritative/http-api/statistics.html#get--servers-server_id-statistics
     *
     * @param   options - The request options
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns IPowerDNSStatistic[]
     */
    getStatistics(options?: IPowerDNSHttpGetStatisticsOptions): Promise<IPowerDNSStatistic[]> {
        return new Promise<IPowerDNSStatistic[]>((resolve, reject) => {
            this.http.get<IPowerDNSStatistic[]>(`/servers/${this.selectedServer}/statistics`, { params: options })
                .then(r => resolve(r.data))
                .catch(e => reject(createHttpException(e)));
        });
    }

    /**
     * Flush a cache-entry by name
     * @see https://doc.powerdns.com/authoritative/http-api/cache.html#put--servers-server_id-cache-flush
     *
     * @param   domain - The domain name to flush from cache
     * @throws  PowerDNSBadRequestException
     * @throws  PowerDNSNotFoundException
     * @throws  PowerDNSTimeoutException
     * @throws  PowerDNSUnprocessableEntityException
     * @throws  PowerDNSInternalServerErrorException
     * @returns IPowerDNSCacheFlushResult
     */
    flushCache(domain: string): Promise<IPowerDNSCacheFlushResult> {
        return new Promise<IPowerDNSCacheFlushResult>((resolve, reject) => {
            this.http.put<IPowerDNSCacheFlushResult>(`/servers/${this.selectedServer}/cache/flush`, { params: { domain } })
                .then(r => resolve(r.data))
                .catch(e => reject(createHttpException(e)));
        });
    }

}