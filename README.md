# Hệ thống Quản lý Chấm công Nhân viên (Timekeeping System)

Ứng dụng quản lý nội bộ dành cho doanh nghiệp, hỗ trợ tự động hóa quy trình ghi nhận công và quản lý thông tin nhân sự.

## 🏗️ Kiến trúc Hệ thống (System Architecture)
Dự án được thiết kế và tổ chức mã nguồn theo kiến trúc **3-Tier Architecture (Kiến trúc 3 tầng)** chuẩn chỉnh, giúp tách biệt rõ ràng các tầng xử lý:

*   **GUI (Presentation Layer):** Tầng giao diện người dùng, được xây dựng bằng **HTML/CSS/JavaScript** mang lại trải nghiệm trực quan và mượt mà.
*   **BLL (Business Logic Layer):** Tầng xử lý nghiệp vụ cốt lõi. Đây là nơi tập trung toàn bộ các quy tắc logic của hệ thống (phân quyền tài khoản, kiểm tra điều kiện chấm công).
*   **DAL (Data Access Layer) & Entity:** Tầng quản lý kết nối, truy xuất dữ liệu và định nghĩa các đối tượng thực thể (Nhân viên, Ca làm, Lịch sử công) giúp đảm bảo tính toàn vẹn cho Cơ sở dữ liệu.

## 🌟 Các Chức năng Nghiệp vụ Chính (Business Features)
Hệ thống tập trung giải quyết các bài toán thực tế của một doanh nghiệp bao gồm:

*   **Quản lý Thực thể Nhân sự:** Hỗ trợ lưu trữ, cập nhật thông tin chi tiết của từng nhân viên (Mã NV, chức vụ, phòng ban).
*   **Nghiệp vụ Kiểm soát Chấm công:** Ghi nhận chính xác thời gian Check-in/Check-out, hỗ trợ tính toán thời gian làm việc thực tế và trạng thái đi muộn/về sớm.
*   **Phân quyền Hệ thống (Authorization):** Tách biệt rõ ràng quyền hạn và giao diện hiển thị giữa tài khoản Nhân viên (chỉ xem lịch sử công) và tài khoản Quản lý (được quyền cấu hình, phê duyệt).


## 💻 Công nghệ Sử dụng (Tech Stack)
*   **Frontend:** HTML5, CSS3, JavaScript (xử lý tương tác bất đồng bộ).
*   **Backend & Architecture:** Kiến trúc 3 tầng (3-Tier), mô hình hướng đối tượng (OOP).
*   **Công cụ phát triển:** Visual Studio / VS Code, Git/GitHub.
