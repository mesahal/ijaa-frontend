// Test script for API utilities
console.log('Testing API utilities...');

// Test userEventApi
const testUserEventApi = async () => {
  try {
    const { userEventApi } = await import('./src/utils/userEventApi.js');
    console.log('✅ userEventApi imported successfully');
    
    // Test the API structure
    console.log('Available methods:', Object.keys(userEventApi));
    
    // Test data formatting
    const { formatEventForAPI, formatRegistrationForAPI } = await import('./src/utils/userEventApi.js');
    
    const testEventData = {
      title: "Test Event",
      description: "Test Description",
      date: "2024-12-25",
      time: "18:00",
      location: "Test Location",
      type: "meeting",
      maxAttendees: 100,
      price: 0
    };
    
    const formattedEvent = formatEventForAPI(testEventData);
    console.log('✅ formatEventForAPI works:', formattedEvent);
    
    const testRegistrationData = {
      name: "John Doe",
      email: "john@example.com",
      phone: "+880 1712-345678",
      specialRequests: "Test requests"
    };
    
    const formattedRegistration = formatRegistrationForAPI(testRegistrationData);
    console.log('✅ formatRegistrationForAPI works:', formattedRegistration);
    
  } catch (error) {
    console.error('❌ Error testing userEventApi:', error);
  }
};

// Test adminApi
const testAdminApi = async () => {
  try {
    const { adminApi } = await import('./src/utils/adminApi.js');
    console.log('✅ adminApi imported successfully');
    
    // Test the API structure
    console.log('Available methods:', Object.keys(adminApi));
    
  } catch (error) {
    console.error('❌ Error testing adminApi:', error);
  }
};

// Test apiClient
const testApiClient = async () => {
  try {
    const apiClient = await import('./src/utils/apiClient.js');
    console.log('✅ apiClient imported successfully');
    
  } catch (error) {
    console.error('❌ Error testing apiClient:', error);
  }
};

// Run tests
const runTests = async () => {
  console.log('🧪 Starting API utility tests...\n');
  
  await testUserEventApi();
  console.log('');
  
  await testAdminApi();
  console.log('');
  
  await testApiClient();
  console.log('');
  
  console.log('✅ All API utility tests completed!');
};

runTests().catch(console.error); 