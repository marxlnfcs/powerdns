import {ADVANCED_CLIENT} from "../variables";

/** Variables */
const zoneName = 'example.com';

/** Test **/
describe(`Creates a new zone with name "${zoneName}"`, () => {

    // create zone
    test(`Create zone "${zoneName}"`, async () => {
        await ADVANCED_CLIENT.createZone({
            name: zoneName,
            kind: 'Native',
        });
    });

    // delete zone
    afterAll(async () => await ADVANCED_CLIENT.deleteZone(zoneName));

})