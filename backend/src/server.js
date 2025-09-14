// Import các thư viện cần thiết
import express from "express"; // Framework Express để tạo server
import taskRoutes from "./routes/taskRoutes.js"; // Các routes xử lý cho "tasks"
import { connectDB } from "./config/db.js"; // Hàm kết nối Database (MongoDB, v.v.)
import dotenv from "dotenv"; // Thư viện để đọc file .env
import cors from "cors"; // Thư viện để cho phép truy cập từ các domain khác
// Load biến môi trường từ file .env vào process.env
dotenv.config();

// Lấy PORT từ file .env, nếu không có thì mặc định là 5001
const PORT = process.env.PORT || 5001;

// Khởi tạo ứng dụng Express
const app = express();

// Middleware: cho phép Express đọc dữ liệu JSON từ request body
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" })); // Cho phép truy cập từ các domain khác

// Gắn các routes cho endpoint "/api/tasks"
// Khi gọi http://localhost:5001/api/tasks/... thì sẽ chạy vào taskRoutes
app.use("/api/tasks", taskRoutes);

// Kết nối database trước, nếu thành công thì mới chạy server
connectDB().then(() => {
  // Lắng nghe server tại cổng PORT
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
