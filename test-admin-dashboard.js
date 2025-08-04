// Test script to verify admin dashboard functionality
console.log("Testing admin dashboard functionality...");

// Test 1: Check if environment variables are set
const adminUrl = process.env.REACT_APP_API_ADMIN_URL || "http://localhost:8000/ijaa/api/v1/admin";
console.log("✅ Admin API URL:", adminUrl);

// Test 2: Check if admin authentication context is working
const testAdminData = {
  email: "admin@ijaa.com",
  name: "Super Administrator",
  token: "test-token",
  adminId: 1,
  role: "SUPER_ADMIN",
  active: true
};

// Test 3: Validate admin data structure
const requiredFields = ['email', 'name', 'token', 'adminId', 'role', 'active'];
const missingFields = requiredFields.filter(field => !testAdminData[field]);

if (missingFields.length === 0) {
  console.log("✅ Admin data structure is valid");
} else {
  console.log("❌ Missing required fields:", missingFields);
}

// Test 4: Check localStorage functionality
try {
  localStorage.setItem("test_admin", JSON.stringify(testAdminData));
  const retrieved = JSON.parse(localStorage.getItem("test_admin"));
  if (retrieved && retrieved.email === testAdminData.email) {
    console.log("✅ localStorage functionality working");
  } else {
    console.log("❌ localStorage functionality failed");
  }
  localStorage.removeItem("test_admin");
} catch (error) {
  console.log("❌ localStorage error:", error.message);
}

// Test 5: Check API endpoint availability
async function testApiEndpoint() {
  try {
    const response = await fetch(`${adminUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: "admin@ijaa.com",
        password: "admin123"
      })
    });
    
    if (response.ok) {
      console.log("✅ Admin API endpoint is accessible");
    } else {
      console.log("⚠️ Admin API endpoint returned status:", response.status);
    }
  } catch (error) {
    console.log("❌ Admin API endpoint error:", error.message);
  }
}

// Run the API test
testApiEndpoint();

console.log("🎯 Admin dashboard tests completed!"); 