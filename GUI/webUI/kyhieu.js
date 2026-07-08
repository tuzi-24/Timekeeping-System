// Biến toàn cục lưu giữ thông tin phiên đăng nhập và trạng thái chỉnh sửa giờ
let globalUserSession = null;
let isEditingGioChuan = false; 

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // LẤY SESSION ĐẦU TIÊN: Ép hệ thống đợi nạp xong xuôi dữ liệu tài khoản rồi mới chạy tiếp
        if (typeof window.chrome !== 'undefined' && typeof window.chrome.webview !== 'undefined') {
            globalUserSession = await callCSharp("LayThongTinSessionHienTai", {});
        }
    } catch (err) {
        console.error("Không thể lấy thông tin Session tài khoản:", err);
    }

    // 1. Kiểm tra phân quyền menu thanh điều hướng bên cạnh
    KiemTraQuyenMenuSidebar();

    // 2. Tải danh mục ký hiệu chấm công từ CSDL đổ lên bảng
    taiDanhSachKyHieuCong();

    // 3. Tải giờ làm việc chuẩn hệ thống và thực hiện kiểm tra hiện nút Sửa/Lưu
    taiVaPhanQuyenGioLamViecChuan();

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
});

/**
 * Hàm gọi WinForms C# nạp danh sách ký hiệu động lấy từ Database lên
 */
async function taiDanhSachKyHieuCong() {
    const tbody = document.getElementById("tableKyHieu");
    if (!tbody) return;

    try {
        let listKyHieu = null;

        // Kiểm tra sự tồn tại của môi trường WebView2 WinForms C#
        if (typeof window.chrome !== 'undefined' && typeof window.chrome.webview !== 'undefined') {
            // GỌI ĐÚNG HÀM TRONG C# BLL: Trả về danh sách đối tượng chứa KyHieuCode và TenKyHieu
            listKyHieu = await callCSharp("LayDanhSachKyHieu", {});
        }

        // CHẾ ĐỘ MOCK DATA (Chỉ chạy khi xem thử trên trình duyệt độc lập, lấy đủ các trường hợp)
        if (listKyHieu === null) {
            listKyHieu = [
                { KyHieuCode: "X", TenKyHieu: "Đi làm đủ ngày công (Tính trọn 1 ngày công hưởng lương)" },
                { KyHieuCode: "1/2", TenKyHieu: "Đi làm nửa ngày công (Tính 0.5 ngày công hưởng lương)" },
                { KyHieuCode: "P", TenKyHieu: "Nghỉ phép năm có hưởng lương (Được duyệt theo đơn xin nghỉ)" },
                { KyHieuCode: "TC", TenKyHieu: "Tăng ca / Làm thêm giờ (Hưởng hệ số lương tăng ca tương ứng)" },
                { KyHieuCode: "KP", TenKyHieu: "Nghỉ không phép / Tự ý bỏ việc (Trừ lương ngày làm việc)" },
                { KyHieuCode: "TS", TenKyHieu: "Nghỉ chế độ thai sản (Hưởng trợ cấp bảo hiểm xã hội)" },
                { KyHieuCode: "CT", TenKyHieu: "Đi công tác / Lương tính theo chế độ công tác phí" },
                { KyHieuCode: "Ô", TenKyHieu: "Nghỉ ốm đau hưởng bảo hiểm xã hội (Có giấy xác nhận của bệnh viện)" }
            ];
        }

        if (listKyHieu && listKyHieu.length > 0) {
            tbody.innerHTML = ""; // Xóa dòng thông báo trạng thái tải ban đầu

            // QUÉT QUA TOÀN BỘ DANH SÁCH ĐỘNG TỪ DATA TRẢ VỀ (Có bao nhiêu dòng hiện bấy nhiêu)
            listKyHieu.forEach(item => {
                const tr = document.createElement("tr");

                // Biến định dạng Class CSS màu sắc badge và văn bản mô tả nhanh
                let codeClass = "badge-default";
                let quyDoiText = "Theo quy định";

                // Chuẩn hóa chuỗi mã để so khớp gán màu sắc trực quan (CSS nằm trong style.css)
                const codeUpper = item.KyHieuCode.toUpperCase().trim();

                if (codeUpper === "X") { codeClass = "badge-x"; quyDoiText = "1.0 Ngày công"; }
                else if (codeUpper === "1/2") { codeClass = "badge-half"; quyDoiText = "0.5 Ngày công"; }
                else if (codeUpper === "P") { codeClass = "badge-p"; quyDoiText = "1.0 Ngày công (Phép)"; }
                else if (codeUpper === "TC") { codeClass = "badge-tc"; quyDoiText = "Tính giờ tăng ca"; }
                else if (codeUpper === "KP") { codeClass = "badge-kp"; quyDoiText = "0 Ngày công"; }
                else if (codeUpper === "TS") { codeClass = "badge-p"; quyDoiText = "Chế độ thai sản"; } 
                else if (codeUpper === "CT") { codeClass = "badge-x"; quyDoiText = "Tính công công tác"; } 

                tr.innerHTML = `
                    <td class="text-center">
                        <span class="symbol-badge ${codeClass}">${item.KyHieuCode}</span>
                    </td>
                    <td><strong class="text-bold">${item.TenKyHieu}</strong></td>
                    <td class="text-center text-quy-doi">${quyDoiText}</td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            tbody.innerHTML = `<tr><td colspan="3" class="padding-loading">Không tìm thấy dữ liệu danh mục ký hiệu công.</td></tr>`;
        }

    } catch (error) {
        console.error("Lỗi thực thi hàm taiDanhSachKyHieuCong:", error);
        tbody.innerHTML = `<tr><td colspan="3" class="text-center" style="color: red; padding: 20px;">💥 Lỗi đồng bộ dữ liệu: ${error.message}</td></tr>`;
    }
}


/**
 * Tải dữ liệu giờ chuẩn, thực hiện phân quyền Xem/Sửa và cài đặt logic đổi nút trực tiếp tại chỗ
 */
async function taiVaPhanQuyenGioLamViecChuan() {
    const txtVao      = document.getElementById("txtGioVaoChuan");
    const txtRa       = document.getElementById("txtGioRaChuan");
    const areaHanhDong = document.getElementById("areaHanhDongGioChuan");
    const btnThaoTac  = document.getElementById("btnThaoTacGioChuan");
    const btnHuy      = document.getElementById("btnHuyGioChuan");   // Có sẵn trong HTML

    if (!txtVao || !txtRa || !areaHanhDong || !btnThaoTac) return;

    // Lưu giá trị gốc để phục hồi khi Hủy
    let gioVaoGoc = txtVao.value || "08:00";
    let gioRaGoc  = txtRa.value  || "17:00";

    // Regex kiểm tra định dạng HH:mm
    const regexTime = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

    // --- Về chế độ CHỈ XEM ---
    function veCheDoCHIXEM() {
        isEditingGioChuan = false;
        txtVao.readOnly = true;
        txtRa.readOnly  = true;
        const styleView = "width:70px;text-align:center;padding:6px;border:1px solid #cbd5e0;border-radius:6px;font-size:14px;font-weight:bold;background-color:#f7fafc;color:#4a5568;transition:all 0.2s;";
        txtVao.style.cssText = styleView;
        txtRa.style.cssText  = styleView;
        btnThaoTac.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Sửa`;
        btnThaoTac.style.backgroundColor = "#3182ce";
        if (btnHuy) btnHuy.style.display = "none";
    }

    // --- Về chế độ ĐANG CHỈNH SỬA ---
    function veCheDoCHINHSUA() {
        isEditingGioChuan = true;
        gioVaoGoc = txtVao.value;
        gioRaGoc  = txtRa.value;
        txtVao.readOnly = false;
        txtRa.readOnly  = false;
        const styleEdit = "width:70px;text-align:center;padding:6px;border:1.5px solid #3182ce;border-radius:6px;font-size:14px;font-weight:bold;background-color:#ffffff;color:#1a202c;transition:all 0.2s;box-shadow:0 0 0 3px rgba(66,153,225,0.35);";
        txtVao.style.cssText = styleEdit;
        txtRa.style.cssText  = styleEdit;
        btnThaoTac.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Lưu`;
        btnThaoTac.style.backgroundColor = "#38a169";
        if (btnHuy) btnHuy.style.display = "inline-flex";
    }

    try {
        // ✅ FIX: Đúng tên hàm C# — dùng "GetCaLamviec"
        const caLamViec = await callCSharp("GetCaLamviec", {});
        if (caLamViec) {
            txtVao.value = caLamViec.GioVaoChuan ? caLamViec.GioVaoChuan.substring(0, 5) : "08:00";
            txtRa.value  = caLamViec.GioRaChuan  ? caLamViec.GioRaChuan.substring(0, 5)  : "17:00";
        }
        gioVaoGoc = txtVao.value;
        gioRaGoc  = txtRa.value;

        const quyenHan = globalUserSession ? parseInt(globalUserSession.QuyenHan) : 4;

        if (quyenHan <= 2) {
            areaHanhDong.style.display = "flex";

            // Nút Hủy: phục hồi giá trị gốc và về chế độ xem
            if (btnHuy) {
                btnHuy.style.display = "none"; // Ẩn lúc đầu
                btnHuy.onclick = () => {
                    txtVao.value = gioVaoGoc;
                    txtRa.value  = gioRaGoc;
                    veCheDoCHIXEM();
                };
            }

            // Validate realtime khi gõ
            [txtVao, txtRa].forEach(input => {
                input.addEventListener("input", () => {
                    if (!isEditingGioChuan) return;
                    const ok = regexTime.test(input.value.trim());
                    input.style.borderColor = ok ? "#3182ce" : "#e53e3e";
                    input.style.boxShadow   = ok
                        ? "0 0 0 3px rgba(66,153,225,0.35)"
                        : "0 0 0 3px rgba(229,62,62,0.25)";
                });
            });

            btnThaoTac.onclick = async () => {
                if (!isEditingGioChuan) {
                    // BẤM NÚT SỬA
                    veCheDoCHINHSUA();
                } else {
                    // BẤM NÚT LƯU
                    const gioVaoMoi = txtVao.value.trim();
                    const gioRaMoi  = txtRa.value.trim();

                    if (!regexTime.test(gioVaoMoi) || !regexTime.test(gioRaMoi)) {
                        alert("Định dạng giờ không đúng! Vui lòng nhập đúng dạng HH:mm (Ví dụ: 08:30).");
                        return;
                    }

                    const confirmed = confirm(`Xác nhận thay đổi giờ làm việc chuẩn thành:\nGiờ vào: ${gioVaoMoi}   —   Giờ ra: ${gioRaMoi}`);
                    if (!confirmed) return; // Giữ form đang mở

                    try {
                        // ✅ FIX: Đúng tên hàm C# — dùng "UpdateCaLamviec"
                        const response = await callCSharp("UpdateCaLamviec", {
                            gioVao: gioVaoMoi,
                            gioRa:  gioRaMoi
                        });

                        if (response === null) {
                            // Chạy ngoài WebView2 (Live Preview)
                            alert("Đã cập nhật giờ làm việc chuẩn.");
                        } else if (response.Item1 === true) {
                            alert(response.Item2 || "Cập nhật thành công!");
                        } else {
                            alert("❌ " + (response.Item2 || "Cập nhật thất bại, vui lòng thử lại."));
                            return; // Giữ form mở
                        }

                        gioVaoGoc = gioVaoMoi;
                        gioRaGoc  = gioRaMoi;
                        veCheDoCHIXEM();

                    } catch (errSave) {
                        alert("💥 Lỗi kết nối: " + errSave.message);
                    }
                }
            };
        } else {
            areaHanhDong.style.display = "none";
        }
    } catch (e) {
        console.error("Lỗi đồng bộ nạp thông tin giờ làm việc chuẩn:", e);
    }
}
/**
 * Kiểm tra thông tin Session để ẩn/hiện Sidebar đồng bộ
 */
function KiemTraQuyenMenuSidebar() {
    try {
        const quyenHan = globalUserSession ? parseInt(globalUserSession.QuyenHan) : 4; 
        const adminMenus = document.querySelectorAll(".id-admin-view");
        
        if (quyenHan <= 3) {
            adminMenus.forEach(menu => menu.style.display = "block");
        } else {
            adminMenus.forEach(menu => menu.style.display = "none");
        }
    } catch (e) {
        console.error("Lỗi phân quyền menu sidebar danh mục ký hiệu:", e);
    }
}