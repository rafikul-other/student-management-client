import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { studentApi } from "../../api/studentApi";
import { showToast } from "../../hooks/useToast";

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [aboutMe, setAboutMe] = useState(() => localStorage.getItem("about") || "");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (user?.role !== "Student" || !user._id) {
      localStorage.setItem("about", aboutMe);
      setIsEditing(false);
      showToast.success("Profile updated");
      return;
    }
    setSaving(true);
    try {
      await studentApi.updateAboutMe(user._id, aboutMe);
      localStorage.setItem("about", aboutMe);
      setIsEditing(false);
      showToast.success("About Me updated successfully");
    } catch {
      showToast.error("Failed to update About Me");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="rounded-xl border border-stroke bg-white p-8 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
            {user?.name?.charAt(0)?.toUpperCase() || user?.role?.charAt(0) || "?"}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white">{user?.name || "User"}</h2>
            <span className="inline-block mt-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">{user?.role}</span>
            {user?.department && <p className="mt-1 text-gray-500">{user.department}</p>}
          </div>
        </div>

        {user?.email && (
          <div className="mb-4">
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-black dark:text-white">{user.email}</p>
          </div>
        )}
        {user?.subject && (
          <div className="mb-4">
            <p className="text-sm text-gray-500">Subject</p>
            <p className="font-medium text-black dark:text-white">{user.subject}</p>
          </div>
        )}

        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-black dark:text-white">About Me</h3>
            {!isEditing && (
              <button onClick={() => { setAboutMe(localStorage.getItem("about") || ""); setIsEditing(true); }} className="text-sm text-primary hover:underline">Edit</button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <textarea value={aboutMe} onChange={(e) => setAboutMe(e.target.value)} rows={5} className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white" placeholder="Tell us about yourself..." />
              <div className="flex gap-3">
                <button onClick={handleSave} disabled={saving} className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                  {saving ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setIsEditing(false)} className="px-5 py-2 rounded-lg border border-stroke text-sm font-medium hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">{aboutMe || "No bio added yet."}</p>
          )}
        </div>
      </div>

      <button onClick={logout} className="w-full rounded-xl border border-red-500 py-3 text-red-500 font-semibold hover:bg-red-50 dark:hover:bg-red-500/10">
        Sign Out
      </button>
    </div>
  );
};

export default Profile;