const fs = require('fs');
const path = require('path');
const glob = require('glob');

function findProjectJsonFiles() {
  return glob.sync('**/project.json', {
    ignore: ['**/node_modules/**']
  });
}

function extractTags(projectPath) {
  try {
    const content = fs.readFileSync(projectPath, 'utf8');
    const projectConfig = JSON.parse(content);
    const tags = projectConfig.tags || [];
    
    return {
      path: projectPath,
      tags
    };
  } catch (error) {
    console.error(`Error processing ${projectPath}:`, error.message);
    return {
      path: projectPath,
      tags: []
    };
  }
}

function listProjectTags() {
  const projectFiles = findProjectJsonFiles();
  const results = projectFiles.map(extractTags);
  
  // Get all unique tags
  const allTags = new Set();
  results.forEach(({ tags }) => {
    tags.forEach(tag => allTags.add(tag));
  });
  
  // Convert to sorted array and output
  const sortedTags = Array.from(allTags).sort();
  console.log('\nAll unique tags:\n');
  console.log(sortedTags.join('\n'));
  console.log('\n');
}

listProjectTags(); 