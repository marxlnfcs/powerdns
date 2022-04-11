export type IPowerDNSServerDaemonType = 'authoritative'|'recursor';

export interface IPowerDNSServer {

    /** Set to “Server” */
    type: 'Server';

    /** The id of the server (e.g. "localhost") */
    id: string;

    /** “recursor” for the PowerDNS Recursor and “authoritative” for the Authoritative Server */
    daemon_type: IPowerDNSServerDaemonType;

    /** The version of the server software */
    version: string;

    /** The API endpoint for this server */
    url: string;

    /** The API endpoint for this server’s configuration */
    config_url: string;

    /** The API endpoint for this server’s zones */
    zones_url: string;

}

export interface IPowerDNSServerConfig {

    /** set to "ConfigSetting" **/
    type: 'ConfigSetting';

    /** The name of the setting (e.g. "webserver-port") */
    name: string;

    /** The value of the setting name */
    value: string;

}