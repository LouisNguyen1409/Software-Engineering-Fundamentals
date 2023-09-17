import { roman } from './roman';

describe('Roman Testing', () => {
    test('Test documentation', () => {
        expect(roman("II")).toEqual(2);
        expect(roman("MDCCLXXVI")).toEqual(1776);
        expect(roman("MMXIX")).toEqual(2019);
    });
    test('Test single characters', () => {
        expect(roman("I")).toEqual(1);
        expect(roman("V")).toEqual(5);
        expect(roman("X")).toEqual(10);
        expect(roman("L")).toEqual(50);
        expect(roman("C")).toEqual(100);
        expect(roman("M")).toEqual(1000);
    });
    test('Test nine numbers', () => {
        expect(roman('XLIX')).toEqual(49);
        expect(roman('XCIX')).toEqual(99);
        expect(roman('CDXCIX')).toEqual(499);
        expect(roman('CMXCIX')).toEqual(999);
        expect(roman("C")).toEqual(100);
        expect(roman("M")).toEqual(1000);
    });
    test('Test random numbers', () => {
        expect(roman('XIX')).toEqual(19);
        expect(roman('XX')).toEqual(20);
        expect(roman('CXXX')).toEqual(130);
    });

});
