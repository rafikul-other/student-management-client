// Dashboard.tsx
import React, { useEffect, useState } from "react";
import CardDataStats from "../../components/CardDataStats";
import TableOne from "../../components/Tables/TableOne";
import axios from "axios";
import BaseUrl from "../../BaseUrl/BaseUrl";

 
interface Attendance {
  id: number;
  date: string;
  present: boolean;
}

interface Student {
  id: number;
  name: string;
  subject: string;
  attendance: Attendance[];
}

const Dashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/students/fetch`);
      setStudents(res.data.totalStudents);
    } catch (error) {
      console.error("Error fetching total students:", error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Total Enrolled Students" total={`${students}`} />
        <CardDataStats title="Work on Progress Section" total="0" />
        <CardDataStats title="Work on Progress Section" total="0" />
        <CardDataStats title="Work on Progress Section" total="0" />
      </div>

      <div className="mt-4">
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
