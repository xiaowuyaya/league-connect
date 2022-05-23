export interface Credentials {
    /**
     * The system port the LCU API is running on
     */
    port: number;
    /**
     * The password for the LCU API
     */
    password: string;
    /**
     * The system process id for the LeagueClientUx process
     */
    pid: number;
    /**
     * Riot Games' self-signed root certificate (contents of .pem). If
     * it is `undefined` then unsafe authentication will be used.
     */
    certificate?: string;
}
export interface AuthenticationOptions {
    /**
     * League Client process name. Set to RiotClientUx if you would like to
     * authenticate with the Riot Client
     *
     * Defaults: LeagueClientUx
     */
    name?: string;
    /**
     * Does not return before the League Client has been detected. This means the
     * function stays unresolved until a League has been found.
     *
     * Defaults: false
     */
    awaitConnection?: boolean;
    /**
     * The time duration in milliseconds between each attempt to locate a League
     * Client process. Has no effect if awaitConnection is false
     *
     * Default: 2500
     */
    pollInterval?: number;
    /**
     * Riot Games' self-signed root certificate (contents of .pem)
     *
     * Default: version of certificate bundled in package
     */
    certificate?: string;
    /**
     * Do not authenticate requests with Riot Games' self-signed root certificate
     *
     * Default: true if `certificate` is `undefined`
     */
    unsafe?: boolean;
    /**
     * Use deprecated Windows WMIC command line over Get-CimInstance. Does nothing
     * if the system is not running on Windows. This is used to keep backwards
     * compatability with Windows 7 systems that don't have Get-CimInstance
     *
     * See https://github.com/matsjla/league-connect/pull/54
     * See https://github.com/matsjla/league-connect/pull/68
     *
     * Default: false
     */
    useDeprecatedWmic?: boolean;
    /**
     * Set the Windows shell to use.
     *
     * Default: 'powershell'
     */
    windowsShell?: 'cmd' | 'powershell';
}
/**
 * Indicates that the application does not run on an environment that the
 * League Client supports. The Client runs on windows, linux or darwin.
 */
export declare class InvalidPlatformError extends Error {
    constructor();
}
/**
 * Indicates that the league client could not be found
 */
export declare class ClientNotFoundError extends Error {
    constructor();
}
/**
 * Locates a League Client and retrieves the credentials for the LCU API
 * from the found process
 *
 * If options.awaitConnection is false the promise will resolve into a
 * rejection if a League Client is not running
 *
 * @param options {AuthenticationOptions} Authentication options, if any
 *
 * @throws InvalidPlatformError If the environment is not running
 * windows/linux/darwin
 */
export declare function authenticate(options?: AuthenticationOptions): Promise<Credentials>;
