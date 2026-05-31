import React, { useEffect, useState } from "react";
import AttendenceTableModal from "./AttendenceTableModal";
import axios from "axios";
import BaseUrl from "../../BaseUrl/BaseUrl";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Attendance {
  _id: number;
  date: string;
  present: boolean;
}

interface Student {
  _id: number;
  name: string;
  subject: string;
  totalPresent: number;
  totalAbsent: number;
  totalAttendance: number;
  attendance: Attendance[];
}

const TableOne: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchItem, setSearchItem] = useState("");
  const [openAttendenceModal, setOpenAttendenceModal] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/students/fetch`);
      setStudents(res.data.data);
      toast.success("Students Loaded Successfully");
    } catch (error) {
      console.error("Error Loading Students:", error);
      toast.error("Error Loading Students");
    }
  };

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(8);

  const handleOpenAttendenceModal = (id: number) => {
    // setOpenAttendenceModal(true);
    navigate(`/admin/studentAttendence/${id}`);
  };

  const handleCloseAttendenceModal = () => {
    setOpenAttendenceModal(false);
  };

  const filteredSearch = students.filter((item) =>
    item.name.toLowerCase().includes(searchItem.toLowerCase())
  );

  // Pagination Logic
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

  const handleExport = () => {
    const csvHeader =
      "Name,Course,Today Date,Total Present, Total Absent, Total Attendance\n";
    const csvRows = students.map((student) => {
      const todayDate = new Date().toLocaleDateString([], {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      return `${student.name},${student.subject},${todayDate},${student.totalPresent}, ${student.totalAbsent}, ${student.totalAttendance}`;
    });

    const csvContent = csvHeader + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "students_attendance.csv";
    link.click();
    URL.revokeObjectURL(url);
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

  const deleteStudent = async (id: number) => {
    console.log(id);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        {currentDate} Attendance Lists \\ (rafikul.career@gmail.com | 9064281142)
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
            <h5 className="text-sm font-medium xsm:text-base">Student Name</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium xsm:text-base">Subject</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium xsm:text-base">Attendance</h5>
          </div>
        </div>

        {currentStudents.map((student, id) => (
          <div
            className="grid grid-cols-3 sm:grid-cols-3 border-b border-stroke dark:border-strokedark  hover:bg-gray-700"
            key={id}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <p className="text-black dark:text-white text-sm md:text-lg">{student.name}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white text-sm md:text-lg">{student.subject}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5 cursor-pointer">
              <p
                onClick={() => handleOpenAttendenceModal(student._id)}
                className="mt-4 rounded-lg bg-primary px-6 py-2 text-white transition hover:bg-opacity-90 font-semibold"
              >
                View
              </p>
              {/* <p
                onClick={() => deleteStudent(student._id)}
                className="mt-4 rounded-lg bg-primary px-6 py-2 text-white transition hover:bg-opacity-90 font-semibold"
              >
                Delete
              </p> */}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
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

      {openAttendenceModal && (
        <AttendenceTableModal
          openAttendenceModal={openAttendenceModal}
          handleCloseAttendenceModal={handleCloseAttendenceModal}
        // students={students}
        />
      )}
    </div>
  );
};

export default TableOne;
