import {domainForUrl, isValidURL} from './urlUtils';

describe('urlUtils', () => {
  describe('isValidURL', () => {
    const URLS = [
      'https://reactnative.dev',
      'http://reactnative.dev',
      'https://reactnative.dev/docs/getting-started',
    ];
    const NON_URLS = [
      null,
      42,
      new Date(),
      'This is a sentence.',
      'domain.com',
    ];

    describe('valid URLs', () => {
      test.each(URLS)('when testing %j returns true', url => {
        expect(isValidURL(url)).toBe(true);
      });
    });

    describe('non-URLs', () => {
      test.each(NON_URLS)('when testing %j returns false', url => {
        expect(isValidURL(url)).toBe(false);
      });
    });
  });

  describe('domainForUrl', () => {
    it('returns null for null', () => {
      expect(domainForUrl(null)).toEqual(null);
    });

    it('returns non-URLs unchanged', () => {
      const string = 'My hovercraft is full of eels';
      expect(domainForUrl(string)).toEqual(string);
    });

    it('returns only the protocol and domain of the URL', () => {
      expect(domainForUrl('https://reactnative.dev/docs/magic')).toEqual(
        'reactnative.dev',
      );
    });

    it('trims www subdomains', () => {
      expect(domainForUrl('https://www.codingitwrong.com/about')).toEqual(
        'codingitwrong.com',
      );
    });

    it('does not trim subdomains other than www', () => {
      expect(domainForUrl('https://listapp.codingitwrong.com/todos')).toEqual(
        'listapp.codingitwrong.com',
      );
    });
  });
});
