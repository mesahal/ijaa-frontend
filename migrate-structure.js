#!/usr/bin/env node

/**
 * IJAA Frontend Structure Migration Script
 * 
 * This script helps migrate the current project structure to the new modular architecture.
 * Run with: node migrate-structure.js
 */

const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Logging functions
const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const logStep = (step, message) => {
  log(`\n${step}. ${message}`, 'cyan');
};

const logSuccess = (message) => {
  log(`✅ ${message}`, 'green');
};

const logError = (message) => {
  log(`❌ ${message}`, 'red');
};

const logWarning = (message) => {
  log(`⚠️  ${message}`, 'yellow');
};

// File mapping for migration
const fileMappings = {
  // Admin pages
  'src/pages/AdminDashboard.jsx': 'src/admin/pages/AdminDashboard.jsx',
  'src/pages/AdminUsers.jsx': 'src/admin/pages/AdminUsers.jsx',
  'src/pages/AdminFeatureFlags.jsx': 'src/admin/pages/AdminFeatureFlags.jsx',
  'src/pages/AdminSettings.jsx': 'src/admin/pages/AdminSettings.jsx',
  'src/pages/AdminManagement.jsx': 'src/admin/pages/AdminManagement.jsx',
  'src/pages/AdminLogin.jsx': 'src/admin/pages/AdminLogin.jsx',

  // User pages
  'src/pages/Dashboard.jsx': 'src/user/pages/Dashboard.jsx',
  'src/pages/Profile.jsx': 'src/user/pages/Profile.jsx',
  'src/pages/ViewProfile.jsx': 'src/user/pages/ViewProfile.jsx',
  'src/pages/Search.jsx': 'src/user/pages/Search.jsx',
  'src/pages/Events.jsx': 'src/user/pages/Events.jsx',
  'src/pages/EventDetail.jsx': 'src/user/pages/EventDetail.jsx',
  'src/pages/CreateEvent.jsx': 'src/user/pages/CreateEvent.jsx',
  'src/pages/Notifications.jsx': 'src/user/pages/Notifications.jsx',
  'src/pages/SignIn.jsx': 'src/user/pages/SignIn.jsx',
  'src/pages/SignUp.jsx': 'src/user/pages/SignUp.jsx',
  'src/pages/ForgotPassword.jsx': 'src/user/pages/ForgotPassword.jsx',
  'src/pages/ResetPassword.jsx': 'src/user/pages/ResetPassword.jsx',
  'src/pages/LandingPage.jsx': 'src/user/pages/LandingPage.jsx',
  'src/pages/ContactSupport.jsx': 'src/user/pages/ContactSupport.jsx',
  'src/pages/TermsAndConditions.jsx': 'src/user/pages/TermsAndConditions.jsx',
  'src/pages/PrivacyPolicy.jsx': 'src/user/pages/PrivacyPolicy.jsx',
  'src/pages/Maintenance.jsx': 'src/user/pages/Maintenance.jsx',
  'src/pages/NotFound.jsx': 'src/user/pages/NotFound.jsx',

  // Admin components
  'src/components/AdminLayout.jsx': 'src/admin/components/AdminLayout.jsx',
  'src/components/AdminNavbar.jsx': 'src/admin/components/AdminNavbar.jsx',
  'src/components/AdminSidebar.jsx': 'src/admin/components/AdminSidebar.jsx',

  // User components
  'src/components/UserCard.jsx': 'src/user/components/UserCard.jsx',
  'src/components/PhotoManager.jsx': 'src/user/components/PhotoManager.jsx',

  // Shared components
  'src/components/ProtectedRoute.jsx': 'src/components/layout/ProtectedRoute.jsx',
  'src/components/AdminRoute.jsx': 'src/components/layout/AdminRoute.jsx',
  'src/components/FeatureFlagWrapper.jsx': 'src/components/layout/FeatureFlagWrapper.jsx',
  'src/components/Navbar.jsx': 'src/components/layout/Navbar.jsx',
  'src/components/RoleBadge.jsx': 'src/components/common/RoleBadge.jsx',
  'src/components/ThemeSelector.jsx': 'src/components/common/ThemeSelector.jsx',
  'src/components/ThemeSettingsCard.jsx': 'src/components/common/ThemeSettingsCard.jsx',

  // UI components
  'src/components/ui/Button.jsx': 'src/components/ui/Button.jsx',
  'src/components/ui/Input.jsx': 'src/components/ui/Input.jsx',
  'src/components/ui/Card.jsx': 'src/components/ui/Card.jsx',
  'src/components/ui/Avatar.jsx': 'src/components/ui/Avatar.jsx',
  'src/components/ui/Badge.jsx': 'src/components/ui/Badge.jsx',
  'src/components/ui/Pagination.jsx': 'src/components/ui/Pagination.jsx',

  // Services
  'src/services/AuthService.js': 'src/services/auth/AuthService.js',
  'src/services/TokenManager.js': 'src/services/auth/TokenManager.js',
  'src/services/eventService.js': 'src/services/api/eventService.js',

  // Utils
  'src/utils/roleConstants.js': 'src/utils/constants/roleConstants.js',
  'src/utils/axiosInstance.js': 'src/utils/api/axiosInstance.js',
  'src/utils/authHelper.js': 'src/utils/auth/authHelper.js',
  'src/utils/tokenDebugUtils.js': 'src/utils/auth/tokenDebugUtils.js',
  'src/utils/sessionManager.js': 'src/services/auth/SessionManager.js'
};

// Directory structure to create
const directories = [
  'src/admin/components',
  'src/admin/pages',
  'src/admin/hooks',
  'src/admin/routes',
  'src/user/components',
  'src/user/pages',
  'src/user/hooks',
  'src/user/routes',
  'src/components/layout',
  'src/components/forms',
  'src/components/common',
  'src/services/auth',
  'src/services/api',
  'src/services/featureFlags',
  'src/routes',
  'src/utils/auth',
  'src/utils/api',
  'src/utils/constants',
  'src/utils/common'
];

// Files to create
const newFiles = {
  'src/components/layout/LoadingSpinner.jsx': `import React from 'react';

/**
 * Loading Spinner Component
 * Reusable loading spinner for the application
 */
const LoadingSpinner = ({ size = 'large', className = '' }) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
    xlarge: 'h-16 w-16'
  };

  return (
    <div className={\`min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center \${className}\`}>
      <div className="text-center">
        <div className={\`animate-spin rounded-full border-b-2 border-primary-600 mx-auto mb-4 \${sizeClasses[size]}\`}></div>
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;`,
  
  'src/hooks/useAuth.js': `import { useAuth as useAuthContext } from '../context/AuthContext';

/**
 * Main Authentication Hook
 * Provides access to authentication state and methods
 */
export const useAuth = () => {
  return useAuthContext();
};

export default useAuth;`
};

// Import mapping for updated files
const importMappings = {
  // Context imports
  "from '../context/UnifiedAuthContext'": "from '../context/AuthContext'",
  "from './context/UnifiedAuthContext'": "from './context/AuthContext'",
  "useUnifiedAuth": "useAuth",
  "UnifiedAuthProvider": "AuthProvider",

  // Service imports
  "from '../services/AuthService'": "from '../services/auth/AuthService'",
  "from './services/AuthService'": "from './services/auth/AuthService'",
  "from '../services/TokenManager'": "from '../services/auth/TokenManager'",
  "from './services/TokenManager'": "from './services/auth/TokenManager'",
  "from '../utils/sessionManager'": "from '../services/auth/SessionManager'",
  "from './utils/sessionManager'": "from './services/auth/SessionManager'",

  // Component imports
  "from '../components/ProtectedRoute'": "from '../components/layout/ProtectedRoute'",
  "from './components/ProtectedRoute'": "from './components/layout/ProtectedRoute'",
  "from '../components/AdminRoute'": "from '../components/layout/AdminRoute'",
  "from './components/AdminRoute'": "from './components/layout/AdminRoute'",
  "from '../components/FeatureFlagWrapper'": "from '../components/layout/FeatureFlagWrapper'",
  "from './components/FeatureFlagWrapper'": "from './components/layout/FeatureFlagWrapper'",

  // Utils imports
  "from '../utils/roleConstants'": "from '../utils/constants/roleConstants'",
  "from './utils/roleConstants'": "from './utils/constants/roleConstants'",
  "from '../utils/axiosInstance'": "from '../utils/api/axiosInstance'",
  "from './utils/axiosInstance'": "from './utils/api/axiosInstance'"
};

// Main migration function
async function migrateStructure() {
  log('🚀 Starting IJAA Frontend Structure Migration', 'bright');
  log('===============================================', 'bright');

  try {
    // Step 1: Create directories
    logStep(1, 'Creating new directory structure');
    for (const dir of directories) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        logSuccess(`Created directory: ${dir}`);
      } else {
        logWarning(`Directory already exists: ${dir}`);
      }
    }

    // Step 2: Move files
    logStep(2, 'Moving files to new structure');
    for (const [oldPath, newPath] of Object.entries(fileMappings)) {
      if (fs.existsSync(oldPath)) {
        // Ensure destination directory exists
        const destDir = path.dirname(newPath);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }

        // Move file
        fs.renameSync(oldPath, newPath);
        logSuccess(`Moved: ${oldPath} → ${newPath}`);
      } else {
        logWarning(`File not found: ${oldPath}`);
      }
    }

    // Step 3: Create new files
    logStep(3, 'Creating new files');
    for (const [filePath, content] of Object.entries(newFiles)) {
      // Ensure directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(filePath, content);
      logSuccess(`Created: ${filePath}`);
    }

    // Step 4: Update imports in moved files
    logStep(4, 'Updating imports in moved files');
    for (const [oldPath, newPath] of Object.entries(fileMappings)) {
      if (fs.existsSync(newPath)) {
        let content = fs.readFileSync(newPath, 'utf8');
        let updated = false;

        // Update imports
        for (const [oldImport, newImport] of Object.entries(importMappings)) {
          if (content.includes(oldImport)) {
            content = content.replace(new RegExp(oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newImport);
            updated = true;
          }
        }

        if (updated) {
          fs.writeFileSync(newPath, content);
          logSuccess(`Updated imports in: ${newPath}`);
        }
      }
    }

    // Step 5: Create backup of original App.jsx
    logStep(5, 'Creating backup of original App.jsx');
    if (fs.existsSync('src/App.jsx')) {
      fs.copyFileSync('src/App.jsx', 'src/App.backup.jsx');
      logSuccess('Created backup: src/App.backup.jsx');
    }

    // Step 6: Replace App.jsx with new version
    logStep(6, 'Updating App.jsx');
    if (fs.existsSync('src/App.new.jsx')) {
      fs.renameSync('src/App.new.jsx', 'src/App.jsx');
      logSuccess('Updated App.jsx with new structure');
    }

    // Step 7: Create migration summary
    logStep(7, 'Creating migration summary');
    const summary = {
      timestamp: new Date().toISOString(),
      directoriesCreated: directories.length,
      filesMoved: Object.keys(fileMappings).length,
      newFilesCreated: Object.keys(newFiles).length,
      status: 'completed'
    };

    fs.writeFileSync('migration-summary.json', JSON.stringify(summary, null, 2));
    logSuccess('Created migration summary: migration-summary.json');

    log('\n🎉 Migration completed successfully!', 'green');
    log('===============================================', 'green');
    log('\nNext steps:', 'yellow');
    log('1. Review the migrated files and update any remaining imports', 'reset');
    log('2. Update test files to reflect new structure', 'reset');
    log('3. Run tests to ensure everything works correctly', 'reset');
    log('4. Update any documentation that references old file paths', 'reset');
    log('5. Remove the backup file (src/App.backup.jsx) when satisfied', 'reset');

  } catch (error) {
    logError(`Migration failed: ${error.message}`);
    process.exit(1);
  }
}

// Run migration
if (require.main === module) {
  migrateStructure();
}

module.exports = { migrateStructure, fileMappings, directories, newFiles };
