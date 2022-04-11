import {ADVANCED_CLIENT} from "../variables";

/** Variables */
const zoneName = 'example.com.';
const metadataName = 'X-TEST';
const metadataValue = 'value';

describe(`Creates metadata`, () => {

    // create zone
    test(`Create zone "${zoneName}"`, async () => {
        await ADVANCED_CLIENT.createZone({
            name: zoneName,
            kind: 'Native',
        });
    });

    // create metadata
    test(`Create metadata "${metadataName}" with value "${metadataValue}"`, async () => {
        await ADVANCED_CLIENT.createMetadata(zoneName,{
            kind: metadataName,
            metadata: [metadataValue]
        });
    });

    // delete metadata
    test(`Delete metadata "${metadataName}"`, async () => {
        await ADVANCED_CLIENT.deleteMetadata(zoneName, metadataName);
    });

    // delete domain
    afterAll(async () => await ADVANCED_CLIENT.deleteZone(zoneName));

})