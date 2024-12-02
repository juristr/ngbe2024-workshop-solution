import { test, expect } from '@playwright/test';
import { mockMovieDetails } from './mocks/movie-details.mock';

test.beforeEach(async ({ page }) => {
  // Mock the movie details endpoint
  page.route('/api/movie/12477', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockMovieDetails),
    });
  });
});

test('loads movie details correctly', async ({ page }) => {
  // Navigate to the movie detail page
  page.goto('/movie/12477');

  // Wait for the movie details to be loaded
  page.waitForResponse(
    (response) =>
      response.url().includes('/api/movie/12477') && response.status() === 200
  );

  // Check if the title is displayed correctly
  const title = page.locator('h1');
  await expect(title).toHaveText('Grave of the Fireflies');

  // Check if the overview/description is displayed correctly
  const overview = page.locator('p');
  await expect(overview).toContainText('In the final months of World War II');

  // Check if all genres are displayed
  const genres = page.locator('.movie-detail--genres-link');
  await expect(genres).toHaveCount(3);
});
