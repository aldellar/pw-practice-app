import {test, expect} from '@playwright/test'
import { using } from 'rxjs'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
})


test.describe('From Layouts page', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })
    
    test('input fields', async({page}) => {
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})

        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test2@test.com', {delay: 50})

        //generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@test.com')

        //locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')
    })
    test('radio buttons', async({page}) => {
        const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"})

       // await usingTheGridForm.getByLabel('Option 1').check({force: true})
        await usingTheGridForm.getByRole('radio', {name: "Option 1"}).check({force: true})      //find it using force here if it is hidden
        const radioSatus = await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()    //boolean that it is checked generic assertion
        expect(radioSatus).toBeTruthy() //verify that it is check
        await expect(usingTheGridForm.getByRole('radio', {name: "Option 1"})).toBeChecked() //another way to check locator assertion

        await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true})
        expect(await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy()
        expect(await usingTheGridForm.getByRole('radio', {name: "Option 2"}).isChecked()).toBeTruthy()
    })
})


test('checkboxes', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()
    //click does not care if selected or not it will just click it check uncheck will only do that and wont do the oposite
    await page.getByRole('checkbox', {name: "Hide on click"}).uncheck({force: true})
    await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).check({force: true})

    //select unselect ALL checkboxes on the page
    const allBoxes = page.getByRole('checkbox')
    for(const box of await allBoxes.all()){ //.all() will create an array of all the boxes
        await box.uncheck({force: true})
        expect(await box.isChecked()).toBeFalsy();
    }
})


/* this doesn't really work "test('lsits and dropdowns', async({page}) => {
    const dropDownMenu = page.locator('ngx-header nb-select')
    await dropDownMenu.click()

    page.getByRole('list')  //when the list has an ul tag
    page.getByRole('listitem')  //when the list has a li tag

    // const optionList = page.getByRole('list').locator('nb-option') // we need to do this because the list items dont have li tag
    const optionList = page.locator('nb-option-list nb-option')

    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])

    await optionList.filter({hasText: "Cosmic"}).click()
    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    const colors: Record<string, string> = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50,50,89)",
        "Corporate": "rgb(255, 255, 255)"
    }

    await dropDownMenu.click()
    for(const color in colors){
        await optionList.filter({hasText: color}).click()//this is taking the key value and click them
        await expect(header).toHaveCSS('background-color', colors[color])
    }
})*/

test('tooltips', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const toolTipCard = page.locator('nb-card', {hasText: "Tooltip placements"})
    await toolTipCard.getByRole('button', {name: "Top"}).hover()

    page.getByRole('tooltip') //if you have a role tooltip created in your webpage
    const tooltip = await page.locator('nb-tooltip').textContent()
    expect(tooltip).toEqual('This is a tooltip')

})