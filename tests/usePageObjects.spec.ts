import {test, expect} from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
})

test('navigate to form page', async({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datePickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test('parametrized methods', async({page})=> {
    const pm = new PageManager(page)

    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption('test@test.com', 'Welcome', 'Option 2')
    await pm.onFormLayoutsPage().submitInLineFormWithNameEmailAndCheckbox('Andrew Dellaringa', 'dellaringa@ibm.com', true)
    await pm.navigateTo().datePickerPage()
    await pm.onDatepickerPage().selecctCommonDatePickerDateFromToday(20)
    await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(6,15)


})