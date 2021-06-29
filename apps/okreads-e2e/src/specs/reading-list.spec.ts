import { $, $$, browser, ExpectedConditions, by } from 'protractor';

describe('When: I use the reading list feature', () => {
  it('Then: I should see my reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
  });

  it('Then: I should see my reading list and undo Added books using snackbar', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('JavaScript');
    await form.submit();
    const readingListBooks = await $$('[data-testing="book-item"]');
    expect(readingListBooks.length).toBeGreaterThan(1);

    await $$('.book--content--info button:enabled').first().click();
    await browser.waitForAngularEnabled(false);
    const readingListButton = await $('[data-testing="toggle-reading-list"]');
    await readingListButton.click();
    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'), 'My Reading List'
      )
    );

    let readingListItems = await $$('[data-testing="reading-list-item"]' );
    expect(readingListItems.length).toBe(1);

    const snackbar = await $$('.mat-simple-snackbar');
    expect(snackbar).toBeTruthy();
    await $('.mat-simple-snackbar-action .mat-button').click();
    readingListItems = await $$('[data-testing="reading-list-item"]' );
    expect(readingListItems.length).toBe(0);
    await browser.waitForAngularEnabled(true);
  });

  it('Then: I should add books to reading list and undo Remove books from reading list using snackbar',async ()=>{
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('JavaScript');
    await form.submit();
    const readingListBooks = await $$('[data-testing="book-item"]');
    readingListBooks[0].$('[data-testing="want-to-read"]').click();
    await browser.waitForAngularEnabled(false);
    const readingListButton = await $('[data-testing="toggle-reading-list"]');
    await readingListButton.click();
    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'), 'My Reading List'
      )
    );

    let readingListItems = await $$('[data-testing="reading-list-item"]' );
    expect(readingListItems.length).toBe(1);
    await readingListItems[0].$('[data-testing="remove-button"]').click();
    readingListItems = await $$('[data-testing="reading-list-item"]' );
    expect(readingListItems.length).toBe(0);

    const snackbar = await $$('.mat-simple-snackbar');
    expect(snackbar).toBeTruthy();
    await $('.mat-simple-snackbar-action .mat-button').click();
    readingListItems = await $$('[data-testing="reading-list-item"]' );
    expect(readingListItems.length).toBe(1);
    await browser.waitForAngularEnabled(true);
  });
});
