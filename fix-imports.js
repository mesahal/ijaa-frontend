#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define the import replacements
const replacements = [
  // UnifiedAuthContext to useAuth
  {
    pattern: /import\s*{\s*useUnifiedAuth\s*}\s*from\s*['"]\.\.\/context\/UnifiedAuthContext['"];?/g,
    replacement: "import { useAuth } from '../../hooks/useAuth';"
  },
  {
    pattern: /import\s*{\s*useUnifiedAuth\s*}\s*from\s*['"]\.\.\/\.\.\/context\/UnifiedAuthContext['"];?/g,
    replacement: "import { useAuth } from '../../hooks/useAuth';"
  },
  {
    pattern: /useUnifiedAuth\(\)/g,
    replacement: "useAuth()"
  },
  
  // UI component imports
  {
    pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"]\.\.\/components\/ui['"];?/g,
    replacement: "import { $1 } from '../../components/ui';"
  },
  {
    pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"]\.\.\/\.\.\/components\/ui['"];?/g,
    replacement: "import { $1 } from '../../components/ui';"
  },
  
  // FeatureFlagWrapper imports
  {
    pattern: /import\s*FeatureFlagWrapper\s*from\s*['"]\.\.\/components\/FeatureFlagWrapper['"];?/g,
    replacement: "import FeatureFlagWrapper from '../../components/layout/FeatureFlagWrapper';"
  },
  {
    pattern: /import\s*FeatureFlagWrapper\s*from\s*['"]\.\.\/\.\.\/components\/FeatureFlagWrapper['"];?/g,
    replacement: "import FeatureFlagWrapper from '../../components/layout/FeatureFlagWrapper';"
  },
  
  // API imports
  {
    pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"]\.\.\/utils\/photoApi['"];?/g,
    replacement: "import { $1 } from '../../services/api/photoApi';"
  },
  {
    pattern: /import\s*apiClient\s*from\s*['"]\.\.\/utils\/apiClient['"];?/g,
    replacement: "import apiClient from '../../services/api/apiClient';"
  },
  {
    pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"]\.\.\/utils\/adminApi['"];?/g,
    replacement: "import { $1 } from '../../services/api/adminApi';"
  },
  {
    pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"]\.\.\/utils\/eventApi['"];?/g,
    replacement: "import { $1 } from '../../services/api/eventApi';"
  },
  {
    pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"]\.\.\/utils\/themeApi['"];?/g,
    replacement: "import { $1 } from '../../services/api/themeApi';"
  },
  {
    pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"]\.\.\/utils\/featureFlagApi['"];?/g,
    replacement: "import { $1 } from '../../services/featureFlags/featureFlagApi';"
  },
  
  // Service imports
  {
    pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"]\.\.\/services\/AuthService['"];?/g,
    replacement: "import { $1 } from '../../services/auth/AuthService';"
  },
  {
    pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"]\.\.\/utils\/authHelper['"];?/g,
    replacement: "import { $1 } from '../../utils/auth/authHelper';"
  },
  {
    pattern: /import\s*{\s*([^}]+)\s*}\s*from\s*['"]\.\.\/utils\/roleConstants['"];?/g,
    replacement: "import { $1 } from '../../utils/constants/roleConstants';"
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
console.log('🔧 Starting import path fixes...\n');

const srcPath = path.join(__dirname, 'src');
const totalFixed = processDirectory(srcPath);

console.log(`\n🎉 Import fixing complete! Fixed ${totalFixed} files.`);
