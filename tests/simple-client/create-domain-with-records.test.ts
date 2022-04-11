import {SIMPLE_CLIENT} from "../variables";

/** Variables */
const domainName = 'example.com';

/** Test **/
describe(`Creates a new domain with name "${domainName}" with "@" and "www" record`, () => {
    
    // create domain
    test(`Create domain "${domainName}"`, async () => {
        await SIMPLE_CLIENT.createDomain(domainName);
    });

    // create record "@"
    test(`Creates wildcard "@"`, async () => {
        await SIMPLE_CLIENT.addRecord(domainName, {
            type: 'A',
            content: '127.0.0.1',
            comment: 'Entry point'
        });
    });

    // create record "www"
    test(`Creates subdomain "www"`, async () => {
        await SIMPLE_CLIENT.addRecord(domainName, {
            type: 'A',
            name: 'www',
            content: '127.0.0.1',
            comment: 'www-Subdomain'
        });
    });

    // delete domain
    afterAll(async () => await SIMPLE_CLIENT.deleteDomain(domainName));

})