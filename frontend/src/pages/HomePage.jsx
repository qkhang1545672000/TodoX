// Import các component con
import AddTask from "@/components/AddTask";
import DateTimeFilter from "@/components/DateTimeFilter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import StatsAndFilters from "@/components/StatsAndFilters";
import TaskList from "@/components/TaskList";
import TaskListPagination from "@/components/TaskListPagination";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import api from "@/lib/axios"; // axios custom để gọi API
import { visibleTaskLimit } from "@/lib/data";

const HomePage = () => {
  // State quản lý dữ liệu task và thống kê
  const [taskBuffer, setTaskBuffer] = useState([]); // chứa toàn bộ danh sách task
  const [activeTaskCount, setActiveTaskCount] = useState(0); // số task đang active
  const [completedTaskCount, setCompletedTaskCount] = useState(0); // số task đã hoàn thành
  const [filter, setfilter] = useState("all"); // bộ lọc (all | active | completed)
  const [dateQuery, setDateQuery] = useState("today"); // bộ lọc theo ngày
  const [page, setPage] = useState(1); // trang hiện tại

  // Khi component mount lần đầu → fetch task
  useEffect(() => {
    fetchTasks();
  }, [dateQuery]);

  useEffect(() => {
    setPage(1);
  }, [filter, dateQuery]);

  /// Hàm lấy danh sách task từ API
  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks?filter=${dateQuery}`); // gọi API GET /tasks
      // cập nhật state dựa vào dữ liệu trả về từ backend
      setActiveTaskCount(res.data.activeCount);
      setTaskBuffer(res.data.tasks);
      setCompletedTaskCount(res.data.completedCount);
    } catch (error) {
      console.error("lỗi xảy ra khi truy xuất tasks:", error);
      toast.error("Lỗi xảy ra khi truy xuất task."); // hiển thị thông báo lỗi
    }
  };

  // Callback để làm mới danh sách khi có thay đổi (thêm, xóa, update task)
  const handleTaskChanged = () => {
    fetchTasks();
  };
  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };
  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  // Lọc task theo trạng thái
  const filteredTask = taskBuffer.filter((task) => {
    switch (filter) {
      case "active":
        return task.status === "active"; // chỉ lấy task active
      case "complete":
        return task.status === "complete"; // chỉ lấy task completed
      default:
        return true; // all → lấy tất cả
    }
  });
  const visibleTask = filteredTask.slice(
    (page - 1) * visibleTaskLimit,
    page * visibleTaskLimit
  ); // lấy task hiện tại
  if (visibleTask.length === 0) {
    handlePrev();
  }
  const totalPages = Math.ceil(
    filteredTask.length / visibleTaskLimit
  ); // tổng số trang
  return (
    <div className="min-h-screen w-full relative">
      {/* Background gradient nhiều lớp để tạo hiệu ứng Aurora */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
       radial-gradient(ellipse 80% 60% at 60% 20%, rgba(175, 109, 255, 0.50), transparent 65%),
        radial-gradient(ellipse 70% 60% at 20% 80%, rgba(255, 100, 180, 0.45), transparent 65%),
        radial-gradient(ellipse 60% 50% at 60% 65%, rgba(255, 235, 170, 0.43), transparent 62%),
        radial-gradient(ellipse 65% 40% at 50% 60%, rgba(120, 190, 255, 0.48), transparent 68%),
        linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
      `,
        }}
      />
      <div className="container pt-8 mx-auto relative z-10">
        <div className="w-full max-w-2xl p-6 mx-auto space-y-6 ">
          {/* Đầu trang (logo, tiêu đề, ...) */}
          <Header />

          {/* Form thêm task mới */}
          <AddTask handleNewTaskAdded={handleTaskChanged} />

          {/* Thống kê và bộ lọc (active / completed / all) */}
          <StatsAndFilters
            filter={filter}
            setfilter={setfilter}
            activeTasksCount={activeTaskCount}
            completedTasksCount={completedTaskCount}
          />

          {/* Danh sách nhiệm vụ (hiển thị task theo filter) */}
          <TaskList
            filteredTasks={visibleTask}
            filter={filter}
            handleTaskChanged={handleTaskChanged}
          />

          {/* Phân trang + Lọc theo ngày */}
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <TaskListPagination
              handleNext={handleNext}
              handlePrev={handlePrev}
              handlePageChange={handlePageChange}
              page={page}
              totalPages={totalPages}
            />
            <DateTimeFilter
              dateQuery={dateQuery}
              setDateQuery={setDateQuery}
            />
          </div>

          {/* Chân trang (hiển thị tổng số task active & completed) */}
          <Footer
            activeTasksCount={activeTaskCount}
            completedTasksCount={completedTaskCount}
          />
        </div>
      </div>
    </div>
  );
};
export default HomePage;
