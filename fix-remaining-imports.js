#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define the remaining import replacements
const replacements = [
  // Events components UI imports
  {
    pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"]\.\.\/ui\/([^'"]+)['"];?/g,
    replacement: "import { $1 } from '../../../components/ui/$2';"
  },
  {
    pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"]\.\.\/\.\.\/ui\/([^'"]+)['"];?/g,
    replacement: "import { $1 } from '../../../components/ui/$2';"
  },
  
  // Event API imports
  {
    pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"]\.\.\/\.\.\/utils\/eventApi['"];?/g,
    replacement: "import { $1 } from '../../../services/api/eventApi';"
  },
  {
    pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"]\.\.\/\.\.\/utils\/eventService['"];?/g,
    replacement: "import { $1 } from '../../../services/api/eventService';"
  },
  
  // AuthService import in adminApi
  {
    pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"]\.\.\/services\/AuthService['"];?/g,
    replacement: "import { $1 } from '../auth/AuthService';"
  },
  
  // Other common patterns
  {
    pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"]\.\.\/utils\/([^'"]+)['"];?/g,
    replacement: "import { $1 } from '../../../utils/$2';"
  },
  {
    pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"]\.\.\/\.\.\/utils\/([^'"]+)['"];?/g,
    replacement: "import { $1 } from '../../../utils/$2';"
  }
];

// Function to process a file
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    replacements.forEach(({ pattern, replacement }) => {
      const newContent = content.replace(pattern, replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed imports in: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Function to recursively process directories
function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  let totalFixed = 0;
  
  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      totalFixed += processDirectory(fullPath);
    } else if (stat.isFile() && (item.endsWith('.js') || item.endsWith('.jsx'))) {
      if (processFile(fullPath)) {
        totalFixed++;
      }
    }
  });
  
  return totalFixed;
}

// Main execution
console.log('🔧 Starting remaining import path fixes...\n');

const srcPath = path.join(__dirname, 'src');
const totalFixed = processDirectory(srcPath);

console.log(`\n🎉 Remaining import fixing complete! Fixed ${totalFixed} files.`);
