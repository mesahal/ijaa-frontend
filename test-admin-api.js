// Test script to verify admin API endpoints
const API_BASE = process.env.REACT_APP_API_ADMIN_URL || "http://localhost:8000/ijaa/api/v1/admin";

async function testAdminLogin() {
  try {
    console.log("Testing admin login...");
    
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@ijaa.com",
        password: "admin123",
      }),
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);
    
    const data = await response.json();
    console.log("Response data:", data);
    
    if (response.ok) {
      console.log("✅ Login successful!");
      return data.data.token;
    } else {
      console.log("❌ Login failed:", data.message);
      return null;
    }
  } catch (error) {
    console.log("❌ Network error:", error.message);
    return null;
  }
}

async function testAdminProfile(token) {
  if (!token) return;
  
  try {
    console.log("Testing admin profile...");
    
    const response = await fetch(`${API_BASE}/profile`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Profile response status:", response.status);
    
    const data = await response.json();
    console.log("Profile data:", data);
    
    if (response.ok) {
      console.log("✅ Profile fetch successful!");
    } else {
      console.log("❌ Profile fetch failed:", data.message);
    }
  } catch (error) {
    console.log("❌ Profile network error:", error.message);
  }
}

async function testDashboard(token) {
  if (!token) return;
  
  try {
    console.log("Testing dashboard...");
    
    const response = await fetch(`${API_BASE}/dashboard`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Dashboard response status:", response.status);
    
    const data = await response.json();
    console.log("Dashboard data:", data);
    
    if (response.ok) {
      console.log("✅ Dashboard fetch successful!");
    } else {
      console.log("❌ Dashboard fetch failed:", data.message);
    }
  } catch (error) {
    console.log("❌ Dashboard network error:", error.message);
  }
}

async function runTests() {
  console.log("🚀 Starting admin API tests...");
  console.log("API Base URL:", API_BASE);
  
  const token = await testAdminLogin();
  await testAdminProfile(token);
  await testDashboard(token);
  
  console.log("🏁 Tests completed!");
}

runTests(); 