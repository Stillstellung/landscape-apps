import { test, expect } from '@playwright/test';
import shipManifest from './shipManifest.json';

// mardev is the owner of the group
// patbud is the invited ship

const ownerUrl = `${shipManifest['~naldeg-mardev'].webUrl}/apps/groups/`;
const invitedUrl = `${shipManifest['~habduc-patbud'].webUrl}/apps/groups/`;
const groupOwner = 'mardev';
const invitedShip = 'patbud';

test('Create a group', async ({ browser }) => {
  test.skip(process.env.APP === 'chat', 'skip on talk');

  // Authenticate as mardev
  const ownerContext = await browser.newContext({
    storageState: shipManifest['~naldeg-mardev'].authFile,
  });
  const page = await ownerContext.newPage();
  await page.goto(ownerUrl);
  await page.getByRole('link', { name: 'Create Group' }).waitFor();
  await page.getByRole('link', { name: 'Create Group' }).click();
  await page.getByPlaceholder('e.g. Urbit Fan Club').click();
  await page.getByPlaceholder('e.g. Urbit Fan Club').fill('mardev Club');
  await page.locator('textarea[name="description"]').click();
  await page.locator('textarea[name="description"]').fill('Get in.');
  await page.getByRole('button', { name: 'Next: Privacy' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Create Group' }).click();
  await page.getByRole('heading', { name: 'or drag a Channel here' }).waitFor();
});

test('Create a chat channel', async ({ browser }) => {
  test.skip(process.env.APP === 'chat', 'skip on talk');

  // Authenticate as mardev
  const ownerContext = await browser.newContext({
    storageState: shipManifest['~naldeg-mardev'].authFile,
  });
  const page = await ownerContext.newPage();
  await page.goto(ownerUrl);
  await page.getByRole('link', { name: 'mardev Club' }).waitFor();
  await page.getByRole('link', { name: 'mardev Club' }).click();
  await page.getByRole('heading', { name: 'or drag a Channel here' }).waitFor();
  await page.getByRole('link', { name: 'New Channel' }).nth(1).click();
  await page
    .locator('label')
    .filter({ hasText: 'ChatA simple, standard text chat' })
    .click();
  await page.getByLabel('Channel Name*').click();
  await page.getByLabel('Channel Name*').fill('mardev chat');
  await page.getByLabel('Channel Description').click();
  await page.getByLabel('Channel Description').fill('the bus is coming');
  await page.getByRole('button', { name: 'Add Channel' }).click();
  await page.getByRole('link', { name: 'mardev chat' }).waitFor();
  await page.getByRole('link', { name: 'mardev chat' }).click();
  await page.getByLabel('Send message').waitFor();
  await page.locator('.ProseMirror').click();
  await page.locator('.ProseMirror').fill("hi, it's me, ~naldeg-mardev");
  // first enter is for the mention
  await page.locator('.ProseMirror').press('Enter');
  await page.locator('.ProseMirror').press('Enter');
  await expect(page.getByText("hi, it's me, ~naldeg-mardev")).toBeVisible();
});

test('Create a notebook channel and post to it.', async ({ browser }) => {
  test.skip(process.env.APP === 'chat', 'skip on talk');

  // Authenticate as owner
  const ownerContext = await browser.newContext({
    storageState: shipManifest['~naldeg-mardev'].authFile,
  });
  const page = await ownerContext.newPage();
  await page.goto(ownerUrl);
  await page.getByRole('link', { name: 'mardev Club' }).waitFor();
  await page.getByRole('link', { name: 'mardev Club' }).click();
  await page.getByRole('link', { name: 'All Channels' }).click();
  await page.getByRole('link', { name: 'New Channel' }).click();
  await page
    .locator('label')
    .filter({ hasText: 'NotebookLongform publishing and discussion' })
    .click();
  await page.getByLabel('Channel Name*').click();
  await page.getByLabel('Channel Name*').fill('mardev notes');
  await page.getByLabel('Channel Description').click();
  await page.getByLabel('Channel Description').fill('news from the bus');
  await page.getByRole('button', { name: 'Add Channel' }).click();
  await page.getByRole('link', { name: 'mardev notes' }).waitFor();
  await page.getByRole('link', { name: 'mardev notes' }).click();
  await page.getByRole('link', { name: 'Add Note' }).waitFor();
  await page.getByRole('link', { name: 'Add Note' }).click();
  await page.getByPlaceholder('New Title').click();
  await page.getByPlaceholder('New Title').fill('A bus note');
  await page.getByRole('paragraph').click();
  await page.locator('.ProseMirror').fill('With some bus content.');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(
    page.getByRole('link').filter({ hasText: 'A bus note' })
  ).toBeVisible();
});

test('Invite to a group', async ({ browser }) => {
  test.skip(process.env.APP === 'chat', 'skip on talk');

  // Authenticate as owner
  const ownerContext = await browser.newContext({
    storageState: shipManifest['~naldeg-mardev'].authFile,
  });
  const page = await ownerContext.newPage();
  await page.goto(ownerUrl);
  await page.getByRole('link', { name: 'mardev Club' }).waitFor();
  await page.getByRole('link', { name: 'mardev Club' }).click();
  await page.getByRole('link', { name: 'Invite People' }).waitFor();
  await page.getByRole('link', { name: 'Invite People' }).click();
  await page.getByLabel('Ships').click({ force: true });
  await page.getByRole('combobox', { name: 'Ships' }).fill('~habduc-patbud');
  await page.getByText('~habduc-patbud', { exact: true }).click();
  await page.getByRole('button', { name: 'Send Invites' }).click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.getByRole('button', { name: 'mardev Club' }).click();
  await page.getByRole('menuitem', { name: 'Group Settings' }).click();
  await page.getByRole('link', { name: 'Members' }).click();
  await page
    .getByRole('region', { name: 'Members' })
    .getByText('habduc-patbud')
    .waitFor();
});

test('Accept group invite', async ({ browser }) => {
  test.skip(process.env.APP === 'chat', 'skip on talk');

  // Authenticate as habduc-patbud
  const invitedContext = await browser.newContext({
    storageState: shipManifest['~habduc-patbud'].authFile,
  });
  const page = await invitedContext.newPage();
  await page.goto(invitedUrl);
  await page
    .getByTestId('group-invite')
    .filter({ hasText: 'mardev Club' })
    .waitFor();
  const groupInvite = page
    .getByTestId('group-invite')
    .filter({ hasText: 'mardev Club' });
  await groupInvite.getByRole('button', { name: 'Accept' }).first().click();
  await page.getByText('Join This Group').waitFor();
  await page.getByRole('button', { name: 'Join Group' }).first().click();
  await page.getByText('mardev chat').first().waitFor();
  await page.getByText('mardev chat').first().click();
  await page.getByText("hi, it's me, ~naldeg-mardev").waitFor();
});
