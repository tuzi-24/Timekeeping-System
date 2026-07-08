// chinhsuanv.js
// Chỉnh sửa / Xóa nhân viên — kết nối thực với C# qua callCSharp()

let currentMode = "sua"; // "sua" | "xoa"
let _debounceTimer = null;

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Nạp danh sách Phòng ban và Chức vụ từ DB thực
    await nạpDanhMuc();

    // 2. Đọc tham số URL ?manv=... nếu được chuyển hướng từ trang danh sách
    const params = new URLSearchParams(window.location.search);
    const maNVUrl = params.get("manv");
    if (maNVUrl) {
        document.getElementById("txtMaNV").value = maNVUrl;
        await truyVanNhanVien(maNVUrl);
    }

    // 3. Sự kiện nhập mã NV — debounce 400ms để không gọi C# liên tục
    document.getElementById("txtMaNV").addEventListener("input", (e) => {
        const ma = e.target.value.trim();
        clearTimeout(_debounceTimer);
        _debounceTimer = setTimeout(() => truyVanNhanVien(ma), 400);
    });

    // 4. Submit form
    document.getElementById("frmSuaXoa").addEventListener("submit", async (e) => {
        e.preventDefault();
        await thucHienLuu();
    });
});

// ─── Nạp danh mục PB và CV từ C# / DB ─────────────────────────────────────
async function nạpDanhMuc() {
    try {
        const [dsPB, dsCV] = await Promise.all([
            callCSharp("LayPB", {}),
            callCSharp("LayCV", {})
        ]);

        const selPB = document.getElementById("cboPhongBan");
        const selCV = document.getElementById("cboChucVu");

        // Đổ Phòng ban
        if (dsPB && dsPB.length > 0) {
            dsPB.forEach(pb => {
                const opt = document.createElement("option");
                opt.value = pb.MaPB;
                opt.textContent = pb.TenPB;
                selPB.appendChild(opt);
            });
        }

        // Đổ Chức vụ
        if (dsCV && dsCV.length > 0) {
            dsCV.forEach(cv => {
                const opt = document.createElement("option");
                opt.value = cv.MaCV;
                opt.textContent = cv.TenCV;
                selCV.appendChild(opt);
            });
        }
    } catch (err) {
        console.error("Không tải được danh mục:", err);
    }
}

// ─── Tra cứu nhân viên theo mã, điền vào form ──────────────────────────────
async function truyVanNhanVien(maNVStr) {
    const box    = document.getElementById("boxPreview");
    const txtHoTen  = document.getElementById("txtHoTen");
    const selPB  = document.getElementById("cboPhongBan");
    const selCV  = document.getElementById("cboChucVu");

    // Xóa trắng khi ô trống
    if (!maNVStr) {
        xoaTrangForm();
        box.style.display = "none";
        return;
    }

    const maNVInt = parseInt(maNVStr);
    if (isNaN(maNVInt)) {
        hienThiPreview("error", `⚠️ Mã nhân viên <strong>${maNVStr}</strong> không hợp lệ!`);
        xoaTrangForm();
        return;
    }

    // Hiện spinner đang tìm
    hienThiPreview("loading", `<span class="spinner-inline"></span>Đang tra cứu mã <strong>${maNVStr}</strong>...`);

    try {
        const resTable = await callCSharp("TimNhanVienTheoMa", { maNV: maNVInt });

        if (resTable && resTable.length > 0) {
            const nv = resTable[0];

            // Điền thông tin — chỉ mở khóa tương ứng chế độ hiện tại
            txtHoTen.value = nv.HoTen  || "";
            selPB.value    = nv.MaPB   || "";
            selCV.value    = nv.MaCV   || "";

            // Áp trạng thái khóa/mở theo chế độ
            datTrangThaiInput(currentMode === "xoa");

            const tenPB = selPB.options[selPB.selectedIndex]?.text || nv.MaPB;
            hienThiPreview("success",
                `✅ Tìm thấy: <strong>${nv.HoTen}</strong> — ${tenPB}`);
        } else {
            xoaTrangForm();
            hienThiPreview("error",
                `⚠️ Không tồn tại nhân viên có mã <strong>${maNVStr}</strong> trên hệ thống!`);
        }
    } catch (err) {
        console.error("Lỗi tra cứu nhân viên:", err);
        hienThiPreview("error", "❌ Lỗi kết nối khi tra cứu nhân viên.");
    }
}

// ─── Đổi chế độ Tab ────────────────────────────────────────────────────────
function doiCheDo(kieu) {
    currentMode = kieu;
    const btnSua    = document.getElementById("btnTabSua");
    const btnXoa    = document.getElementById("btnTabXoa");
    const btnSubmit = document.getElementById("btnThucHien");
    const hoTen     = document.getElementById("txtHoTen").value;

    if (kieu === "sua") {
        btnSua.classList.add("active-sua");
        btnXoa.classList.remove("active-xoa");
        btnSubmit.style.backgroundColor = "#0078d4";
        btnSubmit.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Cập nhật hồ sơ`;
        // Mở khóa nếu đã có dữ liệu nhân viên
        if (hoTen) datTrangThaiInput(false);
    } else {
        btnXoa.classList.add("active-xoa");
        btnSua.classList.remove("active-sua");
        btnSubmit.style.backgroundColor = "#e53e3e";
        btnSubmit.innerHTML = `<i class="fa-solid fa-trash-can"></i> Xác nhận xóa bỏ`;
        // Luôn khóa khi xóa
        datTrangThaiInput(true);
    }
}

// ─── Gửi dữ liệu xuống C# ──────────────────────────────────────────────────
async function thucHienLuu() {
    const maNV  = document.getElementById("txtMaNV").value.trim();
    const hoTen = document.getElementById("txtHoTen").value.trim();
    const maPB  = document.getElementById("cboPhongBan").value;
    const maCV  = document.getElementById("cboChucVu").value;

    if (!maNV) return alert("Vui lòng nhập mã nhân viên!");

    // Xác nhận trước khi xóa
    if (currentMode === "xoa") {
        const ok = confirm(`⚠️ Bạn có chắc chắn muốn xóa tài khoản nhân viên mã ${maNV}?\nThao tác này không thể hoàn tác!`);
        if (!ok) return;
    }

    const hanhDong = currentMode === "sua" ? "Sửa thông tin nhân viên" : "Xóa nhân viên";

    try {
        const res = await callCSharp("XuLyNhanVien", {
            hanhDong: hanhDong,
            maNV:     parseInt(maNV),
            hoTen:    hoTen,
            maPB:     maPB,
            maCV:     maCV
        });

        alert("✅ " + (res || "Thao tác thành công!"));
        window.location.href = "https://app.assets/danhsachnv.html";
    } catch (err) {
        alert("❌ Lỗi gửi dữ liệu: " + err.message);
    }
}

// ─── Hàm tiện ích ──────────────────────────────────────────────────────────

function xoaTrangForm() {
    document.getElementById("txtHoTen").value = "";
    document.getElementById("cboPhongBan").value = "";
    document.getElementById("cboChucVu").value = "";
    datTrangThaiInput(true);
}

function datTrangThaiInput(isLock) {
    document.getElementById("txtHoTen").disabled    = isLock;
    document.getElementById("cboPhongBan").disabled = isLock;
    document.getElementById("cboChucVu").disabled   = isLock;
}

function hienThiPreview(loai, html) {
    const box = document.getElementById("boxPreview");
    box.style.display = "flex";
    box.innerHTML = html;

    if (loai === "success") {
        box.style.backgroundColor = "#f0fdf4";
        box.style.borderColor     = "#bbf7d0";
        box.style.color           = "#16a34a";
    } else if (loai === "error") {
        box.style.backgroundColor = "#fff5f5";
        box.style.borderColor     = "#fed7d7";
        box.style.color           = "#c53030";
    } else { // loading
        box.style.backgroundColor = "#ebf8ff";
        box.style.borderColor     = "#bee3f8";
        box.style.color           = "#2b6cb0";
    }
}