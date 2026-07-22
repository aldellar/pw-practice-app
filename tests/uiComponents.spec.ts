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


test('dialog boxes', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })
    await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click()
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
})

test('web tables', async({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //1 get the row by any test in this row
    const targetRow = page.getByRole('row', {name: "twitter@outlook.com"})
    await targetRow.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('35')
    await page.locator('.nb-checkmark').click()

    //2 get the row based on the value in the specific column
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    const targetRowById = page.getByRole('row', {name: "11"}).filter({has: page.locator('td').nth(1).getByText('11')})
    await targetRowById.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
    await page.locator('.nb-checkmark').click()
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

    //3 test filter of the table

    const ages = ["20", "30", "40", "200"]

    for (let age of ages) {
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500)
        const ageRows = page.locator('tbody tr') // this will give us all the rows inside the table body
        for(let row of await ageRows.all()){
            const cellValue = await row.locator('td').last().textContent()

            if(age == "200"){
                expect(await page.getByRole('table').textContent()).toContain('No data found')
            }else{
                expect(cellValue).toEqual(age)
            }
        }
    }
})
test('Datepicker test', async({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()
    
    let date = new Date()
    date.setDate(date.getDate() + 14)

    const expectedDate = date.getDate().toString()
    const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
    const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`
    while(!calendarMonthAndYear?.includes(expectedMonthAndYear)){
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }
    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()
    await expect(calendarInputField).toHaveValue(dateToAssert)
})
/*test('default', async({page}) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()
})*/