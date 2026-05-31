import axios from "axios";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import BaseUrl from "../BaseUrl/BaseUrl";

const Profile: React.FC = () => {
  const [aboutMe, setAboutMe] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const name = localStorage.getItem("name");
  const type = localStorage.getItem("type");
  const about = localStorage.getItem("about");
  const studentId = localStorage.getItem("studentId");
  const isStudent = type === "Student";

  const handleEdit = () => {
    setAboutMe(about || "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAboutMe("");
  };

  const handleSave = async () => {
    if (isStudent && studentId) {
      try {
        const res = await axios.put(
          `${BaseUrl}/students/updateAboutMe/${studentId}`,
          { aboutMe }
        );
        console.log(res.data);
        if (res.data.success) {
          localStorage.setItem("about", aboutMe);
          toast.success("About Me updated successfully");
          setIsEditing(false);
        }
      } catch (error) {
        console.error("Error updating aboutMe:", error);
        toast.error("Failed to update About Me");
      }
    } else {
      localStorage.setItem("about", aboutMe);
      setIsEditing(false);
    }
  };

  return (
    <>
      {type !== "Student" && <Breadcrumb pageName="Profile" />}

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-20">
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="mt-4">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              {name ? name.toUpperCase() : type}
            </h3>

            <div className="mx-auto max-w-180">
              <h4 className="font-semibold text-black dark:text-white">
                About Me
              </h4>

              {isEditing ? (
                <div className="mt-4">
                  <Toaster reverseOrder={false} position="top-right" />
                  <textarea
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                    className="w-full rounded-md border border-stroke bg-transparent py-2 px-4 text-black dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    rows={5}
                  />
                  <div className="mt-4 flex justify-center space-x-4">
                    <button
                      onClick={handleSave}
                      className="rounded-lg border border-primary bg-primary px-6 py-2 text-white transition hover:bg-opacity-90"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="rounded-lg border border-red-500 bg-red-500 px-6 py-2 text-white transition hover:bg-opacity-90"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4.5">
                  <p>
                    {about ? about : "* Please Enter About Yourself Here *"}
                  </p>
                  <button
                    onClick={handleEdit}
                    className="mt-4 rounded-lg border border-primary bg-primary px-6 py-2 text-white transition hover:bg-opacity-90 font-semibold"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
