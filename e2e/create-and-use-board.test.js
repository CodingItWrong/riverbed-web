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
    await element(by.label('Board Name')).atIndex(0).typeText('De Tox Board');
    await element(by.id('scroll-view')).scrollTo('bottom');
    await element(by.text('Save Board')).tap();
    await expect(element(by.text('Save Board'))).not.toBeVisible();
    await expect(element(by.text('De Tox Board'))).toBeVisible();

    // create column
    await element(by.text('Add Column')).tap();
    await element(by.label('Column Name')).atIndex(0).typeText('All');
    await element(by.id('scroll-view')).scrollTo('bottom');
    await element(by.text('Save Column')).tap();
    await expect(element(by.text('Save Column'))).not.toBeVisible();
    await expect(element(by.text('All'))).toBeVisible();

    // create card
    await element(by.text('Add Card')).tap();

    // add field
    await element(by.label('Edit Elements')).atIndex(0).tap();
    await element(by.text('Add Element')).tap();
    await element(by.text('Field')).tap();

    // edit field
    await element(by.label('Field Name')).atIndex(0).typeText('Greeting');
    await element(by.label('Show Field')).tap();
    await element(by.id('scroll-view')).atIndex(1).scrollTo('bottom');
    await element(by.text('Save Field')).tap();
    await element(by.label('Done Editing Elements')).atIndex(0).tap();

    // edit card
    await element(by.label('Greeting')).atIndex(0).typeText('Hello!');
    await element(by.label('Close card')).atIndex(0).tap();
    await expect(element(by.label('Close card'))).not.toBeVisible();

    // check list
    await expect(element(by.text('Hello!'))).toBeVisible();
  });
});
