import { test, expect } from '@playwright/test';
import { mockMovieSearchResults } from './mocks/movie-search.mock';

test.beforeEach(async ({ page }) => {
  // Mock the movie search endpoint
  page.route('/api/search/movie?query=wicked', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockMovieSearchResults),
    });
  });
});

test('searches for movies and displays results', async ({ page }) => {
  // Navigate to the search page with query
  page.goto('/search/wicked');

  // Wait for the search results to be loaded
  page.waitForResponse(
    (response) =>
      response.url().includes('/api/search/movie?query=wicked') &&
      response.status() === 200
  );

  // Check if the movie is displayed
  const movieTitle = page.getByText('Wicked').first();
  await expect(movieTitle).toBeVisible();

  // Verify no "no results" message is shown
  const noResultsMessage = page.getByText(
    'These are not the droids you are looking for'
  );
  await expect(noResultsMessage).toBeHidden();
});

test('shows "no results" message when search returns empty', async ({
  page,
}) => {
  // Override the mock for this specific test to return empty results
  page.route('/api/search/movie?query=nonexistent', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });

  // Navigate to the search page with a query that will return no results
  page.goto('/search/nonexistent');

  // Wait for the search results to be loaded
  page.waitForResponse(
    (response) =>
      response.url().includes('/api/search/movie?query=nonexistent') &&
      response.status() === 200
  );

  // Verify the "no results" message is shown
  const noResultsMessage = page.getByText(
    'These are not the droids you are looking for'
  );
  await expect(noResultsMessage).toBeVisible();
});
