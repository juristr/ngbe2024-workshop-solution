import { ExecutorContext } from '@nx/devkit';

import { FlyDeployExecutorSchema } from './schema';
import executor from './executor';

const options: FlyDeployExecutorSchema = {
  distLocation: 'dist/test',
  flyAppName: 'test-app',
};
const context: ExecutorContext = {
  root: '',
  cwd: process.cwd(),
  isVerbose: false,
  projectGraph: {
    nodes: {},
    dependencies: {},
  },
  projectsConfigurations: {
    projects: {},
    version: 2,
  },
  nxJsonConfiguration: {},
};

describe('FlyDeploy Executor', () => {
  it('can run', async () => {
    expect(true).toBe(true);
  });
});
