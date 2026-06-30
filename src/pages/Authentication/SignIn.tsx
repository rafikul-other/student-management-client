import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../hooks/useToast";
import { UserRole } from "../../types";

const getResponseToken = (response: any) => response?.data?.token || response?.data?.data?.token || "";

const getHomeRoute = (role: UserRole) => {
  if (role === "Student") return "/admin/calendar";
  if (role === "DepartmentManager") return "/admin/students";
  return "/admin/dashboard";
};

const getBrowserCoords = (): Promise<{ latitude: number; longitude: number } | null> => {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      return resolve(null);
    }
    const timeoutId = setTimeout(() => resolve(null), 4000);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timeoutId);
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      () => {
        clearTimeout(timeoutId);
        resolve(null);
      },
      { enableHighAccuracy: false, timeout: 3500, maximumAge: 60000 }
    );
  });
};

const SignIn: React.FC = () => {
  const [role, setRole] = useState<UserRole>("SuperAdmin");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const coords = await getBrowserCoords();
    const locationFields = coords ? { latitude: coords.latitude, longitude: coords.longitude } : {};

    try {
      let res;
      if (role === "Student") {
        if (!name.trim() || !subject.trim()) {
          showToast.error("Name and course are required");
          return;
        }
        res = await authApi.studentLogin({ name, subject, role, ...locationFields });
        if (res.data.success) {
          const token = getResponseToken(res);
          login({
            _id: res.data.data._id,
            name: res.data.data.name,
            subject: res.data.data.subject,
            role: "Student",
            aboutMe: res.data.data.aboutMe,
            token,
          });
          showToast.success("Login successful!");
          navigate(getHomeRoute(role), { replace: true });
        }
      } else if (role === "DepartmentManager") {
        if (!id.trim() || !password) {
          showToast.error("Email and password are required");
          return;
        }
        res = await authApi.departmentManagerLogin({ email: id, password, role, ...locationFields });
        if (res.data.success) {
          const token = getResponseToken(res);
          login({
            _id: res.data.data._id,
            name: res.data.data.name,
            email: res.data.data.email,
            department: res.data.data.department,
            role: "DepartmentManager",
            token,
          });
          showToast.success("Login successful!");
          navigate(getHomeRoute(role), { replace: true });
        }
      } else {
        if (!id.trim() || !password) {
          showToast.error("ID and password are required");
          return;
        }
        res = role === "SuperAdmin"
          ? await authApi.superAdminLogin({ id, password, role, ...locationFields })
          : await authApi.adminLogin({ id, password, role, ...locationFields });
        if (res.data.success) {
          const token = getResponseToken(res);
          login({
            name: role,
            role,
            token,
          });
          showToast.success("Login successful!");
          navigate(getHomeRoute(role), { replace: true });
        }
      }
    } catch (error: any) {
      showToast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-meta-4/10 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">GD College</h1>
          <p className="text-gray-500">Student Management System</p>
          <p className="text-red-500">For Testing Use Admin Credentials</p>
          <p className="text-red-500">Role - Admin / ID - AdminTest / Password - 56789</p>
        </div>

        <div className="rounded-2xl border border-stroke bg-white shadow-xl p-8">
          <h2 className="text-2xl font-bold text-black mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2.5 block text-sm font-medium text-black">Role</label>
              <select
                value={role}
                onChange={(e) => { setRole(e.target.value as UserRole); setId(""); setPassword(""); setName(""); setSubject(""); }}
                className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary"
              >
                <option value="SuperAdmin">Super Admin</option>
                <option value="Admin">Admin</option>
                <option value="DepartmentManager">Department Manager</option>
                <option value="Student">Student</option>
              </select>
            </div>

            {role === "Student" ? (
              <>
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-black">Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-black">Subject / Course</label>
                  <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Enter your course" className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary" />
                </div>
              </>
            ) : role === "DepartmentManager" ? (
              <>
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-black">Email</label>
                  <input type="email" value={id} onChange={(e) => setId(e.target.value)} placeholder="Enter your email" className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-black">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-black">ID</label>
                  <input type="text" value={id} onChange={(e) => setId(e.target.value)} placeholder="Enter your ID" className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-black">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary" />
                </div>
              </>
            )}

            <button type="submit" disabled={loading} className="w-full cursor-pointer rounded-lg bg-primary py-3 font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-stroke text-center">
            <Link
              to="/docs"
              className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:text-primary/80 transition-colors"
            >
              📖 Documentation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
