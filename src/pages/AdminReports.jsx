import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { useAdminAuth } from "../context/AdminAuthContext";
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Calendar,
  Filter,
  Search,
} from "lucide-react";
import { toast } from "react-toastify";

const AdminReports = () => {
  const { admin } = useAdminAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const API_BASE =
    process.env.REACT_APP_API_ADMIN_URL ||
    "http://localhost:8000/ijaa/api/v1/admin";

  useEffect(() => {
    if (admin && admin.token) {
      fetchReports();
    }
  }, [admin]);

  const fetchReports = async () => {
    try {
      // Check if admin is available
      if (!admin || !admin.token) {
        console.error("Admin not authenticated");
        toast.error("Please login to access reports");
        return;
      }

      const response = await fetch(`${API_BASE}/reports`, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please login again.");
          return;
        }
        throw new Error(`Failed to fetch reports: ${response.status}`);
      }

      const data = await response.json();
      
      // Check if data has the expected structure
      if (data && data.data) {
        setReports(data.data);
      } else {
        console.warn("Unexpected data structure:", data);
        setReports([]);
      }
    } catch (error) {
      console.error("Reports error:", error);
      toast.error("Failed to load reports");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveReport = async (reportId) => {
    try {
      const response = await fetch(`${API_BASE}/reports/${reportId}/resolve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${admin.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to resolve report");
      }

      toast.success("Report marked as resolved");
      fetchReports(); // Refresh the list
    } catch (error) {
      toast.error("Failed to resolve report");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "urgent":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      (report.reporterName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (report.reason || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.content || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || report.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Check if admin is available
  if (!admin) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading admin data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Check if admin is available
  if (!admin) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading admin data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  // Check if reports array is valid
  if (!Array.isArray(reports)) {
    console.warn("Reports data is not an array:", reports);
    setReports([]);
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            User Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and manage user-submitted reports
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Reports</option>
                <option value="pending">Pending</option>
                <option value="urgent">Urgent</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No reports found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {reports.length === 0
                  ? "No reports have been submitted yet."
                  : "No reports match your search criteria."}
              </p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(report.status)}
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {report.status.charAt(0).toUpperCase() +
                          report.status.slice(1)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {report.reason}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {report.content}
                    </p>
                  </div>
                  {report.status !== "resolved" && (
                    <button
                      onClick={() => handleResolveReport(report.id)}
                      className="ml-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Resolved
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {report.reporterName}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {report.reportedUser && (
                    <div className="text-sm">
                      Reported: {report.reportedUser}
                    </div>
                  )}
                </div>

                {report.adminNotes && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Admin Notes:</strong> {report.adminNotes}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Summary Stats */}
        {reports.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Report Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {reports.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Reports
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {reports.filter((r) => r.status === "pending").length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Pending
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {reports.filter((r) => r.status === "urgent").length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Urgent
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {reports.filter((r) => r.status === "resolved").length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Resolved
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReports; 