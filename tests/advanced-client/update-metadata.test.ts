import {ADVANCED_CLIENT} from "../variables";

/** Variables */
const zoneName = 'example.com.';
const metadataName = 'X-TEST';
const metadataValue = 'value';
const metadataValue2 = 'value2';

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

    // update metadata
    test(`Update metadata "${metadataName}" with value "${metadataValue2}"`, async () => {
        await ADVANCED_CLIENT.updateMetadata(zoneName, metadataName, metadataValue2);
    });

    // delete domain
    afterAll(async () => await ADVANCED_CLIENT.deleteZone(zoneName));

})