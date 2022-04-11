import {SIMPLE_CLIENT} from "../variables";

/** Variables */
const domainName = 'example.com';

/** Test **/
describe(`Creates a new domain with name "${domainName}"`, () => {

    // create domain
    test(`Create domain "${domainName}"`, async () => {
        await SIMPLE_CLIENT.createDomain(domainName);
    });

    // delete domain
    afterAll(async () => await SIMPLE_CLIENT.deleteDomain(domainName));

})