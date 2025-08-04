const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
const mockAdmin = {
  id: 1,
  name: "Admin User",
  email: "admin@ijaa.com",
  role: "ADMIN", // Use new simplified role system
  active: true
};

const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", isBlocked: false, batch: "2020", createdAt: "2024-01-01" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", isBlocked: true, batch: "2019", createdAt: "2024-01-02" },
];

const mockEvents = [
  { id: 1, title: "Alumni Meet 2024", description: "Annual gathering", date: "2024-12-25", location: "IIT Jahangirnagar" },
  { id: 2, title: "Tech Talk", description: "Technology discussion", date: "2024-11-15", location: "Online" },
];

const mockAnnouncements = [
  { id: 1, title: "Welcome Message", content: "Welcome to the alumni portal", priority: "HIGH", author: "Admin", createdAt: "2024-01-01" },
  { id: 2, title: "Event Update", content: "New events coming soon", priority: "NORMAL", author: "Admin", createdAt: "2024-01-02" },
];

const mockReports = [
  { id: 1, reason: "Inappropriate content", content: "User posted inappropriate content", status: "pending", reporterName: "User1", reportedUser: "User2", createdAt: "2024-01-01" },
  { id: 2, reason: "Spam", content: "User is sending spam messages", status: "resolved", reporterName: "User3", reportedUser: "User4", createdAt: "2024-01-02" },
];

const mockFeatureFlags = [
  { id: 1, featureName: "chat_feature", enabled: true, description: "Real-time chat functionality" },
  { id: 2, featureName: "events_feature", enabled: true, description: "Event management functionality" },
  { id: 3, featureName: "groups_feature", enabled: false, description: "Group creation and management" },
];

// JWT Secret
const JWT_SECRET = 'your-secret-key';

// Helper function to generate JWT
const generateToken = (admin) => {
  return jwt.sign(
    { 
      adminId: admin.id, 
      email: admin.email, 
      role: admin.role 
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Helper function to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Routes

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@ijaa.com' && password === 'admin123') {
    const token = generateToken(mockAdmin);
    res.json({
      message: "Admin login successful",
      code: "200",
      data: {
        token,
        adminId: mockAdmin.id,
        name: mockAdmin.name,
        email: mockAdmin.email,
        role: mockAdmin.role,
        active: mockAdmin.active
      }
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Admin Profile
app.get('/api/admin/profile', verifyToken, (req, res) => {
  res.json({
    message: "Admin profile retrieved successfully",
    code: "200",
    data: mockAdmin
  });
});

// Dashboard Stats
app.get('/api/admin/dashboard', verifyToken, (req, res) => {
  res.json({
    message: "Dashboard stats retrieved successfully",
    code: "200",
    data: {
      totalUsers: mockUsers.length,
      activeUsers: mockUsers.filter(u => !u.isBlocked).length,
      blockedUsers: mockUsers.filter(u => u.isBlocked).length,
      totalEvents: mockEvents.length,
      activeEvents: mockEvents.length,
      totalAnnouncements: mockAnnouncements.length,
      pendingReports: mockReports.filter(r => r.status === 'pending').length,
      topBatches: [],
      recentActivities: []
    }
  });
});

// Users
app.get('/api/admin/users', verifyToken, (req, res) => {
  res.json({
    message: "Users retrieved successfully",
    code: "200",
    data: mockUsers
  });
});

app.post('/api/admin/users/:id/block', verifyToken, (req, res) => {
  const userId = parseInt(req.params.id);
  const user = mockUsers.find(u => u.id === userId);
  if (user) {
    user.isBlocked = true;
    res.json({ message: "User blocked successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.post('/api/admin/users/:id/unblock', verifyToken, (req, res) => {
  const userId = parseInt(req.params.id);
  const user = mockUsers.find(u => u.id === userId);
  if (user) {
    user.isBlocked = false;
    res.json({ message: "User unblocked successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.delete('/api/admin/users/:id', verifyToken, (req, res) => {
  const userId = parseInt(req.params.id);
  const index = mockUsers.findIndex(u => u.id === userId);
  if (index !== -1) {
    mockUsers.splice(index, 1);
    res.json({ message: "User deleted successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Events
app.get('/api/admin/events', verifyToken, (req, res) => {
  res.json({
    message: "Events retrieved successfully",
    code: "200",
    data: mockEvents
  });
});

app.post('/api/admin/events', verifyToken, (req, res) => {
  const newEvent = {
    id: mockEvents.length + 1,
    ...req.body
  };
  mockEvents.push(newEvent);
  res.json({ message: "Event created successfully" });
});

app.put('/api/admin/events/:id', verifyToken, (req, res) => {
  const eventId = parseInt(req.params.id);
  const event = mockEvents.find(e => e.id === eventId);
  if (event) {
    Object.assign(event, req.body);
    res.json({ message: "Event updated successfully" });
  } else {
    res.status(404).json({ message: "Event not found" });
  }
});

app.delete('/api/admin/events/:id', verifyToken, (req, res) => {
  const eventId = parseInt(req.params.id);
  const index = mockEvents.findIndex(e => e.id === eventId);
  if (index !== -1) {
    mockEvents.splice(index, 1);
    res.json({ message: "Event deleted successfully" });
  } else {
    res.status(404).json({ message: "Event not found" });
  }
});

// Announcements
app.get('/api/admin/announcements', verifyToken, (req, res) => {
  res.json({
    message: "Announcements retrieved successfully",
    code: "200",
    data: mockAnnouncements
  });
});

app.post('/api/admin/announcements', verifyToken, (req, res) => {
  const newAnnouncement = {
    id: mockAnnouncements.length + 1,
    ...req.body,
    author: "Admin",
    createdAt: new Date().toISOString()
  };
  mockAnnouncements.push(newAnnouncement);
  res.json({ message: "Announcement created successfully" });
});

app.put('/api/admin/announcements/:id', verifyToken, (req, res) => {
  const announcementId = parseInt(req.params.id);
  const announcement = mockAnnouncements.find(a => a.id === announcementId);
  if (announcement) {
    Object.assign(announcement, req.body);
    res.json({ message: "Announcement updated successfully" });
  } else {
    res.status(404).json({ message: "Announcement not found" });
  }
});

app.delete('/api/admin/announcements/:id', verifyToken, (req, res) => {
  const announcementId = parseInt(req.params.id);
  const index = mockAnnouncements.findIndex(a => a.id === announcementId);
  if (index !== -1) {
    mockAnnouncements.splice(index, 1);
    res.json({ message: "Announcement deleted successfully" });
  } else {
    res.status(404).json({ message: "Announcement not found" });
  }
});

// Reports
app.get('/api/admin/reports', verifyToken, (req, res) => {
  res.json({
    message: "Reports retrieved successfully",
    code: "200",
    data: mockReports
  });
});

app.post('/api/admin/reports/:id/resolve', verifyToken, (req, res) => {
  const reportId = parseInt(req.params.id);
  const report = mockReports.find(r => r.id === reportId);
  if (report) {
    report.status = 'resolved';
    res.json({ message: "Report resolved successfully" });
  } else {
    res.status(404).json({ message: "Report not found" });
  }
});

// Feature Flags
app.get('/api/admin/feature-flags', verifyToken, (req, res) => {
  res.json({
    message: "Feature flags retrieved successfully",
    code: "200",
    data: mockFeatureFlags
  });
});

app.put('/api/admin/feature-flags/:featureName', verifyToken, (req, res) => {
  const { featureName } = req.params;
  const { enabled } = req.query;
  const flag = mockFeatureFlags.find(f => f.featureName === featureName);
  if (flag) {
    flag.enabled = enabled === 'true';
    res.json({ message: "Feature flag updated successfully" });
  } else {
    res.status(404).json({ message: "Feature flag not found" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock Admin Server running on http://localhost:${PORT}`);
  console.log(`📧 Admin Login: admin@ijaa.com / admin123`);
  console.log(`🔑 JWT Secret: ${JWT_SECRET}`);
}); 