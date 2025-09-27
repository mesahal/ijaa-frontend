#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to fix imports in a single file
function fixFileImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix UI component imports
    const uiImports = [
      { pattern: /import\s+(\w+)\s+from\s+['"]\.\.\/ui\/(\w+)['"];?/g, replacement: "import $1 from '../../../components/ui/$2';" },
      { pattern: /import\s+{\s*([^}]+)\s*}\s+from\s+['"]\.\.\/ui\/(\w+)['"];?/g, replacement: "import { $1 } from '../../../components/ui/$2';" },
      { pattern: /import\s+(\w+)\s+from\s+['"]\.\.\/\.\.\/ui\/(\w+)['"];?/g, replacement: "import $1 from '../../../components/ui/$2';" },
      { pattern: /import\s+{\s*([^}]+)\s*}\s+from\s+['"]\.\.\/\.\.\/ui\/(\w+)['"];?/g, replacement: "import { $1 } from '../../../components/ui/$2';" }
    ];
    
    // Fix hook imports
    const hookImports = [
      { pattern: /import\s+{\s*useAuth\s*}\s+from\s+['"]\.\.\/\.\.\/hooks\/useAuth['"];?/g, replacement: "import { useAuth } from '../../../hooks/useAuth';" },
      { pattern: /import\s+{\s*useFeatureFlag\s*}\s+from\s+['"]\.\.\/\.\.\/hooks\/useFeatureFlag['"];?/g, replacement: "import { useFeatureFlag } from '../../../hooks/useFeatureFlag';" }
    ];
    
    // Fix API imports
    const apiImports = [
      { pattern: /import\s+{\s*([^}]+)\s*}\s+from\s+['"]\.\.\/\.\.\/utils\/([^'"]+)['"];?/g, replacement: "import { $1 } from '../../../utils/$2';" },
      { pattern: /import\s+{\s*([^}]+)\s*}\s+from\s+['"]\.\.\/\.\.\/services\/api\/([^'"]+)['"];?/g, replacement: "import { $1 } from '../../../services/api/$2';" }
    ];
    
    const allImports = [...uiImports, ...hookImports, ...apiImports];
    
    allImports.forEach(({ pattern, replacement }) => {
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

// Process all files in the events directory
const eventsDir = path.join(__dirname, 'src/user/components/events');
const files = fs.readdirSync(eventsDir);

let totalFixed = 0;
files.forEach(file => {
  if (file.endsWith('.jsx') || file.endsWith('.js')) {
    const filePath = path.join(eventsDir, file);
    if (fixFileImports(filePath)) {
      totalFixed++;
    }
  }
});

console.log(`\n🎉 Events import fixing complete! Fixed ${totalFixed} files.`);
