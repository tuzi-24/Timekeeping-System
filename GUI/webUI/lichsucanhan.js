// lichsucanhan.js

let maNVDangNhap = null;
let quyenHanHienTai = 4; // Mặc định: nhân viên

document.addEventListener("DOMContentLoaded", async () => {
    khoiTaoThanhBoLocThang();
    khoiTaoThanhBoLocNam(10);

    try {
        const responseUser = await callCSharp("LayThongTinSessionHienTai", {});
        console.log("[DEBUG] LayThongTinSessionHienTai response:", responseUser);
        
        if (responseUser) {
            const userInfo = Array.isArray(responseUser) ? responseUser[0] : responseUser;
            if (userInfo) {
                maNVDangNhap = userInfo.MaNV;
                quyenHanHienTai = parseInt(userInfo.QuyenHan || 4);
                console.log("[DEBUG] Loaded: maNV=" + maNVDangNhap + ", quyenHan=" + quyenHanHienTai);

                // Trưởng phòng trở lên (quyền <= 3): hiện thêm menu quản lý
                if (quyenHanHienTai <= 3) {
                    document.querySelectorAll(".menu-manager-only").forEach(el => el.style.display = "block");
                }

                taiLichSuCongChiTiet();
            }
        }
    } catch (error) {
        console.error("[DEBUG] Error loading user:", error);
        showNotification("ERROR", "💥 Không kết nối được phiên làm việc.");
    }

    const btnLoc = document.getElementById("btnLocDuLieu");
    if (btnLoc) {
        btnLoc.addEventListener("click", taiLichSuCongChiTiet);
    }

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

function khoiTaoThanhBoLocThang() {
    const selectThang = document.getElementById("selectThang");
    if (!selectThang) return;
    selectThang.innerHTML = "";
    const thangHienTai = new Date().getMonth() + 1;
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.innerText = `Tháng ${i}`;
        if (i === thangHienTai) option.selected = true;
        selectThang.appendChild(option);
    }
}

function khoiTaoThanhBoLocNam(soNamCanLay = 10) {
    const selectNam = document.getElementById("selectNam");
    if (!selectNam) return;
    selectNam.innerHTML = "";
    const namHienTai = new Date().getFullYear();
    for (let i = 0; i < soNamCanLay; i++) {
        const namTinhDuoc = namHienTai - i;
        const option = document.createElement("option");
        option.value = namTinhDuoc;
        option.innerText = `Năm ${namTinhDuoc}`;
        if (namTinhDuoc === namHienTai) option.selected = true;
        selectNam.appendChild(option);
    }
}

async function taiLichSuCongChiTiet() {
    if (!maNVDangNhap) maNVDangNhap = 1000;

    const selectThang = document.getElementById("selectThang");
    const selectNam = document.getElementById("selectNam");
    if (!selectThang || !selectNam) return;

    const thang = parseInt(selectThang.value);
    const nam = parseInt(selectNam.value);
    const tableBody = document.getElementById("tableChiTietCong");

    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#888;padding:20px;">Đang tải dữ liệu...</td></tr>`;

    try {
        let dataCong = null;
        if (typeof window.chrome !== 'undefined' && typeof window.chrome.webview !== 'undefined') {
            dataCong = await callCSharp("LayChiTiet1Nguoi", {
                maNV: maNVDangNhap,
                thang: thang,
                nam: nam
            });
        }

        if (!dataCong || dataCong.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#888;padding:20px;">Không tìm thấy dữ liệu chấm công của tháng này.</td></tr>`;
            return;
        }

        tableBody.innerHTML = "";

        dataCong.forEach(row => {
            const tr = document.createElement("tr");

            // FIX 1: Định dạng giờ chỉ HH:mm (không hiện giây)
            const giovaoDisplay = formatTimeChiHHmm(row.Giovao);
            const gioraDisplay  = formatTimeChiHHmm(row.Giora);

            // FIX 2: Ngày hiển thị dạng DD/MM/YYYY
            const ngayDisplay = dinhDangNgayVN(row.Ngay);

            const muonText = (row.Dimuon || 0) > 0
                ? `<span class="badge-late">${row.Dimuon} phút</span>`
                : `<span style="color:#718096;">0</span>`;

            const somText = (row.Vesom || 0) > 0
                ? `<span class="badge-late">${row.Vesom} phút</span>`
                : `<span style="color:#718096;">0</span>`;

            const otText = (row.ThoigianOT || 0) > 0
                ? `<span style="color:#7c3aed;font-weight:bold;">${row.ThoigianOT} giờ</span>`
                : `<span style="color:#718096;">0</span>`;

            // FIX 4: Mọi quyền hạn (kể cả nhân viên - quyền 4) đều hiển thị đầy đủ
            // giờ vào/ra, đi muộn, về sớm, OT theo đúng BLL.LayChiTiet1Nguoi
            const kyHieuClass = row.KyHieu === 'X' ? 'badge-x'
                : row.KyHieu === 'TC' ? 'badge-tc'
                : row.KyHieu === '1/2' ? 'badge-haft'
                : row.KyHieu === 'KP' ? 'badge-kp'
                : row.KyHieu === 'L' ? 'badge-l'
                : row.KyHieu === 'O' ? 'badge-o'
                : row.KyHieu === 'TS' ? 'badge-ts'
                : row.KyHieu === 'CT' ? 'badge-ct'
                : row.KyHieu === 'NB' ? 'badge-nb'
                : 'badge-p';

            tr.innerHTML = `
                <td>${ngayDisplay}</td>
                <td><i class="fa-regular fa-clock" style="color:#0078d4;margin-right:4px;"></i>${giovaoDisplay}</td>
                <td><i class="fa-regular fa-clock" style="color:#666;margin-right:4px;"></i>${gioraDisplay}</td>
                <td>${muonText}</td>
                <td>${somText}</td>
                <td>${otText}</td>
                <td><span class="symbol-badge ${kyHieuClass}">${row.KyHieu || ''}</span></td>
            `;
            tableBody.appendChild(tr);
        });

        showNotification("", "");
    } catch (error) {
        showNotification("ERROR", "💥 Lỗi nạp bảng công từ Database: " + error.message);
    }
}

/**
 * FIX 1: Format giờ chỉ hiển thị HH:mm (bỏ giây)
 * Nhận TimeSpan từ C# dạng string "HH:mm:ss" hoặc object {hours, minutes, seconds}
 */
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

/**
 * FIX 1: Ngày hiển thị dạng DD/MM/YYYY
 */
function dinhDangNgayVN(chuoiNgay) {
    if (!chuoiNgay) return "";
    const date = new Date(chuoiNgay);
    if (isNaN(date.getTime())) return chuoiNgay;
    return `${date.getDate().toString().padStart(2,'0')}/${(date.getMonth()+1).toString().padStart(2,'0')}/${date.getFullYear()}`;
}

function showNotification(resultType, messageText) {
    const msgBox = document.getElementById('msgBox');
    if (!msgBox) return;
    if (resultType === "ERROR") {
        msgBox.className = "alert-message error";
        msgBox.innerHTML = messageText;
    } else {
        msgBox.className = "";
        msgBox.innerHTML = "";
    }
}
