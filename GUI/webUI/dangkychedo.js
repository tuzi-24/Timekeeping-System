// dangkychedo.js

let kieuDon = "ot";
let pickerTu, pickerDen;

document.addEventListener("DOMContentLoaded", () => {
    pickerTu = flatpickr("#dateTu", { dateFormat: "d/m/Y", allowInput: true });
    pickerDen = flatpickr("#dateDen", { dateFormat: "d/m/Y", allowInput: true });

    const params = new URLSearchParams(window.location.search);
    const manv = params.get('manv');
    if (manv) {
        document.getElementById("txtMaNV").value = manv;
        XulyTimKiemNhanVienNhanh(manv);
    }

    // Sự kiện nhập mã nhân viên
    document.getElementById("txtMaNV").addEventListener("input", async (e) => {
        const maNVStr = e.target.value.trim();
        await XulyTimKiemNhanVienNhanh(maNVStr);
    });

    document.getElementById("frmCheDo").addEventListener("submit", async (e) => {
        e.preventDefault();
        await guiDonDangKy();
    });

    chuyenNghiepVu("ot");
});

/**
 * Hàm tự động tìm kiếm nhân viên từ C# và hiển thị theo cấu trúc hàng dọc liên tiếp
 */
async function XulyTimKiemNhanVienNhanh(maNVStr) {
    const txtHoTen   = document.getElementById("txtHoTen");
    const txtPhongBan = document.getElementById("cboPhongBan");
    const txtChucVu  = document.getElementById("cboChucVu");

    // Reset về trống khi chưa nhập gì
    if (!maNVStr) {
        if (txtHoTen)    txtHoTen.value    = "";
        if (txtPhongBan) txtPhongBan.value = "";
        if (txtChucVu)   txtChucVu.value   = "";
        return;
    }

    const maNVInt = parseInt(maNVStr);
    if (isNaN(maNVInt)) return;

    try {
        const resTable = await callCSharp("TimNhanVienTheoMa", { maNV: maNVInt });

        if (resTable && resTable.length > 0) {
            const nv = resTable[0];

            if (txtHoTen)    txtHoTen.value    = nv.HoTen  || "Chưa xác định";
            if (txtPhongBan) txtPhongBan.value = nv.TenPB  || nv.MaPB || "Chưa xếp phòng";
            if (txtChucVu)   txtChucVu.value   = nv.TenCV  || nv.MaCV || "Chưa rõ chức vụ";

        } else {
            if (txtHoTen)    txtHoTen.value    = "❌ Không tìm thấy nhân viên";
            if (txtPhongBan) txtPhongBan.value = "─";
            if (txtChucVu)   txtChucVu.value   = "─";
        }
    } catch (error) {
        console.error("Lỗi Bridge WebView2:", error);
    }
}

function chuyenNghiepVu(loai) {
    kieuDon = loai;
    document.getElementById("tabOT").classList.toggle("active", loai === "ot");
    document.getElementById("tabWork").classList.toggle("active", loai === "work");
    document.getElementById("tabLeave").classList.toggle("active", loai === "leave");

    const boxDenNgay = document.getElementById("rowDenNgay");
    const lblTuNgay = document.getElementById("lblTuNgay");
    const lblLyDo = document.getElementById("lblLyDo");

    if (loai === "ot") {
        // Nghiệp vụ OT: Ẩn hàng Ngày kết thúc, nhãn đổi theo thiết kế 1 ngày một
        if (boxDenNgay) boxDenNgay.style.display = "none";
        document.getElementById("dateDen").removeAttribute("required");
        lblTuNgay.innerHTML = "Ngày làm OT (dd/MM/yyyy):";
        lblLyDo.innerHTML = "Nội dung công việc tăng ca:";
        if (pickerDen) pickerDen.clear();
    } else if (loai === "work") {
        if (boxDenNgay) boxDenNgay.style.display = "block";
        document.getElementById("dateDen").setAttribute("required", "required");
        lblTuNgay.innerHTML = "Ngày đi dự kiến (dd/MM/yyyy):";
        lblLyDo.innerHTML = "Địa điểm & Công vụ chi tiết:";
    } else {
        if (boxDenNgay) boxDenNgay.style.display = "block";
        document.getElementById("dateDen").setAttribute("required", "required");
        lblTuNgay.innerHTML = "Nghỉ từ ngày (dd/MM/yyyy):";
        lblLyDo.innerHTML = "Lý do xin nghỉ phép:";
    }
}

async function guiDonDangKy() {
    const maNV = document.getElementById("txtMaNV").value.trim();
    const lyDo = document.getElementById("txtLyDo") ? document.getElementById("txtLyDo").value.trim() : "";
    const dateTuValue = document.getElementById("dateTu").value;
    const dateDenValue = document.getElementById("dateDen").value;

    if (!maNV) { return alert("Vui lòng nhập Mã số nhân viên!"); }
    if (!dateTuValue) { return alert("Vui lòng chọn ngày bắt đầu!"); }

    function convertToIsoDate(str) {
        if (!str) return "";
        const parts = str.split("/");
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`;
        }
        return str;
    }

    let loaiDon = "";
    let denNgay = dateTuValue; // Mặc định ngày kết thúc bằng ngày bắt đầu

    if (kieuDon === "ot") {
        loaiDon = "Đăng ký OT";
        if (string.IsNullOrEmpty(lyDo)) return alert("Vui lòng nhập nội dung công việc tăng ca!");
    } else if (kieuDon === "leave") {
        loaiDon = "Nghỉ phép";
        if (!dateDenValue) return alert("Vui lòng chọn ngày kết thúc!");
        denNgay = dateDenValue;
    } else if (kieuDon === "work") {
        loaiDon = "Công tác";
        if (!dateDenValue) return alert("Vui lòng chọn ngày kết thúc!");
        denNgay = dateDenValue;
    }

    try {
        // Gửi lệnh xuống C# Bridge với ĐÚNG 5 THAM SỐ (Bỏ hoàn toàn soGio)
        const result = await callCSharp("DangKyChucNang", {
            loaiDon: loaiDon,
            maNV: parseInt(maNV),
            tuNgay: convertToIsoDate(dateTuValue),
            denNgay: convertToIsoDate(denNgay),
            thongTinThem: lyDo
        });

        if (result === true) {
            alert("✅ Đơn đăng ký của bạn đã được ghi nhận thành công vào hệ thống!");
            window.location.href = "https://app.assets/danhsachnv.html";
        } else {
            alert("❌ Đăng ký thất bại. Vui lòng kiểm tra lại kết nối SQL Server.");
        }
    } catch (error) {
        alert("Lỗi kết nối WebView2: " + error.message);
    }
}