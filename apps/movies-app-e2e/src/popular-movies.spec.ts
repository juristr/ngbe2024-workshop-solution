import { test, expect } from '@playwright/test';
import { mockPopularMovies } from './mocks/popular-movies.mock';

test.beforeEach(async ({ page }) => {
  // Mock the /api/movies/popular endpoint
  page.route('/api/movies/popular', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockPopularMovies),
    });
  });
});

test('loads popular movies', async ({ page }) => {
  page.goto('/list/popular');

  // Wait for the movies to be loaded and displayed
  page.waitForResponse(
    (response) =>
      response.url().includes('/api/movies/popular') &&
      response.status() === 200
  );

  // Verify that the first movie is displayed
  const firstMovie = page.getByText('Despicable Me 4').first();
  await expect(firstMovie).toBeVisible();
});
