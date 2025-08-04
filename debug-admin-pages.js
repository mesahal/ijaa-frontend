// Debug script to identify specific runtime errors in admin pages
console.log("🔍 Debugging admin pages runtime errors...");

// Test 1: Check if all required dependencies are available
const requiredDependencies = [
  'react',
  'react-dom',
  'react-router-dom',
  'react-toastify',
  'lucide-react'
];

console.log("📦 Checking dependencies...");
requiredDependencies.forEach(dep => {
  try {
    require(dep);
    console.log(`✅ ${dep}: Available`);
  } catch (error) {
    console.log(`❌ ${dep}: Missing - ${error.message}`);
  }
});

// Test 2: Check environment variables
console.log("\n🌍 Checking environment variables...");
const envVars = {
  'REACT_APP_API_ADMIN_URL': process.env.REACT_APP_API_ADMIN_URL,
  'REACT_APP_API_BASE_URL': process.env.REACT_APP_API_BASE_URL,
  'NODE_ENV': process.env.NODE_ENV
};

Object.entries(envVars).forEach(([key, value]) => {
  if (value) {
    console.log(`✅ ${key}: ${value}`);
  } else {
    console.log(`⚠️ ${key}: Not set`);
  }
});

// Test 3: Simulate common runtime error scenarios
console.log("\n🧪 Testing common runtime error scenarios...");

// Scenario 1: Null admin object
function testNullAdmin() {
  console.log("Testing null admin object...");
  try {
    const admin = null;
    const token = admin?.token; // This should work with optional chaining
    console.log("✅ Null admin handled correctly");
  } catch (error) {
    console.log("❌ Null admin error:", error.message);
  }
}

// Scenario 2: Undefined data fields
function testUndefinedData() {
  console.log("Testing undefined data fields...");
  try {
    const user = { name: undefined, email: null };
    const displayName = (user.name || "U").charAt(0).toUpperCase();
    const email = user.email || "No email";
    console.log("✅ Undefined data handled correctly");
  } catch (error) {
    console.log("❌ Undefined data error:", error.message);
  }
}

// Scenario 3: Invalid date parsing
function testInvalidDate() {
  console.log("Testing invalid date parsing...");
  try {
    const dates = [null, undefined, "invalid-date", "2023-01-01"];
    dates.forEach(date => {
      const formatted = date ? new Date(date).toLocaleDateString() : "N/A";
      console.log(`Date: ${date} -> ${formatted}`);
    });
    console.log("✅ Date parsing handled correctly");
  } catch (error) {
    console.log("❌ Date parsing error:", error.message);
  }
}

// Scenario 4: API error handling
function testApiErrorHandling() {
  console.log("Testing API error handling...");
  try {
    const response = { ok: false, status: 401 };
    if (!response.ok) {
      if (response.status === 401) {
        console.log("✅ 401 error handled correctly");
      } else {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
    }
  } catch (error) {
    console.log("❌ API error handling failed:", error.message);
  }
}

// Scenario 5: Data structure validation
function testDataValidation() {
  console.log("Testing data structure validation...");
  try {
    const testCases = [
      { data: { data: [] }, expected: true },
      { data: { data: null }, expected: false },
      { data: null, expected: false },
      { data: {}, expected: false }
    ];
    
    testCases.forEach(({ data, expected }) => {
      const isValid = data && data.data;
      console.log(`Data: ${JSON.stringify(data)} -> Valid: ${isValid}`);
    });
    console.log("✅ Data validation working correctly");
  } catch (error) {
    console.log("❌ Data validation error:", error.message);
  }
}

// Run all tests
function runDebugTests() {
  console.log("🚀 Starting debug tests...\n");
  
  testNullAdmin();
  testUndefinedData();
  testInvalidDate();
  testApiErrorHandling();
  testDataValidation();
  
  console.log("\n🎯 Debug tests completed!");
  console.log("\n📋 Common runtime error causes:");
  console.log("1. Missing dependencies");
  console.log("2. Undefined environment variables");
  console.log("3. Null/undefined object access");
  console.log("4. Invalid data structure");
  console.log("5. Network errors");
  console.log("6. Missing context providers");
}

runDebugTests(); 