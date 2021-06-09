import { $, $$, browser, ExpectedConditions } from 'protractor';

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
  it('Then: I should see my reading list and mark a book as finished', async() => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('npm');
    await form.submit();
    const readingListBooks = await $$('[data-testing="book-item"]');
    readingListBooks[0].$('[data-testing="want-to-read"]').click();

    const readingListButton = await $('[data-testing="toggle-reading-list"]');
    await readingListButton.click();
    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'), 'My Reading List'
      )
    );

    const readingListItems = await $$('[data-testing="reading-list-item"]' );
    const markAsFinishedButton = readingListItems[0].$('[data-testing="mark-as-finished-button"]');
    expect(markAsFinishedButton).toBeTruthy();
    await markAsFinishedButton.click();

    const finishedDateText = await $('[data-testing="finished-date"]');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement( finishedDateText, 'Finished on:')
    );

    const finishedButton = readingListItems[0].$('[data-testing="finished-button"]');
    expect(finishedButton).toBeTruthy();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="want-to-read"]'),
        'Finished'
      )
    );

  });
});
