describe('Create and Use Board', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should allow creating and using boards', async () => {
    // add board
    await element(by.text('Add Board')).tap();

    // rename board
    await element(by.text('(click to name board)')).tap();
    await element(by.id('text-input-board-name')).typeText('De Tox Board');
    await element(by.text('Save Board')).tap();
    await expect(element(by.text('Save Board'))).not.toBeVisible();
    await expect(element(by.text('De Tox Board'))).toBeVisible();

    // create column
    await element(by.text('Add Column')).tap();
    await element(by.id('text-input-column-name')).typeText('All');
    await element(by.text('Save Column')).tap();
    await expect(element(by.text('Save Column'))).not.toBeVisible();
    await expect(element(by.text('All'))).toBeVisible();

    // create card
    await element(by.text('Add Card')).tap();
  });
});
