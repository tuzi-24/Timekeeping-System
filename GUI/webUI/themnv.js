// themnv.js

document.addEventListener("DOMContentLoaded", async () => {
    await taiDanhSachPhongBanVaChucVu();
    document.getElementById("frmThem").addEventListener("submit", async (e) => {
        e.preventDefault();
        await thucHienThemNhanVien();
    });
});

async function taiDanhSachPhongBanVaChucVu() {
    try {
        let dsPhongBan = null;
        let dsChucVu = null;

        if (typeof window.chrome !== 'undefined' && typeof window.chrome.webview !== 'undefined') {
            dsPhongBan = await callCSharp("LayPB", {});
            dsChucVu = await callCSharp("LayCV", {});
        }

        const cboPB = document.getElementById("cboPhongBan");
        cboPB.innerHTML = '<option value="">-- Chọn phòng ban --</option>';
        dsPhongBan.forEach(pb => {
            const opt = document.createElement("option");
            opt.value = pb.MaPB; opt.innerText = pb.TenPB;
            cboPB.appendChild(opt);
        });

        const cboCV = document.getElementById("cboChucVu");
        cboCV.innerHTML = '<option value="">-- Chọn chức vụ --</option>';
        dsChucVu.forEach(cv => {
            const opt = document.createElement("option");
            opt.value = cv.MaCV; opt.innerText = cv.TenCV;
            cboCV.appendChild(opt);
        });

    } catch (err) {
        console.error("Lỗi tải danh mục phòng ban/chức vụ:", err);
    }
}

async function thucHienThemNhanVien() {
    const hoTen = document.getElementById("txtHoTen").value.trim();
    const maPB  = document.getElementById("cboPhongBan").value;
    const maCV  = document.getElementById("cboChucVu").value;

    if (!hoTen) { alert("Vui lòng nhập họ tên nhân viên!"); return; }
    if (!maPB)  { alert("Vui lòng chọn phòng ban!"); return; }
    if (!maCV)  { alert("Vui lòng chọn chức vụ!"); return; }

    try {
        const response = await callCSharp("XuLyNhanVien", { 
            hanhDong: "Thêm nhân viên", 
            maNV: 0,   // không cần khi thêm mới
            hoTen, 
            maPB, 
            maCV 
        });

        if (response !== null) {
            alert(`✅ ${response}`);
            document.getElementById("txtHoTen").value = "";
            document.getElementById("cboPhongBan").value = "";
            document.getElementById("cboChucVu").value = "";
            window.location.href = "https://app.assets/danhsachnv.html";
        } else {
            alert(`[MOCK] Thêm nhân viên "${hoTen}" thành công! (Chế độ xem thử)`);
            window.location.href = "https://app.assets/danhsachnv.html";
        }
    } catch (error) {
        alert("💥 Lỗi khi gửi yêu cầu thêm nhân viên: " + error.message);
    }
}