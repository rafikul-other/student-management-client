import React, { useEffect, useState } from "react";
import axios from "axios";
import BaseUrl from "../../BaseUrl/BaseUrl";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";

interface SingleAttendance {
  _id: number;
  time: string;
  present: string;
}

interface Attendance {
  _id: number;
  time: string;
  present: string;
}

interface Student {
  _id: number;
  name: string;
  subject: string;
  attendence: Attendance[];
}

const TableAttendence: React.FC = () => {
  const [students, setStudents] = useState<SingleAttendance[]>([]);
  const [searchItem, setSearchItem] = useState("");
  const [singleStudent, setSingleStudent] = useState<Student>();
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(8);
  const [selectedAttendance, setSelectedAttendance] = useState<{
    date: string;
    present: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/students/fetchSingle/${id}`);
      setStudents(res.data.data.attendence);
      setSingleStudent(res.data.data);
      toast.success(`${res?.data?.data?.name?.toUpperCase()} Attendance Loaded Successfully`);
    } catch (error) {
      console.error("Error Loading Attendance:", error);
      toast.error("Error Loading Attendance");
    }
  };

  const filteredSearch = students.filter((item) =>
    item.time.toLowerCase().includes(searchItem.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSearch.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredSearch.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const todayDate = () => {
    const date = new Date();
    return date.toLocaleDateString([], {
      timeZone: "Asia/Kolkata",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const currentDate = todayDate();

  const updateAttendance = async () => {
    if (!selectedAttendance) return;

    try {
      await axios.put(`${BaseUrl}/students/updateAttendance/${id}`, {
        date: selectedAttendance.date,
        present: selectedAttendance.present,
      });

      toast.success("Attendance updated successfully");
      fetchStudents(); // Refresh the data after update
      setIsModalOpen(false);
      setSelectedAttendance(null);
    } catch (error) {
      console.error("Error updating attendance:", error);
      toast.error("Error updating attendance");
    }
  };

  const handleOpenModal = (date: string, present: string) => {
    setSelectedAttendance({ date, present });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAttendance(null);
  };

  const handleExport = () => {
    if (!singleStudent) {
      toast.error("No student data available for export");
      return;
    }

    const csvHeader = `Student Name: ${singleStudent.name}\nDate,Attendance\n`;
    const csvRows = students.map((student) => {
      return `${student.time},${student.present}`;
    });

    const csvContent = csvHeader + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${singleStudent.name}_attendance.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        {currentDate}
      </h4>

      <Toaster reverseOrder={false} position="top-right" />

      <div className="mt-10 mb-10">
        <form>
          <div className="relative flex flex-col justify-between items-center md:flex-row">
            <input
              type="text"
              placeholder="Type to search..."
              onChange={(e) => setSearchItem(e.target.value)}
              value={searchItem}
              className="w-full bg-transparent pl-9 pr-4 border text-black focus:outline-none dark:text-white xl:w-125 placeholder:font-semibold placeholder:text-xl p-4 rounded-lg bg-gray-800"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                handleExport();
              }}
              className="rounded-lg bg-primary px-6 py-2 text-white transition hover:bg-opacity-90 font-semibold mt-5 md:mt-0"
            >
              Export As CSV
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-3">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium xsm:text-base">Date</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium xsm:text-base">Attendance</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium xsm:text-base">Update</h5>
          </div>
        </div>

        {currentStudents.map((student, index) => (
          <div
            className="grid grid-cols-3 sm:grid-cols-3 border-b border-stroke dark:border-strokedark hover:bg-gray-700"
            key={index}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{student.time}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{student.present}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <button
                onClick={() => handleOpenModal(student.time, student.present)}
                className="mt-4 rounded-lg bg-red px-6 py-2 text-white transition hover:bg-opacity-90 font-semibold cursor-pointer"
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center mt-6 overflow-x-auto space-x-2">
        <button
          onClick={handleFirstPage}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border dark:border-strokedark dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          First
        </button>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border dark:border-strokedark dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {"<"}
        </button>
        {[...Array(totalPages)]
          .map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 rounded border dark:border-strokedark dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 ${currentPage === index + 1 ? "bg-primary text-white" : ""
                }`}
            >
              {index + 1}
            </button>
          ))
          .slice(
            Math.max(0, currentPage - 2),
            Math.min(currentPage + 1, totalPages)
          )}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border dark:border-strokedark dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {">"}
        </button>
        <button
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border dark:border-strokedark dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Last
        </button>
      </div>

      {/* {isModalOpen && selectedAttendance && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
              Update Attendance
            </h3>
            <p className="mb-4 text-black dark:text-white">
              Date: {selectedAttendance.date}
            </p>
            <div className="flex justify-around mb-6">
              <button
                onClick={() =>
                  setSelectedAttendance({
                    ...selectedAttendance,
                    present: "Present",
                  })
                }
                className={`px-4 py-2 rounded-lg font-semibold transition hover:bg-opacity-90 text-white ${
                  selectedAttendance.present === "Present"
                    ? "bg-primary"
                    : "bg-gray-500"
                }`}
              >
                Present
              </button>
              <button
                onClick={() =>
                  setSelectedAttendance({
                    ...selectedAttendance,
                    present: "Absent",
                  })
                }
                className={`px-4 py-2 rounded-lg font-semibold transition hover:bg-opacity-90 text-white ${
                  selectedAttendance.present === "Absent"
                    ? "bg-red-500"
                    : "bg-gray-500"
                }`}
              >
                Absent
              </button>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-lg bg-gray-500 text-white font-semibold mr-2"
              >
                Cancel
              </button>
              <button
                onClick={updateAttendance}
                className="px-4 py-2 rounded-lg bg-primary text-white font-semibold"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )} */}

      {isModalOpen && selectedAttendance && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl max-w-sm w-full mx-4 sm:mx-0 transform transition-all scale-95 sm:scale-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-black dark:text-white">
                Update Attendance
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Date Display */}
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
              Date:{" "}
              <span className="font-medium">{selectedAttendance.date}</span>
            </p>

            {/* Action Buttons */}
            <div className="flex justify-between gap-4 mb-8">
              <button
                onClick={() =>
                  setSelectedAttendance({
                    ...selectedAttendance,
                    present: "Present",
                  })
                }
                className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 focus:outline-none ${selectedAttendance.present === "Present"
                    ? "bg-primary text-white shadow-lg hover:bg-primary-dark"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
              >
                Present
              </button>
              <button
                onClick={() =>
                  setSelectedAttendance({
                    ...selectedAttendance,
                    present: "Absent",
                  })
                }
                className={`flex-1 py-3 rounded-lg font-medium transition-all duration-300 focus:outline-none ${selectedAttendance.present === "Absent"
                    ? "bg-red-500 text-white shadow-lg hover:bg-red-600"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
              >
                Absent
              </button>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2 rounded-lg text-sm bg-gray-300 text-gray-700 hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={updateAttendance}
                className="px-5 py-2 rounded-lg text-sm bg-primary text-white hover:bg-primary-dark transition duration-300"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableAttendence;
