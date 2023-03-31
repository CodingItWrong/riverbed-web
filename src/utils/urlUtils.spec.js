import {isValidURL} from './urlUtils';

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
});
