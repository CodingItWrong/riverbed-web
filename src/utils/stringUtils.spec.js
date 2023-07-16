import {isValidEmail} from './stringUtils';

describe('stringUtils', () => {
  describe('isValidEmail', () => {
    it('withEmptyString_returnsFalse', () => {
      expect(isValidEmail('')).toBe(false);
    });

    it('withSimpleString_returnsFalse', () => {
      expect(isValidEmail('example')).toBe(false);
    });

    it('withOnlyDomain_returnsFalse', () => {
      expect(isValidEmail('example.com')).toBe(false);
    });

    it('withInvalidDomain_returnsFalse', () => {
      expect(isValidEmail('example@example')).toBe(false);
    });

    it('withBasicEmail_returnsTrue', () => {
      expect(isValidEmail('example@example.com')).toBe(true);
    });

    it('withTwoAts_returnsTrue', () => {
      expect(isValidEmail('example@example@example.com')).toBe(false);
    });

    it('withSpecialCharacters_returnsTrue', () => {
      expect(isValidEmail('example+more@example.co')).toBe(true);
    });

    it('withInvalidCharactersInTLD_returnsfalse', () => {
      expect(isValidEmail('example+more@example.a11y')).toBe(false);
    });
  });
});
