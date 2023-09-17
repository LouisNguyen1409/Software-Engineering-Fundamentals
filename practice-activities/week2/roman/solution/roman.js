/*
    Given Roman numerals as a string, return their value as an integer. You may
    assume the Roman numerals are in the "standard" form, i.e. any digits
    involving 4 and 9 will always appear in the subtractive form.

    For example:
    > roman("II")
    2
    > roman("IV")
    4
    > roman("IX")
    9
    > roman("XIX")
    19
    > roman("XX")
    20
    > roman("MDCCLXXVI")
    1776
    > roman("MMXIX")
    2019
*/
export function roman(numerals) {
    const roman = {
        'M': 1000,
        'D': 500,
        'C': 100,
        'L': 50,
        'X': 10,
        'V': 5,
        'I': 1
    }
    let value = 0;
    let i = 0;
    for (i = 0; i < numerals.length; i++) {
        const cur = roman[numerals[i]];
        const next = roman[numerals[i + 1]];
        if (cur < next) {
            value += next - cur;
            i++;
        } else {
            value += cur;
        }
    }
    return value;
}
