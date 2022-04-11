export interface IPowerDNSTSIGKeyItem extends Omit<IPowerDNSTSIGKey, 'key'> {}

export interface IPowerDNSTSIGKeyCreate extends Omit<IPowerDNSTSIGKey, 'id'|'type'> {}
export interface IPowerDNSTSIGKeyUpdate extends Omit<IPowerDNSTSIGKey, 'id'|'type'> {}

export interface IPowerDNSTSIGKey {

    /** Set to "TSIGKey" */
    type: 'TSIGKey';

    /** The id for this key. Used in the TSIGkey URL endpoint. */
    id: string;

    /** The name of the key */
    name: string;

    /** The algorithm of the TSIG key */
    algorithm: string;

    /** The Base64 encoded secret key. Empry when listing keys. MAY be empty when POSTing to have the server generate the key material */
    key: string;

}