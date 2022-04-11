import {SIMPLE_CLIENT} from "../variables";

/** Variables */
const domainName = 'example.com';

/** Test */
describe(`Setup domain "${domainName}" with basic information`, () => {
    
    // setup domain
    test(`Create the domain "${domainName}" with defined nameserver, hostmaster and records`, async () => {
       await SIMPLE_CLIENT.setupDomain({
           domain: domainName,
           nameserver: ['1.1.1.1', '2.2.2.2'],
           hostmaster: 'admin@' + domainName,
           records: [
               {
                   type: 'A',
                   content: '127.0.0.1',
                   comment: 'Entry point'
               },
               {
                   type: 'A',
                   name: 'www',
                   content: '127.0.0.1',
                   comment: 'www-Subdomain'
               }
           ]
       });
    });

    // delete domain
    afterAll(async () => await SIMPLE_CLIENT.deleteDomain(domainName));

})