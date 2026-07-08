// danhsachnv.js

let userSession = null;
let targetEmployeeList = [];

// Map ký hiệu -> text trạng thái hiển thị (từ bảng KH trong DB)
const KY_HIEU_MAP = {
    'X':   { text: 'Đang làm việc',      color: '#2f855a', bg: '#f0fff4' },
    '1/2': { text: 'Làm nửa ngày',       color: '#b7791f', bg: '#fffff0' },
    'P':   { text: 'Nghỉ phép',          color: '#2b6cb0', bg: '#ebf8ff' },
    'L':   { text: 'Nghỉ lễ/Tết',        color: '#2b6cb0', bg: '#ebf8ff' },
    'O':   { text: 'Nghỉ ốm',            color: '#c05621', bg: '#fffaf0' },
    'TS':  { text: 'Nghỉ thai sản',      color: '#97266d', bg: '#fff5f7' },
    'CT':  { text: 'Đang công tác',      color: '#553c9a', bg: '#faf5ff' },
    'K':   { text: 'Nghỉ không lương',   color: '#744210', bg: '#fffff0' },
    'KP':  { text: 'Vắng không phép',    color: '#c53030', bg: '#fff5f5' },
    'NB':  { text: 'Nghỉ bù',            color: '#285e61', bg: '#e6fffa' },
    'TC':  { text: 'Đang tăng ca',       color: '#7c3aed', bg: '#f5f3ff' },
    'H':   { text: 'Hội nghị/Học tập',   color: '#2c7a7b', bg: '#e6fffa' },
    'QC':  { text: 'Chưa chốt công',     color: '#975a16', bg: '#fefcbf' },
    'DC':  { text: 'Đổi ca',             color: '#4a5568', bg: '#edf2f7' },
    'T':   { text: 'Tai nạn lao động',   color: '#c53030', bg: '#fff5f5' },
};

document.addEventListener("DOMContentLoaded", async () => {
    // Đợi kiểm tra quyền hạn và gán session xong mới tải danh sách hệ thống
    await kiemTraQuyenVaDongBoPhongBan();
    await taiDanhSachNhanVienHeThong();

    document.getElementById("txtSearchNhanVien").addEventListener("input", (e) => {
        thucHienLocNhanVienTaiCho(e.target.value.toLowerCase().trim());
    });

    const selectPB = document.getElementById("selectFilterPhongBan");
    if (selectPB) selectPB.addEventListener("change", () => taiDanhSachNhanVienHeThong());

    document.getElementById("btnThemNhanVienMoi").addEventListener("click", () => {
        window.location.href = "https://app.assets/themnv.html";
    });

    document.getElementById("btnQuayVeTrangChu").addEventListener("click", () => {
        window.location.href = "https://app.assets/trangchu.html";
    });
});

async function kiemTraQuyenVaDongBoPhongBan() {
    try {
        if (typeof window.chrome !== 'undefined' && typeof window.chrome.webview !== 'undefined') {
            const res = await callCSharp("LayThongTinSessionHienTai", {});
            
            // Đồng bộ theo xemtoanbo.js: Kiểm tra bóc tách object session chuẩn xác
            if (res) {
                userSession = Array.isArray(res) ? res[0] : res;
            }
        }

        // Nếu không lấy được session thì mặc định gán quyền hạn là 4 (Nhân viên)
        const quyenHan = userSession ? parseInt(userSession.QuyenHan || 4) : 4;
        const divPB  = document.getElementById("divGroupPB");
        const btnAdd = document.getElementById("btnThemNhanVienMoi");

        if (quyenHan <= 2) {
            document.getElementById("lblTieuDeDanhSach").innerText = "Quản Lý Nhân Sự Toàn Công Ty";
            if (divPB) divPB.style.display = "flex";
            if (btnAdd) btnAdd.style.display = "flex";

            let dsPhongBan = null;
            if (typeof window.chrome !== 'undefined' && typeof window.chrome.webview !== 'undefined') {
                dsPhongBan = await callCSharp("LayPB", {});
            }

            // FIX: Khởi tạo mảng phòng ban chứa phần tử lựa chọn "Tất cả" trước tiên
            let danhSachCombo = [{ MaPB: "ALL", TenPB: "── Tất cả phòng ban ──" }];

            // Nếu lấy được danh sách từ Database thì gộp nối tiếp vào sau lựa chọn "ALL"
            if (dsPhongBan && dsPhongBan.length > 0) {
                danhSachCombo = danhSachCombo.concat(dsPhongBan);
            }

            const cmbPB = document.getElementById("selectFilterPhongBan");
            if (cmbPB) {
                cmbPB.innerHTML = "";
                danhSachCombo.forEach(pb => {
                    const opt = document.createElement("option");
                    opt.value = pb.MaPB; 
                    opt.innerText = pb.TenPB;
                    cmbPB.appendChild(opt);
                });
            }

        } else if (quyenHan === 3) {
            document.getElementById("lblTieuDeDanhSach").innerText = `Danh Sách Nhân Viên - ${userSession.TenPB || ''}`;
            if (divPB) divPB.style.display = "none";
            if (btnAdd) btnAdd.style.display = "none";
        }
    } catch (err) {
        console.error("Lỗi phân quyền danh sách nhân viên:", err);
    }
}

async function taiDanhSachNhanVienHeThong() {
    const tbody = document.getElementById("tbodyDanhSachNhanVien");
    if (!tbody) return;
    
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:25px;"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải dữ liệu...</td></tr>`;

    const quyenHan = userSession ? parseInt(userSession.QuyenHan || 4) : 4;
    let filterMaPB = "";

    if (quyenHan <= 2) {
        const cmbPB = document.getElementById("selectFilterPhongBan");
        // Nếu chọn "ALL" thì truyền chuỗi rỗng để C# lấy toàn bộ nhân viên, ngược lại lấy đúng MaPB được chọn
        filterMaPB = cmbPB ? (cmbPB.value === "ALL" ? "" : cmbPB.value) : "";
    } else if (quyenHan === 3) {
        filterMaPB = userSession.MaPB || "";
    } else {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#e53e3e;padding:25px;">❌ Bạn không có quyền truy cập danh sách nhân viên.</td></tr>`;
        return;
    }

    try {
        let rawData = null;
        if (typeof window.chrome !== 'undefined' && typeof window.chrome.webview !== 'undefined') {
            rawData = await callCSharp("LayDanhSachNhanVienTheoQuyen", { maPB: filterMaPB });
        }

        if (!rawData || rawData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#888;padding:25px;">Không có nhân viên nào hoặc lỗi tải dữ liệu từ máy chủ.</td></tr>`;
            targetEmployeeList = [];
            return;
        }

        // Lấy ký hiệu chấm công hôm nay để hiển thị trạng thái động
        const homNay = new Date();
        const thangHN = homNay.getMonth() + 1;
        const namHN   = homNay.getFullYear();
        const ngayHN  = homNay.getDate().toString();

        let kyHieuHomNayMap = {};
        try {
            if (typeof window.chrome !== 'undefined' && typeof window.chrome.webview !== 'undefined') {
                const pivotHomNay = await callCSharp("LayBangCongTongHopPivot", {
                    thang: thangHN,
                    nam: namHN,
                    maPB: filterMaPB
                });
                if (pivotHomNay && pivotHomNay.length > 0) {
                    pivotHomNay.forEach(row => {
                        kyHieuHomNayMap[row.MaNV] = row[ngayHN] || "";
                    });
                }
            }
        } catch (e) {
            console.warn("Không lấy được ký hiệu chấm công hôm nay:", e);
        }

        // Gắn ký hiệu hôm nay vào từng đối tượng nhân viên
        rawData.forEach(nv => {
            nv._kyHieuHomNay = kyHieuHomNayMap[nv.MaNV] || "";
        });

        rawData.sort((a, b) => parseInt(a.MaNV) - parseInt(b.MaNV));

        targetEmployeeList = rawData;
        hienThiDuLieuLenBang(targetEmployeeList);
    } catch (e) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:red;padding:25px;">💥 Lỗi tải dữ liệu: ${e.message}</td></tr>`;
    }
}

function hienThiDuLieuLenBang(dataList) {
    const tbody = document.getElementById("tbodyDanhSachNhanVien");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (!dataList || dataList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#888;padding:25px;">Không tìm thấy nhân viên nào phù hợp!</td></tr>`;
        return;
    }

    const currentRole = userSession ? parseInt(userSession.QuyenHan || userSession.quyenHan || userSession.quyenhan || 4) : 4;

    dataList.forEach(nv => {
        const tr = document.createElement("tr");

        // 1. Lấy TÊN CHỨC VỤ THẬT từ database (Bẫy mọi kiểu chữ viết hoa/thường từ C#)
        const tenChucVuHienThi = nv.TenCV || nv.tenCV || nv.tencv || nv.ChucVu || nv.chucVu || 'Nhân viên';

        // 2. Lấy TÊN PHÒNG BAN an toàn
        const tenPhongBanHienThi = nv.TenPB || nv.tenPB || nv.tenpb || '─';

        // 3. Lấy mã nhân viên, họ tên an toàn
        const maNVHienThi = nv.MaNV || nv.maNV || nv.manv || '';
        const hoTenHienThi = nv.HoTen || nv.hoTen || nv.hoten || '';

        // 4. Lấy quyền hạn để đổ màu sắc cho Badge, nhưng CHỮ BÊN TRONG là Tên chức vụ thật
        const quyenHanNhanVien = nv.QuyenHan || nv.quyenHan || nv.quyenhan || 4;
        let roleBadge = "";

        // Tùy theo quyền hạn mà gán class màu sắc tương ứng (admin: đỏ, hr: lục, manager: lam, staff: xám)
        if (quyenHanNhanVien == 1) {
            roleBadge = `<span class="badge-role admin" style="display:inline-block; font-size:13px; font-weight:600;">${tenChucVuHienThi}</span>`;
        } else if (quyenHanNhanVien == 2) {
            roleBadge = `<span class="badge-role hr" style="display:inline-block; font-size:13px; font-weight:600;">${tenChucVuHienThi}</span>`;
        } else if (quyenHanNhanVien == 3) {
            roleBadge = `<span class="badge-role manager" style="display:inline-block; font-size:13px; font-weight:600;">${tenChucVuHienThi}</span>`;
        } else {
            // Quyền 4 hoặc các quyền khác: Dùng màu xám của nhóm nhân viên thông thường
            roleBadge = `<span class="badge-role staff" style="display:inline-block; font-size:13px; font-weight:600;">${tenChucVuHienThi}</span>`;
        }

        // Trạng thái chấm công từ ký hiệu hôm nay
        const kyHieu = nv._kyHieuHomNay ? nv._kyHieuHomNay.trim() : "";
        let trangThaiHtml = "";
        if (kyHieu && KY_HIEU_MAP[kyHieu]) {
            const tt = KY_HIEU_MAP[kyHieu];
            trangThaiHtml = `<span style="
                display:inline-block;padding:3px 10px;border-radius:20px;font-size:12px;
                font-weight:600;background:${tt.bg};color:${tt.color};border:1px solid ${tt.color}30;
            ">${tt.text}</span>`;
        } else {
            trangThaiHtml = `<span style="color:#a0aec0;font-size:12px;">─ Chưa có dữ liệu ─</span>`;
        }

        // Nút chức năng quản lý theo phân quyền hiện tại của người đăng nhập
        let actionHtml = `<div class="action-buttons">`;
        if (currentRole <= 2) {
            actionHtml += `<button class="btn-action edit" onclick="chuyenTrangChinhSua(${maNVHienThi})"><i class="fa-solid fa-user-gear"></i> Sửa/Xóa</button>`;
        } else {
            actionHtml += `<button class="btn-action edit" style="background-color:#718096;" onclick="chuyenTrangChinhSua(${maNVHienThi})"><i class="fa-solid fa-eye"></i> Xem hồ sơ</button>`;
        }
        actionHtml += `<button class="btn-action register" onclick="chuyenTrangDangKyThuTuc(${maNVHienThi})"><i class="fa-solid fa-file-pen"></i> Đăng ký chế độ</button></div>`;

        // ĐỔ DỮ LIỆU SẠCH: Chỉ còn duy nhất 1 Badge chứa tên chức vụ thật, cực kỳ gọn gàng
        tr.innerHTML = `
            <td style="font-weight:bold;text-align:center;">${maNVHienThi}</td>
            <td style="text-align:left;font-weight:500;">${hoTenHienThi}</td>
            <td>${tenPhongBanHienThi}</td>
            <td style="text-align:center; vertical-align:middle;">
                ${roleBadge}
            </td>
            <td style="text-align:center;">${trangThaiHtml}</td>
            <td>${actionHtml}</td>
        `;
        tbody.appendChild(tr);
    });
}

function thucHienLocNhanVienTaiCho(keyword) {
    if (!keyword) { hienThiDuLieuLenBang(targetEmployeeList); return; }
    const filtered = targetEmployeeList.filter(item =>
        item.MaNV.toString().includes(keyword) ||
        item.HoTen.toLowerCase().includes(keyword) ||
        (item.ChucVu || item.TenCV || "").toLowerCase().includes(keyword)
    );
    hienThiDuLieuLenBang(filtered);
}

function chuyenTrangChinhSua(maNV) {
    window.location.href = `https://app.assets/chinhsuanv.html?action=edit&manv=${maNV}`;
}

function chuyenTrangDangKyThuTuc(maNV) {
    window.location.href = `https://app.assets/dangkychedo.html?manv=${maNV}`;
}