export interface IPowerDNSCryptoKeyCreate extends
    Omit<IPowerDNSCryptoKey, 'id'|'type'>
{}

export interface IPowerDNSCryptoKey{

    /**
     * The internal identifier
     * @readonly
     */
    id: number;

    /** Set to "Cryptokey" */
    type: 'Cryptokey';

    /** Type of the key */
    keytype: 'ksk'|'zsk'|'csk';

    /** Whether or not the key is in active use */
    active?: boolean;

    /** Whether or not the DNSKEY record is published in the zone */
    published?: boolean;

    /** The DNSKEY record for this key */
    dnskey?: string;

    /** An array of DS records for this key */
    ds?: string[];

    /** An array of DS records for this key, filtered by CDS publication settings */
    cds?: string[];

    /** The private key in ISC format */
    privatekey?: string;

    /** The name of the algorithm of the key. Should be mnemonic */
    algorithm?: string;

    /** The size of the key */
    bits?: number;

}