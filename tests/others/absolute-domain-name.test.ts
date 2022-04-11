import {appendAbsoluteDomainName, toAbsoluteDomainName} from "../../src/lib/internals/utilities";

describe('Checks if domainName gets converted correctly', () => {
    test('Checks if non absolute name gets converted', () => {
        expect(toAbsoluteDomainName('example.com')).toBe('example.com.');
    })
    test('Check if absolute names stay the same', () => {
        expect(toAbsoluteDomainName('example.com.')).toBe('example.com.');
    })
    test('Checks if subdomain gets appended correctly to domainName', () => {
        expect(appendAbsoluteDomainName('example.com', 'sub')).toBe('sub.example.com.');
    })
    test('Checks if subdomain with absolute domainName stays the same', () => {
        expect(appendAbsoluteDomainName('example.com', 'sub.example.com')).toBe('sub.example.com.');
    })
})