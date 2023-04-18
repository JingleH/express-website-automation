import { test, expect } from '@playwright/test';

const baseUrl = 'https://www.adobe.com/express';
const getLocaleUrl = (locale) => `https://adobe.com/${locale}/express`;
test('homepage navigates to /templates', async ({ page }) => {
  await page.goto(baseUrl);
  await expect(page).toHaveTitle(/Adobe Express/);
  const linksToTemplates = page.getByRole('listitem').getByRole('link', { name: 'Templates' });

  await linksToTemplates.nth(0).click();
  await expect(page).toHaveURL(/templates/);
});

test('prepared search landed in a real page', async ({ page }) => {
  await page.goto(`${baseUrl}/templates`);
  await expect(page).toHaveTitle(/Free Templates \| Adobe Express/);
  await page.getByPlaceholder('Search for over 50,000 templates').nth(0).fill('christmas flyer');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(`${baseUrl}/templates/flyer/christmas`);
});

test('non-prepared search landed in a search page', async ({ page }) => {
  await page.goto(`${baseUrl}/templates`);
  await expect(page).toHaveTitle(/Free Templates \| Adobe Express/);
  await page.getByPlaceholder('Search for over 50,000 templates').nth(0).fill('hello world');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(new RegExp(`${baseUrl}/templates/search`));
});

const localeInfo = {
  br: {
    title: 'Modelos gratuitos | Adobe Express',
    searchPlaceholder: 'Explore mais de 50.000 modelos',
    found: 'modelos de flyers de Natal.',
    notfound: 'modelos encontrados.',
  },
  fr: {
    title: 'Modèles gratuits | Adobe Express',
    searchPlaceholder: 'Recherchez parmi plus de 50 000 modèles',
    found: 'modèles de flyers de Noël.',
    notfound: 'modèles trouvés',
  },
};
for (let locale of Object.keys(localeInfo)) {
  test(`prepared search landed in a real page ${locale}`, async ({ page }) => {
    await page.goto(`${getLocaleUrl(locale)}/templates`);
    await expect(page).toHaveTitle(localeInfo[locale].title);
    await page.getByPlaceholder(localeInfo[locale].searchPlaceholder).nth(0).fill('christmas flyer');
    await page.keyboard.press('Enter');
    await expect(page.getByText(localeInfo[locale].found)).toBeVisible();
    
  });
  test(`non-prepared search landed in a search page ${locale}`, async ({ page }) => {
    await page.goto(`${getLocaleUrl(locale)}/templates`);
    await page.getByPlaceholder(localeInfo[locale].searchPlaceholder).nth(0).fill('hello world');
    await page.keyboard.press('Enter');
    await expect(page.getByText(localeInfo[locale].notfound)).toBeVisible();
  });
}
