// doimatkhau.js - Xử lý logic cho trang đổi mật khẩu

// Đợi giao diện HTML tải xong hoàn toàn để gán sự kiện cho các nút bấm
document.addEventListener("DOMContentLoaded", () => {
    const btnDoiMatKhau = document.getElementById("btnDoiMatKhau");
    const btnHuy = document.getElementById("btnHuy");

    // Gán sự kiện click cho nút CẬP NHẬT
    if (btnDoiMatKhau) {
        btnDoiMatKhau.addEventListener("click", (e) => {
            e.preventDefault(); // Ngăn hành vi submit form mặc định làm tải lại trang
            doiMatKhauXuly();
        });
        console.log("[DEBUG] Đã gán sự kiện click cho nút btnDoiMatKhau thành công.");
    }

    // Gán sự kiện click cho nút HỦY (nếu có trên giao diện)
    if (btnHuy) {
        btnHuy.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "https://app.assets/dangnhap.html";
        });
    }

    // Gán sự kiện bật/tắt mắt ẩn hiện mật khẩu theo chuẩn ID trong HTML của em
    gandSuKienMatAnHien("btnToggleCu", "txtMatKhauCu");
    gandSuKienMatAnHien("btnToggleMoi", "txtMatKhauMoi");
    gandSuKienMatAnHien("btnToggleXacNhan", "txtXacNhanMK");
});

/**
 * Hàm bổ trợ gán sự kiện click cho các nút con mắt tương ứng với từng ô input
 */
function gandSuKienMatAnHien(btnId, inputId) {
    const btn = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    if (btn && input) {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            if (input.type === "password") {
                input.type = "text";
                btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
            } else {
                input.type = "password";
                btn.innerHTML = '<i class="fa-solid fa-eye"></i>';
            }
        });
    }
}

/**
 * Hàm xử lý chính khi người dùng nhấn nút Đổi mật khẩu
 */
async function doiMatKhauXuly() {
    console.log("[DEBUG] Bắt đầu xử lý đổi mật khẩu...");

    // Khớp 100% ID từ file doimatkhau.html của em gửi lên
    const txtMaNV = document.getElementById('txtMaNV');
    const txtMatKhauCu = document.getElementById('txtMatKhauCu');
    const txtMatKhauMoi = document.getElementById('txtMatKhauMoi');
    const txtXacNhanMK = document.getElementById('txtXacNhanMK');

    // Lấy giá trị chuỗi nhập vào và cắt khoảng trắng thừa
    const maNV = txtMaNV ? txtMaNV.value.trim() : "";
    const mkCu = txtMatKhauCu ? txtMatKhauCu.value.trim() : "";
    const mkMoi = txtMatKhauMoi ? txtMatKhauMoi.value.trim() : "";
    const mkXacNhan = txtXacNhanMK ? txtXacNhanMK.value.trim() : "";

    // 1. Kiểm tra dữ liệu đầu vào cơ bản (Validation)
    if (!maNV || !mkCu || !mkMoi || !mkXacNhan) {
        alert("❌ Vui lòng nhập đầy đủ tất cả các trường thông tin!");
        return;
    }

    if (mkMoi.length < 6) {
        alert("❌ Mật khẩu mới phải có ít nhất 6 ký tự!");
        return;
    }

    if (mkCu === mkMoi) {
        alert("❌ Mật khẩu mới không được trùng với mật khẩu cũ!");
        return;
    }

    if (mkMoi !== mkXacNhan) {
        alert("❌ Xác nhận mật khẩu mới không khớp!");
        return;
    }

    try {
        console.log("[DEBUG] Đang gửi thông tin xuống C# thông qua callCSharp...");

        // Gửi yêu cầu đổi mật khẩu xuống tầng nghiệp vụ BLL của C#
        const response = await callCSharp("DoiMatKhau", {
            maNV: parseInt(maNV),
            passCu: mkCu,
            passMoi: mkMoi
        });

        console.log("[DEBUG] Phản hồi nhận được từ C#:", response);

        // Bóc tách cấu trúc Tuple (bool success, string message) nhận từ C#
        let laThanhCong = false;
        let thongBaoHeThong = "";

        if (response) {
            if (response.success !== undefined) {
                laThanhCong = response.success;
                thongBaoHeThong = response.message;
            } else if (response.Item1 !== undefined) {
                laThanhCong = response.Item1;
                thongBaoHeThong = response.Item2;
            } else if (response === true || response === 1 || response === "SUCCESS") {
                laThanhCong = true;
            }
        }

        // 2. Kiểm tra kết quả phản hồi để thông báo và chuyển trang
        if (laThanhCong) {
            const chuoiThanhCong = thongBaoHeThong || "✔️ Đổi mật khẩu thành công! Hệ thống đang chuyển hướng...";
            alert(chuoiThanhCong);
            
            // Làm sạch các ô nhập mật khẩu sau khi đổi thành công
            if (txtMatKhauCu) txtMatKhauCu.value = "";
            if (txtMatKhauMoi) txtMatKhauMoi.value = "";
            if (txtXacNhanMK) txtXacNhanMK.value = "";
            if (txtMaNV) txtMaNV.value = "";

            // Tự động điều hướng quay lại trang đăng nhập sau 1.5 giây
            setTimeout(() => {
                window.location.href = "https://app.assets/dangnhap.html";
            }, 1500);

        } else {
            // Hiển thị câu lỗi chi tiết do C# trả về (ví dụ: "Mật khẩu cũ không đúng...")
            const chuoiLoi = thongBaoHeThong || "❌ Mật khẩu cũ không chính xác hoặc thông tin tài khoản không tồn tại!";
            alert(chuoiLoi);
        }

    } catch (error) {
        console.error("[CRASH] Lỗi hệ thống khi gọi callCSharp:", error);
        alert("💥 Lỗi kết nối hệ thống: " + error.message);
    }
}