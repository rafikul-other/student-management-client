import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../hooks/useToast";

const SignIn: React.FC = () => {
  const [role, setRole] = useState<string>("SuperAdmin");
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

    try {
      let res;
      if (role === "Student") {
        res = await authApi.studentLogin({ name, subject, role });
        if (res.data.success) {
          login({
            _id: res.data.data._id,
            name: res.data.data.name,
            subject: res.data.data.subject,
            role: "Student",
            aboutMe: res.data.data.aboutMe,
            token: res.data.token,
          });
          showToast.success("Login successful!");
          navigate("/admin/calendar");
        }
      } else if (role === "DepartmentManager") {
        res = await authApi.departmentManagerLogin({ email: id, password, role });
        if (res.data.success) {
          login({
            _id: res.data.data._id,
            name: res.data.data.name,
            email: res.data.data.email,
            department: res.data.data.department,
            role: "DepartmentManager",
            token: res.data.token,
          });
          showToast.success("Login successful!");
          navigate("/admin/dashboard");
        }
      } else {
        res = role === "SuperAdmin"
          ? await authApi.superAdminLogin({ id, password, role })
          : await authApi.adminLogin({ id, password, role });
        if (res.data.success) {
          login({
            name: role,
            role: role as "SuperAdmin" | "Admin",
            token: res.data.token,
          });
          showToast.success("Login successful!");
          navigate("/admin/dashboard");
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
          <p className="text-gray-500 dark:text-gray-400">Student Management System</p>
        </div>

        <div className="rounded-2xl border border-stroke bg-white shadow-xl dark:border-strokedark dark:bg-boxdark p-8">
          <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">Role</label>
              <select
                value={role}
                onChange={(e) => { setRole(e.target.value); setId(""); setPassword(""); }}
                className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
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
                  <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white" />
                </div>
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">Subject / Course</label>
                  <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Enter your course" className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white" />
                </div>
              </>
            ) : role === "DepartmentManager" ? (
              <>
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">Email</label>
                  <input type="email" value={id} onChange={(e) => setId(e.target.value)} placeholder="Enter your email" className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white" />
                </div>
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">ID</label>
                  <input type="text" value={id} onChange={(e) => setId(e.target.value)} placeholder="Enter your ID" className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white" />
                </div>
                <div>
                  <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white" />
                </div>
              </>
            )}

            <button type="submit" disabled={loading} className="w-full cursor-pointer rounded-lg bg-primary py-3 font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;