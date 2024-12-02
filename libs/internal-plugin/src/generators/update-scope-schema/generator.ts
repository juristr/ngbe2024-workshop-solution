import {
  formatFiles,
  getProjects,
  ProjectConfiguration,
  Tree,
  updateJson,
} from '@nx/devkit';

function replaceScopes(content: string, scopes: string[]): string {
  const joinScopes = scopes.map((s) => `'${s}'`).join(' | ');
  const PATTERN = /interface UtilLibGeneratorSchema \{\n.*\n.*\n\}/gm;
  return content.replace(
    PATTERN,
    `interface UtilLibGeneratorSchema {
  name: string;
  directory: ${joinScopes};
}`
  );
}

function getScopes(projectMap: Map<string, ProjectConfiguration>) {
  const allScopes: string[] = Array.from(projectMap.values())
    .map((project) => {
      if (project.tags) {
        const scopes = project.tags.filter((tag: string) =>
          tag.startsWith('scope:')
        );
        return scopes;
      }
      return [];
    })
    .reduce((acc, tags) => [...acc, ...tags], [])
    .map((scope: string) => scope.slice(6));

  // remove duplicates
  return Array.from(new Set(allScopes));
}

export async function updateScopeSchemaGenerator(tree: Tree) {
  const allScopes = getScopes(getProjects(tree));

  updateJson(
    tree,
    'libs/internal-plugin/src/generators/util-lib/schema.json',
    (schemaJson) => {
      schemaJson.properties.directory['x-prompt'].items = allScopes.map(
        (scope) => ({
          value: scope,
          label: scope,
        })
      );
      schemaJson.properties.directory['enum'] = allScopes;
      return schemaJson;
    }
  );

  // use the scopes to update the scope array in the util-lib schema.json file
  // updateJson(
  //   tree,
  //   'libs/internal-plugin/src/generators/util-lib/schema.json',
  //   (json) => ({
  //     ...json,
  //     properties: {
  //       ...json.properties,
  //       scopes: {
  //         ...json.properties.scopes,
  //         items: {
  //           type: 'string',
  //           enum: allScopes,
  //         },
  //       },
  //     },
  //   })
  // );

  tree.write(
    'libs/internal-plugin/src/generators/util-lib/schema.d.ts',
    replaceScopes(
      tree.read(
        'libs/internal-plugin/src/generators/util-lib/schema.d.ts',
        'utf-8'
      ),
      allScopes
    )
  );

  await formatFiles(tree);
}

export default updateScopeSchemaGenerator;
