// trangchu.js
let currentSessionUser = null;

document.addEventListener("DOMContentLoaded", async () => {
    // Thiết lập ngày tháng hiển thị dạng Tiếng Việt trên thanh tiêu đề
    thietLapThoiGianHienTai();
    
    // Đồng bộ thông tin cá nhân và bảng công lên dashboard
    await taiThongTinDashboard();

    // Gán sự kiện cho nút Đăng xuất trên thanh menu điều hướng
    const btnDangXuat = document.getElementById("btnDangXuat");
    if (btnDangXuat) {
        btnDangXuat.addEventListener("click", async (e) => {
            e.preventDefault();
            if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
                try {
                    await callCSharp("DangXuat");
                    window.location.href = "https://app.assets/dangnhap.html";
                } catch (err) {
                    console.error(err);
                }
            }
        });
    }

    // Khởi tạo chức năng tìm kiếm gợi ý chức năng nhanh
    khoiTaoTimKiem();

    // Gán sự kiện cho nút Chấm công nhanh (Check-in/Check-out)
    const btnCheckIn = document.getElementById("btnCheckIn");
    if (btnCheckIn) {
        btnCheckIn.addEventListener("click", async () => {
            if (!currentSessionUser) return;
            try {
                showNotification("", "");
                const res = await callCSharp("ChamCong", { maNV: currentSessionUser.MaNV });
                if (res) {
                    showNotification("SUCCESS", `✔️ Ghi nhận dữ liệu chấm công thành công!`);
                    await taiBangLichSu(currentSessionUser.MaNV);
                }
            } catch (e) {
                showNotification("ERROR", "💥 Lỗi hệ thống chấm công.");
            }
        });
    }
});

async function taiThongTinDashboard() {
    try {
        // 1. Kiểm tra session đăng nhập hiện hành từ C#
        const session = await callCSharp("LayThongTinSessionHienTai");
        
        if (!session || (!session.MaNV && !session.maNV)) {
            window.location.href = "https://app.assets/dangnhap.html";
            return;
        }

        currentSessionUser = {
            MaNV: session.MaNV || session.maNV,
            HoTen: session.HoTen || session.hoTen,
            QuyenHan: session.QuyenHan || session.quyenHan
        };

        // Đổ tên tài khoản lên góc màn hình chào mừng
        const lblUserGreeting = document.getElementById("lblUserGreeting");
        if (lblUserGreeting) lblUserGreeting.innerText = currentSessionUser.HoTen;

        // Trưởng phòng trở lên (QuyenHan <= 3) hiển thị đầy đủ menu quản lý
        if (currentSessionUser.QuyenHan <= 3) {
            document.querySelectorAll(".id-admin-view").forEach(el => el.style.display = "block");
        }

        // Điền dữ liệu Mã nhân viên lên thẻ thông tin
        if (document.getElementById("lblMaNV")) {
            document.getElementById("lblMaNV").innerText = currentSessionUser.MaNV;
        }

        // 2. Gọi hàm whitelist "TaiThongTinNhanVien" (tên phải đúng case) để lấy chi tiết đối tượng AccountEntity
        const detail = await callCSharp("TaiThongTinNhanVien", { maNV: currentSessionUser.MaNV });
        if (detail) {
            if (document.getElementById("lblPhongBan")) document.getElementById("lblPhongBan").innerText = detail.TenPB || detail.tenPB || "Chưa phân phòng";
            // HTML sử dụng id `lblQuyenHan` cho ô chức vụ trên trang
            if (document.getElementById("lblQuyenHan")) document.getElementById("lblQuyenHan").innerText = detail.TenCV || detail.tenCV || "Nhân viên";

            // Nếu session ban đầu chưa có tên, ưu tiên hiển thị tên đầy đủ từ detail
            const lblUserGreeting = document.getElementById("lblUserGreeting");
            if (lblUserGreeting && (detail.HoTen || detail.hoTen)) lblUserGreeting.innerText = detail.HoTen || detail.hoTen;
            
            const phepConLai = detail.PhepConLai ?? detail.phepConLai ?? 12;
            const tongPhepNam = detail.TongPhepNam ?? detail.tongPhepNam ?? 12;
            if (document.getElementById("lblPhepNam")) {
                document.getElementById("lblPhepNam").innerText = `${phepConLai} / ${tongPhepNam} ngày`;
            }
        }

        // 3. Tải danh sách nhật ký lịch sử chấm công đổ vào table body
        await taiBangLichSu(currentSessionUser.MaNV);

    } catch (error) {
        console.error("Lỗi đồng bộ Dashboard:", error);
    }
}

async function taiBangLichSu(maNV) {
    const tbody = document.getElementById("tableLichSu");
    if (!tbody) return;

    try {
        // Gọi hàm whitelist lấy lịch sử chấm công tháng này của nhân viên
        const now = new Date();
        const list = await callCSharp("LayChiTiet1Nguoi", {
            maNV,
            nam: now.getFullYear(),
            thang: now.getMonth() + 1
        });
        
        console.log("[DEBUG] taiBangLichSu response:", list);
        
        if (!list || list.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #888; padding: 20px;">Chưa có lịch sử chấm công trong tháng này.</td></tr>`;
            return;
        }

        let html = "";
        list.forEach(item => {
            // Định dạng ngày: DD/MM/YYYY
            const ngayDisplay = dinhDangNgayVN(item.Ngay);
            
            // Định dạng giờ vào
            let giovaoDisplay = "--:--:--";
            if (item.Giovao) {
                giovaoDisplay = formatTimeChiHHmm(item.Giovao);
            }
            
            // Định dạng giờ ra
            let gioraDisplay = "--:--:--";
            if (item.Giora) {
                gioraDisplay = formatTimeChiHHmm(item.Giora);
            }
            
            const kyHieuGoc = item.KyHieu ? item.KyHieu.trim() : "";

            //  Ánh xạ Class CSS dựa theo ký hiệu gốc (Bê nguyên logic chuẩn từ lịch sử cá nhân)
            const kyHieuClass = kyHieuGoc === 'X' ? 'badge-x'
                : kyHieuGoc === 'TC' ? 'badge-tc'
                : kyHieuGoc === '1/2' ? 'badge-haft'
                : kyHieuGoc === 'KP' ? 'badge-kp'
                : kyHieuGoc === 'L' ? 'badge-l'
                : kyHieuGoc === 'O' ? 'badge-o'
                : kyHieuGoc === 'TS' ? 'badge-ts'
                : kyHieuGoc === 'CT' ? 'badge-ct'
                : kyHieuGoc === 'NB' ? 'badge-nb'
                : 'badge-p';

            //  Khởi tạo mã HTML ô trạng thái dựa hoàn toàn theo class có sẵn của hệ thống
            let cellTrangThaiHtml = "";
            if (kyHieuGoc) {
                cellTrangThaiHtml = `<span class="symbol-badge ${kyHieuClass}" style="display: inline-block; min-width: 32px; text-align: center;">${kyHieuGoc}</span>`;
            } else {
                cellTrangThaiHtml = `<span style="color:#a0aec0;font-size:12px;">─</span>`;
            }

            //  Ghép chuỗi tạo các dòng hàng cho bảng (Thêm icon đồng bộ)
            html += `
                <tr>
                    <td style="text-align: left; padding-left: 15px;"><strong>${ngayDisplay}</strong></td>
                    <td><i class="fa-regular fa-clock" style="color:#0078d4; margin-right: 6px;"></i>${giovaoDisplay}</td>
                    <td><i class="fa-regular fa-clock" style="color:#666; margin-right: 6px;"></i>${gioraDisplay}</td>
                    <td style="text-align: center; vertical-align: middle; width: 150px; min-width: 150px;">
                        ${cellTrangThaiHtml}
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;

    } catch (err) {
        console.error("[DEBUG] taiBangLichSu error:", err);
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: red; padding: 20px;">Lỗi đồng bộ bảng dữ liệu! ${err.message}</td></tr>`;
    }
}

function formatTimeChiHHmm(timespan) {
    if (!timespan) return "--:--";

    // Nếu là string ISO "HH:mm:ss" hoặc "HH:mm"
    if (typeof timespan === 'string') {
        const parts = timespan.split(':');
        if (parts.length >= 2) {
            return parts[0].padStart(2,'0') + ':' + parts[1].padStart(2,'0');
        }
        return timespan;
    }

    // Nếu là object { hours, minutes, seconds } từ C# TimeSpan
    if (typeof timespan === 'object') {
        const h = String(timespan.hours || 0).padStart(2, '0');
        const m = String(timespan.minutes || 0).padStart(2, '0');
        return `${h}:${m}`;
    }

    return "--:--";
}

function dinhDangNgayVN(chuoiNgay) {
    if (!chuoiNgay) return "";
    const d = new Date(chuoiNgay);
    return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
}

function thietLapThoiGianHienTai() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const lblNgayThang = document.getElementById("lblNgayThang");
    if (lblNgayThang) lblNgayThang.innerText = `Hôm nay, ${new Date().toLocaleDateString('vi-VN', options)}`;
}

function showNotification(resultType, messageText) {
    const msgBox = document.getElementById('msgBox');
    if (!msgBox) return;
    if (resultType === "SUCCESS") { msgBox.className = "alert-message success"; msgBox.innerHTML = messageText; }
    else if (resultType === "ERROR") { msgBox.className = "alert-message error"; msgBox.innerHTML = messageText; }
    else { msgBox.className = ""; msgBox.innerHTML = ""; }
}

// CHỨC NĂNG TÌM KIẾM GỢI Ý NHANH
function khoiTaoTimKiem() {
    const input = document.getElementById("txtTimKiemChucNang");
    const dropdown = document.getElementById("searchDropdown");
    if (!input || !dropdown) return;

    // Danh sách toàn bộ chức năng trong hệ thống (Giữ nguyên của em)
    const danhSachChucNang = [
        { ten: "Trang tổng quan",       icon: "fa-chart-pie",       url: "#" },
        { ten: "Lịch sử cá nhân",       icon: "fa-fingerprint",     url: "https://app.assets/lichsucanhan.html" },
        { ten: "Danh sách nhân viên",   icon: "fa-users",           url: "https://app.assets/danhsachnv.html",   canBoTroLen: true },
        { ten: "Xem toàn bộ công",      icon: "fa-calendar-days",   url: "https://app.assets/xemtoanbo.html",     canBoTroLen: true },
        { ten: "Bảng ký hiệu công",     icon: "fa-tags",            url: "https://app.assets/kyhieu.html" },
        { ten: "Đổi mật khẩu",          icon: "fa-key",             url: "https://app.assets/doimatkhau.html" },
        { ten: "Đăng xuất",             icon: "fa-right-from-bracket", url: null, action: "dangxuat" },
    ];

    // Biến lưu vị trí dòng đang chọn bằng bàn phím (-1 nghĩa là chưa chọn dòng nào)
    let indexHienTai = -1;

    function hienThiGoiY(tuKhoa) {
        // Reset lại vị trí phím bấm mỗi khi người dùng gõ từ khóa mới
        indexHienTai = -1; 

        const kq = danhSachChucNang.filter(cf => {
            // Lọc theo quyền: chức năng cần quyền cao chỉ hiện nếu user đủ quyền
            if (cf.canBoTroLen && (!currentSessionUser || currentSessionUser.QuyenHan > 3)) return false;
            return cf.ten.toLowerCase().includes(tuKhoa.toLowerCase());
        });

        if (tuKhoa === "" || kq.length === 0) {
            dropdown.style.display = "none";
            dropdown.innerHTML = "";
            return;
        }

        dropdown.innerHTML = kq.map(cf => `
            <div class="search-item" data-url="${cf.url || ''}" data-action="${cf.action || ''}">
                <i class="fa-solid ${cf.icon}" style="width:18px; color:#0078d4;"></i>
                <span>${cf.ten}</span>
            </div>
        `).join("");
        dropdown.style.display = "block";

        // Gán sự kiện click cho từng gợi ý bằng chuột (Giữ nguyên logic của em)
        dropdown.querySelectorAll(".search-item").forEach(item => {
            item.addEventListener("click", async () => {
                await thucThiHucNang(item);
            });
        });
    }

    // Tách riêng hàm thực thi chức năng để cả Click chuột và phím Enter đều dùng chung được
    async function thucThiHucNang(item) {
        const action = item.dataset.action;
        const url    = item.dataset.url;

        if (action === "dangxuat") {
            if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
                try { await callCSharp("DangXuat"); } catch (_) {}
                window.location.href = "https://app.assets/dangnhap.html";
            }
        } else if (url && url !== "#") {
            window.location.href = url;
        } else {
            // Đang ở trang chủ rồi, chỉ đóng dropdown
        }
        dropdown.style.display = "none";
        input.value = "";
    }

    // Hàm tô màu dòng được chọn bằng phím và tự động cuộn (scroll)
    function capNhatDongChonPhim(items) {
        items.forEach(item => item.classList.remove("active"));

        if (indexHienTai >= 0 && indexHienTai < items.length) {
            const itemDuocChon = items[indexHienTai];
            itemDuocChon.classList.add("active");
            
            // Tự cuộn màn hình nếu menu dropdown của em có scrollbar dọc
            itemDuocChon.scrollIntoView({ block: "nearest" });
        }
    }

    // Lắng nghe sự kiện gõ phím trên ô tìm kiếm
    input.addEventListener("input", () => hienThiGoiY(input.value.trim()));

    // XỬ LÝ SỰ KIỆN BÀN PHÍM (Lên, Xuống, Enter, Escape)
    input.addEventListener("keydown", (e) => {
        const items = dropdown.querySelectorAll(".search-item");
        
        // Nếu dropdown đang đóng hoặc không có dòng kết quả nào thì bỏ qua
        if (dropdown.style.display === "none" || items.length === 0) return;

        if (e.key === "ArrowDown") {
            // Nhấn mũi tên XUỐNG
            e.preventDefault(); // Chặn hành vi mặc định nhảy con trỏ text
            indexHienTai++;
            if (indexHienTai >= items.length) indexHienTai = 0; // Vòng lại dòng đầu
            capNhatDongChonPhim(items);
        } 
        else if (e.key === "ArrowUp") {
            // Nhấn mũi tên LÊN
            e.preventDefault(); 
            indexHienTai--;
            if (indexHienTai < 0) indexHienTai = items.length - 1; // Vòng lên dòng cuối
            capNhatDongChonPhim(items);
        } 
        else if (e.key === "Enter") {
            // Nhấn phím ENTER
            e.preventDefault();
            if (indexHienTai >= 0 && indexHienTai < items.length) {
                thucThiHucNang(items[indexHienTai]);
            }
        } 
        else if (e.key === "Escape") {
            // Nhấn Escape để đóng dropdown (Giữ nguyên của em)
            dropdown.style.display = "none";
            input.value = "";
        }
    });

    // Click ra ngoài thì đóng dropdown (Giữ nguyên của em)
    document.addEventListener("click", (e) => {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = "none";
        }
    });
}