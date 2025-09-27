/**
 * @jest-environment jsdom
 */

import fs from 'fs';
import path from 'path';

describe('Build System Integrity', () => {
  const srcDir = path.join(process.cwd(), 'src');
  
  test('should not have references to non-existent useNavbarState hook', () => {
    const searchForMissingHook = (dir) => {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const file of files) {
        const fullPath = path.join(dir, file.name);
        
        if (file.isDirectory()) {
          searchForMissingHook(fullPath);
        } else if (file.name.endsWith('.js') || file.name.endsWith('.jsx') || file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
          // Skip test files
          if (fullPath.includes('__tests__') || fullPath.includes('.test.') || fullPath.includes('.spec.')) {
            continue;
          }
          
          const content = fs.readFileSync(fullPath, 'utf8');
          
          // Check for references to missing components
          const missingReferences = [
            'useNavbarState',
            'NavbarContainer',
            'NavbarSkeleton',
            'NavbarErrorBoundary'
          ];
          
          missingReferences.forEach(ref => {
            if (content.includes(ref)) {
              throw new Error(`File ${fullPath} contains reference to missing component: ${ref}`);
            }
          });
        }
      }
    };
    
    expect(() => searchForMissingHook(srcDir)).not.toThrow();
  });
  
  test('should have all required navbar components', () => {
    const requiredComponents = [
      'src/components/Navbar.jsx',
      'src/components/AdminNavbar.jsx',
      'src/components/AdminLayout.jsx'
    ];
    
    requiredComponents.forEach(componentPath => {
      expect(fs.existsSync(componentPath)).toBe(true);
    });
  });
  
  test('should have all required context providers', () => {
    const requiredContexts = [
      'src/context/UnifiedAuthContext.jsx',
      'src/context/ThemeContext.jsx'
    ];
    
    requiredContexts.forEach(contextPath => {
      expect(fs.existsSync(contextPath)).toBe(true);
    });
  });
  
  test('should not have orphaned import statements', () => {
    const checkOrphanedImports = (dir) => {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const file of files) {
        const fullPath = path.join(dir, file.name);
        
        if (file.isDirectory()) {
          checkOrphanedImports(fullPath);
        } else if (file.name.endsWith('.js') || file.name.endsWith('.jsx')) {
          // Skip test files
          if (fullPath.includes('__tests__') || fullPath.includes('.test.') || fullPath.includes('.spec.')) {
            continue;
          }
          
          const content = fs.readFileSync(fullPath, 'utf8');
          
          // Check for import statements that might reference missing files
          const importRegex = /import\s+.*\s+from\s+['"]([^'"]+)['"]/g;
          let match;
          
          while ((match = importRegex.exec(content)) !== null) {
            const importPath = match[1];
            
            // Skip node_modules imports
            if (importPath.startsWith('.') || importPath.startsWith('/')) {
              const resolvedPath = path.resolve(path.dirname(fullPath), importPath);
              
              // Check if the imported file exists
              const possibleExtensions = ['.js', '.jsx', '.ts', '.tsx', '/index.js', '/index.jsx'];
              const fileExists = possibleExtensions.some(ext => {
                const testPath = resolvedPath + ext;
                return fs.existsSync(testPath);
              });
              
              // Also check if the path itself exists (for files with extensions)
              if (!fileExists && !fs.existsSync(resolvedPath)) {
                // Additional check: try without extension
                const withoutExt = resolvedPath.replace(/\.(js|jsx|ts|tsx)$/, '');
                const withoutExtExists = possibleExtensions.some(ext => {
                  const testPath = withoutExt + ext;
                  return fs.existsSync(testPath);
                });
                
                if (!withoutExtExists) {
                  throw new Error(`File ${fullPath} imports non-existent file: ${importPath}`);
                }
              }
            }
          }
        }
      }
    };
    
    expect(() => checkOrphanedImports(srcDir)).not.toThrow();
  });

  test('should have proper App.jsx structure', () => {
    const appPath = 'src/App.jsx';
    expect(fs.existsSync(appPath)).toBe(true);
    
    const content = fs.readFileSync(appPath, 'utf8');
    
    // Check for required imports
    expect(content).toContain('import Navbar from "./components/Navbar"');
    expect(content).toContain('import { UnifiedAuthProvider, useUnifiedAuth } from "./context/UnifiedAuthContext"');
    
    // Check for navbar logic
    expect(content).toContain('{user && !admin && !location.pathname.startsWith(\'/admin\') && <Navbar />}');
  });
});
