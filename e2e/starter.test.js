describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have welcome screen', async () => {
    // await element(by.text('http://localhost:8081')).tap();
    await expect(element(by.text('ListApp'))).toBeVisible();
  });
});
