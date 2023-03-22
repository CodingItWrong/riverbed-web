describe('Smoke Test', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display boards and cards from the server', async () => {
    await element(by.text('Fake Board')).tap();
    await expect(element(by.text('All Cards'))).toBeVisible();
    await expect(element(by.text('Hello, Fake!'))).toBeVisible();
  });
});
