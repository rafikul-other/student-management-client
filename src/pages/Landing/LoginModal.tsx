import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../hooks/useToast";
import { UserRole } from "../../types";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const getResponseToken = (response: any) => response?.data?.token || response?.data?.data?.token || "";

const getHomeRoute = (role: UserRole) => {
  if (role === "Student") return "/admin/calendar";
  if (role === "DepartmentManager") return "/admin/students";
  return "/admin/dashboard";
};

const reverseGeocodeFromBrowser = async (lat: number, lon: number): Promise<{ city: string; region: string; country: string } | null> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10&accept-language=en`,
      {
        signal: controller.signal,
        headers: { "User-Agent": "GDCollege/1.0" },
      }
    );
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    const data = await res.json();
    const addr = data?.address;
    if (!addr) return null;
    return {
      city: addr.city || addr.town || addr.village || addr.municipality || addr.county || addr.state_district || "",
      region: addr.state || addr.region || addr.province || "",
      country: addr.country || "",
    };
  } catch {
    return null;
  }
};

const getBrowserLocation = (): Promise<{
  latitude: number;
  longitude: number;
  city: string;
  region: string;
  country: string;
} | null> => {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      return resolve(null);
    }
    const timeoutId = setTimeout(() => resolve(null), 4000);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        clearTimeout(timeoutId);
        const { latitude, longitude } = pos.coords;
        const geo = await reverseGeocodeFromBrowser(latitude, longitude);
        resolve({
          latitude,
          longitude,
          city: geo?.city || "",
          region: geo?.region || "",
          country: geo?.country || "",
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

const inputClass =
  "w-full rounded-md border border-[#E5E7EB] bg-white py-2.5 px-3.5 text-sm text-[#1F2937] placeholder-[#9CA3AF] outline-none transition focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15";

const labelClass = "mb-1.5 block text-sm font-medium text-[#374151]";

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [role, setRole] = useState<UserRole>("SuperAdmin");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const location = await getBrowserLocation();
    const locationFields = location
      ? {
          latitude: location.latitude,
          longitude: location.longitude,
          city: location.city,
          region: location.region,
          country: location.country,
        }
      : {};

    try {
      let res;
      if (role === "Student") {
        if (!name.trim() || !subject.trim()) {
          showToast.error("Name and course are required");
          setLoading(false);
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
          onClose();
          navigate(getHomeRoute(role), { replace: true });
        }
      } else if (role === "DepartmentManager") {
        if (!id.trim() || !password) {
          showToast.error("Email and password are required");
          setLoading(false);
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
          onClose();
          navigate(getHomeRoute(role), { replace: true });
        }
      } else {
        if (!id.trim() || !password) {
          showToast.error("ID and password are required");
          setLoading(false);
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
          onClose();
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
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#1F2937]/40 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-2xl shadow-[#1F2937]/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close login"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-md text-[#6B7280] transition hover:bg-[#F3F4F6] hover:text-[#1F2937]"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#10B981]">
            Welcome
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#1F2937]">
            Sign in to GD College
          </h2>
          <p className="mt-1 text-xs text-[#6B7280]">
            We're using free hosting, so the initial wake-up might take a few seconds.Also you may have to refresh and login again if your'e lucky.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Role</label>
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value as UserRole);
                setId("");
                setPassword("");
                setName("");
                setSubject("");
              }}
              className={inputClass}
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
                <label className={labelClass}>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Subject / Course</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter your course"
                  className={inputClass}
                />
              </div>
            </>
          ) : role === "DepartmentManager" ? (
            <>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="Enter your email"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className={labelClass}>ID</label>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="Enter your ID"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full cursor-pointer rounded-md bg-[#4F46E5] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4338CA] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-5 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-3 text-center text-xs text-[#6B7280]">
          <p className="font-semibold text-[#374151]">For Testing Use Admin Credentials</p>
          <p className="mt-0.5">
            Role: <span className="font-semibold text-[#1F2937]">Admin</span> · ID: <span className="font-semibold text-[#1F2937]">AdminTest</span> · Password: <span className="font-semibold text-[#1F2937]">56789</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
