import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { utilLibGenerator } from './generator';
import { UtilLibGeneratorSchema } from './schema';

describe('util-lib generator', () => {
  let tree: Tree;
  const options: UtilLibGeneratorSchema = { name: 'test', directory: 'movies' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await utilLibGenerator(tree, options);
  });
});
