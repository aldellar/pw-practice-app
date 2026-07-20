import {test, expect} from '@playwright/test';


/*test.beforeAll(() => { //this before every single test dont really use this that much

})*/

/* test.afterEach() but people dont really use this */

//in this case before each happens before all test
test.beforeEach(async({page}) => {      //hooks basically repeating stuff
    await page.goto('http://localhost:4200/')       //if they are promise methods make sure you use await
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test('Locator syntax rules', async({page}) => {
    //by Tag name this like the type of html tag <input > 
    await page.locator('input').first().click()               //nothign infront of input means looking by tag

    //by ID id="inputEmail1"
    await page.locator('#inputEmail1').click()        //# means looking by id

    //by class value class = "value1 value2 value3 shape-rectangle"
    page.locator('.shape-rectangle')    //. means looking by class

    //by attribute
    page.locator('[placeholder="Email"]') //[] means looky by attribute

    //by Class value (full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    //combine different selectors
    page.locator('input[[placeholder="Email"].shape-rectangle') // you just put them next to each other without 

    //by XPath (Not Recommended)
    page.locator('//*[@id="inputEmail1"')

    //by partial text match 
    page.locator(':test("Using")')

    //by exact text match
    page.locator(':text-is("Using the Grid")')
})

//Generally speaking the best practice is to test by user facing Locators
test('User facing locators', async({page}) => {
    await page.getByRole('textbox', {name: "Email"}).first().click()
    await page.getByRole('button', {name: "Sign in"}).first().click()
    await page.getByLabel('Email').first().click()
    await page.getByPlaceholder('Jane Doe').click() //this is a unique element so we don't need to do first
    await page.getByText('Using the Grid').click()
    await page.getByTestId('SignIn').click()       // we need to set the testId though manually in the source code
    await page.getByTitle('IoT Dashboard').click()
})

test('Locating child elements', async({page}) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click() //we are chaing into tags to find a specific element
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click() //same as above just not as compact

    await page.locator('nb-card').getByRole('button', {name: "Sign In"}).first().click() //you can mix these methods together
    await page.locator('nb-card').nth(3).getByRole('button').click() //try to avoid this though 
})

test('Locating using parent elements', async({page}) => {
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click()
    
    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()
    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name: "Email"}).click()

    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click()
})

test('Rusing the locators', async({page}) => {
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const emailField = basicForm.getByRole('textbox', {name: "Email"})

    await emailField.fill('test@test.com')
    await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click()

    await expect(emailField).toHaveValue('test@test.com')
})

test('extracting values', async({page}) => {
    //single text value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual("Submit")

    //all text values
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonsLabels).toContain("Option 1")

    //input value
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual('test@test.com')

    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')
})
/* 
test.describe('test suite 1', () => {

    test('the first test', () => {

    })test('the first test', () => {

    })test('the first test', () => {

    })

})

*/