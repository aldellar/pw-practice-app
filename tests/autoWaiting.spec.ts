import {test, expect} from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('http://uitestingplayground.com/ajax')
    page.getByText('Button Triggering Ajax Request').click()
})

test('auto waiting', async({page}) => {
    const successButton = page.locator('.bg-success')
   
    // await successButton.click()
    // const text = await successButton.textContent()

    //await successButton.waitFor({state: "attached"})     // it will pass after this because this waiting for it to be attached
    // const text = await successButton.allTextContents()  // this will fai as it does not wait

    //  expect(text).toContain('Data loaded with AJAX get request.')

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000})

})

test('alternative waits', async ({page}) => {
    const successButton = page.locator('.bg-success')

    //__ wait for element
    // await page.waitForSelector('.bg-success')

    // __ wait for particular response
    // await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    // __ wait for network calls to be completed ('NOT RECOMMENDED')
    await page.waitForLoadState('networkidle')

    const text = await successButton.allTextContents()  //this will fail without some wait put in place 
    expect(text).toContain('Data loaded with AJAX get request.')

})