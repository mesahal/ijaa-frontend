import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../hooks/useAuth';
import { Shield, Lock, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import { Button, Input, Card   } from '../../components/ui';

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { adminSignIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminSignIn(email, password);
      toast.success("Admin login successful!");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 dark:from-gray-900 dark:to-primary-900/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-white rounded-md flex items-center justify-center shadow-lg mb-4 p-2">
            <img
              src="/logo.png"
              alt="IIT JU Alumni Logo"
              className="h-12 w-12 object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Access the admin panel
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            leftIcon={<Shield className="h-5 w-5" />}
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            leftIcon={<Lock className="h-5 w-5" />}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            icon={<Lock className="h-5 w-5" />}
            iconPosition="left"
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
