import axios from "axios";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import BaseUrl from "../BaseUrl/BaseUrl";
// import { useNavigate } from "react-router-dom";

interface ModalProps {
  date: Date;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ date, onClose }) => {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [present, setPresent] = useState("");

  const formatDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const exactDate = formatDate().split(", ")[1];
  const exactYear = formatDate().split(", ")[2];

  const handleSaveDate = async () => {
    const formattedTime = `${exactDate} ${exactYear}`;

    if (!name || !subject || !formattedTime || !present) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(
        `${BaseUrl}/students/attendence`,
        {
          name,
          subject,
          time: formattedTime,
          present,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        toast.success("Today's Attendance Saved Successfully");
      } else {
        toast.success("Please Enter Valid Data for Attendance");
      }
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error Saving Today's Attendance Details: ", error);
      toast.error("Error Saving Today's Attendance Details");
    } finally {
      setName("");
      setSubject("");
      setPresent("Present");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 p-5 md:p-0 ">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="bg-slate-800 rounded-lg shadow-xl shadow-slate-700 p-8 max-w-md w-full">
        <h2 className="text-2xl mb-4 text-white">{formatDate()}</h2>

        <div className="mb-4">
          <label className="block mb-2 text-white">Your Name:</label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full p-2 border border-gray-300 rounded-md bg-slate-700"
            required
          ></input>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-white">Your Course Name:</label>
          <input
            onChange={(e) => setSubject(e.target.value)}
            value={subject}
            className="w-full p-2 border border-gray-300 rounded-md bg-slate-700"
            required
          ></input>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-white">Your Attendance</label>

          <select
            id="type"
            name="type"
            onChange={(e) => setPresent(e.target.value)}
            value={present}
            className="w-full p-2 border border-gray-300 rounded-md bg-slate-700"
            required
          >
            <option value="" disabled hidden>
              Choose One
            </option>

            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="  text-white px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-500 font-semibold "
          >
            Cancel
          </button>
          <button
            onClick={handleSaveDate}
            className="  text-white px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-500 font-semibold "
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
