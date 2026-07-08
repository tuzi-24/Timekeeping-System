// bieudo.js — Trang phân tích biểu đồ chấm công
"use strict";

// ─── BIẾN TOÀN CỤC ───────────────────────────────────────────────────────────
let chartCot = null, chartTron = null, chartDuong = null, chartNgang = null;
let phanQuyen = { quyenHan: 1, maPB: "" };
let dsNVCache = [];
let _dangKhoiDong = true; // Flag: chặn auto-reload trong lúc khởi động

const COLORS = {
    X:    { bg: 'rgba(43,108,176,0.82)',  border: '#2b6cb0' },
    '1/2':{ bg: 'rgba(221,107,32,0.82)', border: '#dd6b20' },
    P:    { bg: 'rgba(47,133,90,0.82)',   border: '#2f855a' },
    L:    { bg: 'rgba(151,90,22,0.82)',   border: '#975a16' },
    O:    { bg: 'rgba(49,130,206,0.75)',  border: '#3182ce' },
    TS:   { bg: 'rgba(0,128,128,0.75)',   border: '#008080' },
    CT:   { bg: 'rgba(102,153,0,0.75)',   border: '#669900' },
    K:    { bg: 'rgba(113,128,150,0.75)', border: '#718096' },
    KP:   { bg: 'rgba(197,48,48,0.85)',   border: '#c53030' },
    NB:   { bg: 'rgba(74,85,104,0.75)',   border: '#4a5568' },
    TC:   { bg: 'rgba(107,70,193,0.82)',  border: '#6b46c1' },
    H:    { bg: 'rgba(49,151,149,0.75)',  border: '#319795' },
    QC:   { bg: 'rgba(183,121,31,0.75)',  border: '#b7791f' },
    DC:   { bg: 'rgba(56,178,172,0.75)',  border: '#38b2ac' },
    T:    { bg: 'rgba(229,62,62,0.85)',   border: '#e53e3e' },
};

// Style ô ký hiệu (dùng chung toàn file)
const KY_HIEU_STYLE = {
    X:   'color:#2b6cb0;background:#ebf8ff;',
    KP:  'color:#c53030;background:#fff5f5;',
    P:   'color:#2f855a;background:#f0fff4;',
    TC:  'color:#6b46c1;background:#faf5ff;',
    '1/2':'color:#dd6b20;background:#feebc8;',
    L:   'color:#975a16;background:#fefcbf;',
};
function khStyle(kh) {
    return (KY_HIEU_STYLE[kh] || 'color:#4a5568;') + 'font-weight:700;text-align:center;';
}
const mauTyLe = r => r >= 90 ? 'color:#2f855a;font-weight:700;' : r >= 75 ? 'color:#b7791f;font-weight:700;' : 'color:#c53030;font-weight:700;';


// ─── HELPER: NGÀY CUỐI CẦN XỬ LÝ (không vượt quá hôm nay) ──────────────────
function ngayCuoiHienThi(thang, nam) {
    const cuoiThang = new Date(nam, thang, 0).getDate();
    const now = new Date();
    const laTháng = now.getFullYear() === nam && now.getMonth() + 1 === thang;
    return laTháng ? Math.min(cuoiThang, now.getDate()) : cuoiThang;
}

// ─── KHỞI ĐỘNG ────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btnQuayLai")?.addEventListener("click", () => {
        window.location.href = "https://app.assets/xemtoanbo.html";
    });
    document.getElementById("selPhamVi")?.addEventListener("change", e => xuLyThayDoiPhamVi(e.target.value));

    document.getElementById("btnLocBieuDo")?.addEventListener("click", thucHienLocDuLieu);
    napTrangThaiUIBanDau();
});

async function napTrangThaiUIBanDau() {
    try {
        const selPV = document.getElementById("selPhamVi");
        // Đặt giá trị mặc định là toan_cong_ty nếu chưa có
        if (selPV && !selPV.value) selPV.value = 'toan_cong_ty';
        xuLyThayDoiPhamVi(selPV?.value || 'toan_cong_ty');
        await khoiTaoDropdownsBanDau();
        await khoiTaoTimNhanVien();
        // Chỉ tự động phân tích nếu KHÔNG phải chế độ nhân viên (cần chọn NV trước)
        const phamViHienTai = document.getElementById("selPhamVi")?.value || 'toan_cong_ty';
        if (phamViHienTai !== 'nhan_vien') {
            await thucHienLocDuLieu();
        }
        _dangKhoiDong = false; // Mở khoá auto-reload sau khi khởi động xong
    } catch(e) {
        _dangKhoiDong = false;
        console.error("[Biểu đồ] Lỗi khởi động:", e);
    }
}

// ─── KHỞI TẠO THÁNG/NĂM/PHÒNG BAN ───────────────────────────────────────────
async function khoiTaoDropdownsBanDau() {
    khoiTaoSelectThangNam();
    docThamSoURL();
    apDungPhanQuyen();

    const selPB = document.getElementById("selPhongBan");
    let dsPB = [];
    if (typeof window.chrome !== 'undefined' && window.chrome.webview) {
        try { dsPB = await callCSharp("LayPB", {}) || []; } catch(e) {}
    }

    if (phanQuyen.quyenHan === 3 && phanQuyen.maPB) {
        const pb = dsPB.find(p => p.MaPB === phanQuyen.maPB);
        selPB.innerHTML = pb
            ? `<option value="${pb.MaPB}">${pb.TenPB}</option>`
            : `<option value="${phanQuyen.maPB}">${phanQuyen.maPB}</option>`;
        selPB.disabled = true;
    } else {
        selPB.innerHTML = dsPB.map(pb => `<option value="${pb.MaPB}">${pb.TenPB}</option>`).join('');
    }
}

function khoiTaoSelectThangNam() {
    const now = new Date();
    const selT = document.getElementById("selThang");
    const selN = document.getElementById("selNam");
    if (selT && !selT.options.length) {
        for (let t = 1; t <= 12; t++) {
            const o = new Option(`Tháng ${t}`, t);
            if (t === now.getMonth() + 1) o.selected = true;
            selT.appendChild(o);
        }
    }
    if (selN && !selN.options.length) {
        for (let y = now.getFullYear(); y >= now.getFullYear() - 4; y--) {
            const o = new Option(`Năm ${y}`, y);
            if (y === now.getFullYear()) o.selected = true;
            selN.appendChild(o);
        }
    }
}

function docThamSoURL() {
    try {
        const p = new URLSearchParams(window.location.search);
        if (p.get("thang")) document.getElementById("selThang").value = p.get("thang");
        if (p.get("nam"))   document.getElementById("selNam").value   = p.get("nam");
        phanQuyen = {
            quyenHan: parseInt(p.get("quyenhan")) || 1,
            maPB: decodeURIComponent(p.get("mapb") || "")
        };
    } catch(e) {}
}

function apDungPhanQuyen() {
    if (phanQuyen.quyenHan !== 3) return;
    const selPV = document.getElementById("selPhamVi");
    // Trưởng phòng: ẩn option "Toàn công ty", được chọn tự do giữa Phòng ban và Nhân viên
    selPV.querySelector('option[value="toan_cong_ty"]')?.remove();
    selPV.value = "phong_ban";
    selPV.disabled = false; // Cho phép đổi giữa phong_ban ↔ nhan_vien
    document.getElementById("grpPhongBan").style.display = "flex";
}

// Helper: điền tên NV vào ô input + hiện nút X bên trong để xóa
function _dienThongTinNVVaoInput(inp, nv) {
    inp.value         = nv.HoTen;
    inp.dataset.maNV  = nv.MaNV;   
    inp.dataset.maPB  = nv.MaPB;
    inp.style.borderColor = '#2f855a';
    inp.style.boxShadow   = '0 0 0 3px rgba(47,133,90,0.15)';
    inp.style.color       = '#1e293b';
    inp.style.fontWeight  = '600';
    inp.style.paddingRight = '34px'; // chừa chỗ cho nút X

    // Tạo hoặc tái dùng nút X nằm trong wrapper của input
    let btnX = document.getElementById("_btnXtrongInput");

    if (btnX) {
        btnX.style.display = "inline-flex";

        btnX.onclick = () => {
            document.getElementById("selNhanVien").value = "";
            inp.value = "";
            inp.dataset.maNV = "";
            inp.dataset.maPB = "";

            inp.placeholder = "Nhập tên hoặc mã NV...";
            inp.style.borderColor = "";
            inp.style.boxShadow = "";
            inp.style.color = "";
            inp.style.fontWeight = "";

            btnX.style.display = "none";

            const tag = document.getElementById("nvDaChon");
            if (tag) tag.style.display = "none";

            inp.focus();
        };
    }
    btnX.style.display = "inline-flex";
    btnX.onclick = () => {
        document.getElementById("selNhanVien").value = "";
        inp.value = "";
        inp.dataset.maNV = "";
        inp.dataset.maPB = "";
        inp.placeholder = "Nhập tên hoặc mã NV...";
        inp.style.borderColor = "";
        inp.style.boxShadow   = "";
        inp.style.color       = "";
        inp.style.fontWeight  = "";
        inp.style.paddingRight = "";
        btnX.style.display = "none";
        const tag = document.getElementById("nvDaChon");
        if (tag) tag.style.display = "none";
        inp.focus();
    };
}

// ─── TÌM KIẾM NHÂN VIÊN ──────────────────────────────────────────────────────
async function khoiTaoTimNhanVien() {
    if (typeof window.chrome !== 'undefined' && window.chrome.webview) {
        try {
            const now   = new Date();
            const thang = now.getMonth() + 1;
            const nam   = now.getFullYear();

            // Trưởng phòng (quyenHan=3): để C# lọc sẵn theo phòng của họ
            // Admin/HR: truyền maPB rỗng để lấy toàn công ty
            const maPBFilter = (phanQuyen.quyenHan === 3 && phanQuyen.maPB)
                ? phanQuyen.maPB
                : "";

            const pivot = await callCSharp("LayBangCongTongHopPivot", { thang, nam, maPB: maPBFilter }) || [];

            // Log để debug: xem C# trả về field nào trong pivot
            if (pivot.length) {
                console.log("[NV-Cache] Fields từ C#:", Object.keys(pivot[0]));
                console.log("[NV-Cache] Mẫu row:", JSON.stringify(pivot[0]));
            }

            if (pivot.length) {
                const seen = new Set();
                dsNVCache = pivot
                    .filter(r => r.MaNV && !seen.has(r.MaNV) && seen.add(r.MaNV))
                    .map(r => ({
                        MaNV:  r.MaNV,
                        HoTen: r.HoTen || '',
                        MaPB:  r.MaPB  || '',
                        TenPB: r.TenPB || r.MaPB || ''
                    }));
                console.log("[NV-Cache] Đã nạp", dsNVCache.length, "NV | filter:", maPBFilter || "(tất cả)");
                console.log("[NV-Cache] Mẫu cache[0]:", JSON.stringify(dsNVCache[0]));
            }
        } catch(e) {
            console.error("[Biểu đồ] Lỗi tải danh sách NV:", e);
        }
    }

    const inp    = document.getElementById("inputTimNV");
    const btnTim = document.getElementById("btnTimNV");
    const btnXoa = document.getElementById("btnXoaNV");

    // ── Tạo dropdown — dùng position:fixed để thoát stacking context, không bị đè ──
    let dropdown = document.getElementById("nvDropdown");
    if (!dropdown) {
        dropdown = document.createElement("div");
        dropdown.id = "nvDropdown";
        Object.assign(dropdown.style, {
            position: "fixed",           
            background: "#fff",
            border: "1px solid rgba(124,58,237,0.25)",
            borderRadius: "10px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            zIndex: "99999",             
            maxHeight: "220px",
            overflowY: "auto",
            display: "none",
            minWidth: "260px"
        });
        document.body.appendChild(dropdown); 
    }

    // Tính lại vị trí dropdown theo input mỗi lần hiện
    function capNhatViTriDropdown() {
        const rect = inp.getBoundingClientRect();
        dropdown.style.top   = (rect.bottom + 4) + "px";
        dropdown.style.left  = rect.left + "px";
        dropdown.style.width = rect.width + "px";
    }

    function hienDropdown(keyword) {
        dropdown.innerHTML = "";
        if (!keyword) { dropdown.style.display = "none"; return; }
        const asNum = parseInt(keyword);
        // dsNVCache đã được C# lọc sẵn theo phòng (với trưởng phòng) nên dùng thẳng
        const results = dsNVCache.filter(nv =>
            nv.HoTen.toLowerCase().includes(keyword.toLowerCase()) ||
            (!isNaN(asNum) && String(nv.MaNV).startsWith(keyword))
        ).slice(0, 8);

        if (!results.length) {
            dropdown.innerHTML = `<div style="padding:10px 14px;color:#94a3b8;font-size:13px;font-style:italic;">Không tìm thấy nhân viên phù hợp</div>`;
        } else {
            results.forEach(nv => {
                const item = document.createElement("div");
                item.style.cssText = "padding:9px 14px;cursor:pointer;font-size:13px;display:flex;align-items:center;gap:10px;border-bottom:1px solid #f1f5f9;transition:background 0.15s;";
                item.innerHTML = `<span style="background:rgba(124,58,237,0.1);color:#6d28d9;border-radius:6px;padding:2px 8px;font-weight:700;font-size:12px;min-width:36px;text-align:center;">${nv.MaNV}</span><span style="font-weight:600;color:#1e293b;">${nv.HoTen}</span><span style="margin-left:auto;font-size:11px;color:#94a3b8;">${nv.TenPB || nv.MaPB}</span>`;
                item.addEventListener("mouseenter", () => item.style.background = "rgba(124,58,237,0.06)");
                item.addEventListener("mouseleave", () => item.style.background = "");
                item.addEventListener("mousedown", e => { e.preventDefault(); chonNhanVien(nv); });
                dropdown.appendChild(item);
            });
        }
        capNhatViTriDropdown();
        dropdown.style.display = "block";
    }

    function chonNhanVien(nv) {
        document.getElementById("selNhanVien").value = nv.MaNV;
        // Ẩn hoàn toàn chip xác nhận bên dưới
        const tag = document.getElementById("nvDaChon");
        if (tag) tag.style.display = "none";
        // Điền thông tin NV thẳng vào ô input
        _dienThongTinNVVaoInput(inp, nv);
        dropdown.style.display = "none";
        // Tự động phân tích ngay sau khi chọn nhân viên
        thucHienLocDuLieu();
    }

    function xoaChon() {
        document.getElementById("selNhanVien").value = "";
        const tag = document.getElementById("nvDaChon");
        if (tag) tag.style.display = "none";
        const btnX = document.getElementById("_btnXtrongInput");
        if (btnX) btnX.style.display = "none";
        inp.value = "";
        inp.dataset.maNV = "";
        inp.placeholder = "Nhập tên hoặc mã NV...";
        inp.style.borderColor  = "";
        inp.style.boxShadow    = "";
        inp.style.color        = "";
        inp.style.fontWeight   = "";
        inp.style.paddingRight = "";
        dropdown.style.display = "none";
        inp.focus();
    }

    inp?.addEventListener("input", e => {
        document.getElementById("selNhanVien").value = "";
        const tag = document.getElementById("nvDaChon");
        if (tag) tag.style.display = "none";
        inp.style.borderColor = "";
        inp.style.boxShadow   = "";
        inp.style.color       = "";
        inp.style.fontWeight  = "";
        hienDropdown(e.target.value.trim());
    });
    inp?.addEventListener("keydown", e => {
        if (e.key === "Escape") dropdown.style.display = "none";
        if (e.key === "Enter")  { e.preventDefault(); xuLyTimNV(); }
    });
    inp?.addEventListener("blur",  () => setTimeout(() => dropdown.style.display = "none", 150));
    inp?.addEventListener("focus", () => { if (inp.value.trim()) hienDropdown(inp.value.trim()); });
    // Cập nhật vị trí khi scroll/resize (dropdown dùng fixed)
    window.addEventListener("scroll", () => { if (dropdown.style.display !== "none") capNhatViTriDropdown(); }, true);
    window.addEventListener("resize", () => { if (dropdown.style.display !== "none") capNhatViTriDropdown(); });

    btnTim?.addEventListener("click", xuLyTimNV);
    btnXoa?.addEventListener("click", xoaChon);
}

function xuLyTimNV() {
    const inp    = document.getElementById("inputTimNV");
    const hidden = document.getElementById("selNhanVien");

    const keyword = inp.value.trim();
    if (!keyword) {
        inp.style.borderColor = '#c53030';
        inp.style.boxShadow   = '0 0 0 3px rgba(197,48,48,0.15)';
        inp.placeholder = "Vui lòng nhập tên hoặc mã NV!";
        inp.focus();
        return;
    }

    // Nếu hidden đã có giá trị hợp lệ (đã chọn từ dropdown) → phân tích ngay
    if (hidden.value && parseInt(hidden.value) > 0) {
        thucHienLocDuLieu();
        return;
    }

    const asNum = parseInt(keyword);
    const found = (!isNaN(asNum) && String(asNum) === keyword)
        ? dsNVCache.find(nv => nv.MaNV === asNum)
        : dsNVCache.find(nv => nv.HoTen.toLowerCase().includes(keyword.toLowerCase()));

    if (!found) {
        inp.style.borderColor = '#c53030';
        inp.style.boxShadow   = '0 0 0 3px rgba(197,48,48,0.15)';
        // Hiển thị lỗi ngay trong input bằng placeholder
        inp.value = '';
        inp.placeholder = `Không tìm thấy: "${keyword}" — thử lại`;
        hidden.value = "";
        return;
    }

    // Điền tên + mã vào ô input theo định dạng "Tên (Mã: X | PB: Y)"
    hidden.value = found.MaNV;
    _dienThongTinNVVaoInput(inp, found);
    thucHienLocDuLieu();
}

// ─── XỬ LÝ ĐỔI PHẠM VI / CHU KỲ ─────────────────────────────────────────────
function xuLyThayDoiPhamVi(val) {
    // Trưởng phòng (quyenHan=3): không cho xem toàn công ty, chỉ chặn option đó thôi
    if (phanQuyen.quyenHan === 3 && val === 'toan_cong_ty') {
        document.getElementById("selPhamVi").value = val = "phong_ban";
    }
    document.getElementById("grpPhongBan").style.display = val === "phong_ban" ? "flex" : "none";
    document.getElementById("grpNhanVien").style.display = val === "nhan_vien" ? "flex" : "none";
    if (val !== "toan_cong_ty") document.getElementById("cardNgang").style.display = "none";
    // Tự động tải lại biểu đồ khi người dùng đổi phạm vi (không kích trong lúc khởi động)
    if (!_dangKhoiDong && val !== 'nhan_vien' && typeof thucHienLocDuLieu === 'function') {
        setTimeout(() => thucHienLocDuLieu(), 50);
    }
}



// ─── HÀM PHÂN TÍCH CHÍNH ─────────────────────────────────────────────────────
async function thucHienLocDuLieu() {
    let phamVi = document.getElementById("selPhamVi").value;
    const chuKy = 'thang';
    const nam   = parseInt(document.getElementById("selNam").value);
    const thang = parseInt(document.getElementById("selThang").value);
    const quy   = 0;
    const maNV  = parseInt(document.getElementById("selNhanVien").value) || 0;

    if (phamVi === 'nhan_vien' && maNV <= 0) {
        const inp = document.getElementById("inputTimNV");
        if (inp) { inp.style.borderColor = '#c53030'; inp.focus(); }
        return;
    }

    let maPB;
    if (phanQuyen.quyenHan === 3) { maPB = phanQuyen.maPB; }
    else maPB = document.getElementById("selPhongBan").value;

    setLoadingState(true);
    try {
        // ── Nhánh riêng cho NV: dùng data dọc từ LayChiTiet1Nguoi ──────────────
        if (phamVi === 'nhan_vien') {
            const allDataNV = await Promise.all(
                [thang].map(t => layDuLieuNhanVien(maNV, t, nam))
            );
            capNhatSubtitle(phamVi, maPB, maNV, chuKy, quy, thang, nam);
            renderTatCaBieuDoNV(allDataNV, chuKy, nam, maNV);
            setLoadingState(false);
            return;
        }

        // ── Nhánh toàn cty / phòng ban ─────────────────────────────────────────
        const allData = await Promise.all(
            [thang].map(async t => ({
                thang: t,
                nam,
                rows: await layDuLieuChamCong(phamVi, maPB, maNV, t, nam)
            }))
        );

        capNhatSubtitle(phamVi, maPB, maNV, chuKy, quy, thang, nam);
        renderTatCaBieuDo(allData, phamVi, chuKy, nam);
    } catch(e) {
        console.error("[Biểu đồ] Lỗi phân tích:", e);
    } finally {
        setLoadingState(false);
    }
}

// ─── TẢI DỮ LIỆU CHẤM CÔNG ───────────────────────────────────────────────────
async function layDuLieuChamCong(phamVi, maPB, maNV, thang, nam) {
    if (typeof window.chrome !== 'undefined' && window.chrome.webview) {
        try {
            // Toàn công ty / phòng ban: lọc bỏ ngày tương lai khỏi từng row
            const rows = await callCSharp("LayBangCongTongHopPivot", {
                thang, nam,
                maPB: phamVi === 'phong_ban' ? maPB : ''
            }) || [];
            const ngayCuoi = ngayCuoiHienThi(thang, nam);
            rows.forEach(row => {
                for (let d = ngayCuoi + 1; d <= 31; d++) delete row[d];
            });
            return rows;
        } catch(e) {
            console.error("[Biểu đồ] Lỗi C#:", e);
            return [];
        }
    }

    // Không có C# → trả về rỗng
    return [];
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const META_FIELDS = new Set(['MaNV','HoTen','TenPB','TongCong','maNV','hoTen','tenPB','tongCong','MaPB','maPB']);
// ─── NHÂN VIÊN: TẢI + RENDER RIÊNG (dùng data dọc từ LayChiTiet1Nguoi) ────────

// Lấy data 1 tháng của 1 NV dạng dọc { thang, nam, tenNV, tenPB, chiTiet[], counts{} }
async function layDuLieuNhanVien(maNV, thang, nam) {
    let chiTiet = [];
    if (typeof window.chrome !== 'undefined' && window.chrome.webview) {
        try {
            chiTiet = await callCSharp("LayChiTiet1Nguoi", { maNV, nam, thang }) || [];
            console.log("[BD-NV] T" + thang + "/" + nam + " -> " + chiTiet.length + " dong, mau: " + JSON.stringify(chiTiet[0] || {}));
        } catch(e) {
            console.error("[BD-NV] Loi goi C#:", e);
        }
    }

    const item0  = chiTiet[0] || {};
    const nvInfo = dsNVCache.find(nv => nv.MaNV === maNV);
    const tenNV  = item0.TenNhanVien || item0.HoTen || nvInfo?.HoTen || "Nhân viên";
    const tenPB  = item0.TenPB || nvInfo?.TenPB || nvInfo?.MaPB || '';

    // Xây map ngày -> KyHieu từ data dọc (dùng field Thu để xác định ngày số)
    // row.Ngay dạng ISO: "2025-06-01T00:00:00" - lấy ngày bằng cách parse chuỗi an toàn
    const ngayMap = {};
    chiTiet.forEach(item => {
        if (!item.Ngay) return;
        // Tách ngày an toàn: ưu tiên lấy từ chuỗi ISO (trước chữ T hoặc khoảng trắng)
        const str = String(item.Ngay);
        let ngaySo = 0;
        const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (isoMatch) {
            const y = parseInt(isoMatch[1]), m = parseInt(isoMatch[2]), d = parseInt(isoMatch[3]);
            if (y === nam && m === thang) ngaySo = d;
        } else {
            // Fallback: thử new Date nhưng dùng UTC để tránh timezone
            const d = new Date(str);
            if (!isNaN(d)) ngaySo = d.getUTCDate(); // UTC an toan hon
        }
        if (ngaySo >= 1 && ngaySo <= 31) {
            ngayMap[ngaySo] = item.KyHieu || "";
        }
    });

    // Tính counts và danh sách ngày theo làm việc thực tế (chỉ đến hôm nay)
    const ngayCuoi = ngayCuoiHienThi(thang, nam);
    const counts   = {};
    const ngayLV   = []; // [{ngay, thu, kh}] - chỉ ngày làm việc (không T7/CN)
    const thuVN    = ['CN','T2','T3','T4','T5','T6','T7'];
    for (let i = 1; i <= ngayCuoi; i++) {
        const dow = new Date(nam, thang - 1, i).getDay();
        if (dow === 0 || dow === 6) continue;
        const kh = (ngayMap[i] && ngayMap[i].trim()) ? ngayMap[i].trim() : 'KP';
        counts[kh] = (counts[kh] || 0) + 1;
        ngayLV.push({ ngay: i, thu: thuVN[dow], kh });
    }

    return { thang, nam, tenNV, tenPB, chiTiet, counts, ngayLV };
}

// ─── RENDER BIỂU ĐỒ CHO NHÂN VIÊN ───────────────────────────────────────────
function renderTatCaBieuDoNV(allDataNV, chuKy, nam, maNV) {
    [chartCot, chartTron, chartDuong, chartNgang].forEach(c => { try { c?.destroy(); } catch(e){} });
    chartCot = chartTron = chartDuong = chartNgang = null;

    // Kiểm tra có data không (chiTiet có thể rỗng nhưng vẫn render vì đã điền KP)
    // Nếu tất cả tháng đều không có ngày làm việc nào → không có gì để vẽ
    const tongNgayLV = allDataNV.reduce((s, d) => s + d.ngayLV.length, 0);
    if (tongNgayLV === 0) { hienThiKhongCoDuLieu(); return; }

    const tenNV = allDataNV[0]?.tenNV || 'Nhân viên';
    const tenPB = allDataNV[0]?.tenPB || '';

    // Tổng counts toàn kỳ
    const totalCounts = {};
    allDataNV.forEach(d => {
        Object.entries(d.counts).forEach(([k, v]) => totalCounts[k] = (totalCounts[k] || 0) + v);
    });

    capNhatKPI(totalCounts);

    // Tiêu đề biểu đồ cột
    const cotTitle = document.getElementById("lblCotTitle");
    if (cotTitle) cotTitle.textContent = `Phân bố ngày công — ${tenNV}${tenPB ? ' (' + tenPB + ')' : ''}`;

    renderBieuDoCot(totalCounts);
    renderBieuDoTron(totalCounts);

    // Biểu đồ đường
    const ctxD = document.getElementById("chartDuong").getContext("2d");
    let labels = [], dsX = [], dsKP = [], dsTC = [];
    if (chuKy === 'thang' && allDataNV.length === 1) {
        const { ngayLV, thang } = allDataNV[0];
        ngayLV.forEach(({ ngay, thu, kh }) => {
            labels.push(ngay + '/' + thang + ' (' + thu + ')');
            dsX.push(kh === 'X' ? 1 : 0);
            dsKP.push(kh === 'KP' ? 1 : 0);
            dsTC.push(kh === 'TC' ? 1 : 0);
        });
        document.getElementById("lblDuongTitle").textContent =
            `Diễn biến chấm công — ${tenNV} — Tháng ${thang}/${nam}`;
    } else {
        allDataNV.forEach(({ thang, counts }) => {
            labels.push('T' + thang);
            dsX.push(counts['X'] || 0);
            dsKP.push(counts['KP'] || 0);
            dsTC.push(counts['TC'] || 0);
        });
        document.getElementById("lblDuongTitle").textContent = `Diễn biến chấm công — ${tenNV} — Năm ${nam}`;
    }
    if (chartDuong) chartDuong.destroy();
    chartDuong = new Chart(ctxD, {
        type: 'line',
        data: { labels, datasets: [
            { label: 'Đi làm (X)',   data: dsX,  borderColor: '#2b6cb0', backgroundColor: 'rgba(43,108,176,0.08)',  tension: 0.38, pointRadius: 4, borderWidth: 2.5, fill: true  },
            { label: 'Vắng KP',      data: dsKP, borderColor: '#c53030', backgroundColor: 'rgba(197,48,48,0.08)',   tension: 0.38, pointRadius: 4, borderWidth: 2,   borderDash: [5,3], fill: false },
            { label: 'Tăng ca (TC)', data: dsTC, borderColor: '#6b46c1', backgroundColor: 'rgba(107,70,193,0.08)',  tension: 0.38, pointRadius: 4, borderWidth: 2,   fill: false },
        ]},
        options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { position: 'top', labels: { font: { size: 11 }, usePointStyle: true, padding: 16, color: '#334155' } },
                tooltip: { callbacks: { label: c => ` ${c.dataset.label}: ${c.parsed.y}` } }
            },
            scales: {
                x: { grid: { color: 'rgba(203,213,225,0.35)' }, ticks: { color: '#64748b', font: { size: 10 }, maxRotation: 45 } },
                y: { beginAtZero: true, max: 1, grid: { color: 'rgba(203,213,225,0.5)' }, ticks: { color: '#64748b', stepSize: 1 } }
            },
            animation: { duration: 700 }
        }
    });

    // Ẩn biểu đồ ngang (chỉ dùng cho toàn cty)
    document.getElementById("cardNgang").style.display = "none";

    // Bảng chi tiết
    const thead = document.getElementById("detailThead");
    const tbody = document.getElementById("detailTbody");
    if (chuKy === 'thang' && allDataNV.length === 1) {
        const t0 = allDataNV[0];
        document.getElementById("lblDetailTitle").textContent =
            `Chi tiết chấm công từng ngày — ${tenNV} — Tháng ${t0.thang}/${nam}`;
        thead.innerHTML = `<tr>
            <th style="width:33%;text-align:center;">Ngày</th>
            <th style="width:33%;text-align:center;">Thứ</th>
            <th style="width:34%;text-align:center;">Ký hiệu</th>
        </tr>`;
        // Đặt table-layout:fixed lên bảng cha để 3 cột đều nhau
        const tbl = thead.closest('table');
        if (tbl) { tbl.style.tableLayout = 'fixed'; tbl.style.width = '100%'; }
        tbody.innerHTML = t0.ngayLV.map(({ ngay, thu, kh }) =>
            `<tr>
                <td style="font-weight:600;text-align:center;">${ngay}/${t0.thang}</td>
                <td style="text-align:center;color:#64748b;">${thu}</td>
                <td style="${khStyle(kh)}">${kh}</td>
            </tr>`
        ).join('') || `<tr><td colspan="3" class="bd-empty-row">Không có ngày làm việc</td></tr>`;
    } else {
        document.getElementById("lblDetailTitle").textContent = `Tóm tắt từng tháng — ${tenNV}`;
        // Reset table-layout về auto cho bảng nhiều cột
        const tbl2 = thead.closest('table');
        if (tbl2) { tbl2.style.tableLayout = ''; tbl2.style.width = ''; }
        thead.innerHTML = `<tr><th>Tháng</th><th>Đi làm (X)</th><th>Nghỉ phép (P)</th><th>Tăng ca (TC)</th><th>Vắng KP</th><th>Tỷ lệ (%)</th></tr>`;
        tbody.innerHTML = allDataNV.map(({ thang, counts }) => {
            const r = tinhTyLeChuyenCan(counts);
            return `<tr>
                <td>Tháng ${thang}/${nam}</td>
                <td>${counts['X'] || 0}</td>
                <td>${counts['P'] || 0}</td>
                <td>${counts['TC'] || 0}</td>
                <td style="color:#c53030;">${counts['KP'] || 0}</td>
                <td style="${mauTyLe(r)}">${r}%</td>
            </tr>`;
        }).join('');
    }
}



// Đếm ký hiệu, chỉ tính ngày <= ngayCuoiHienThi (bỏ ngày tương lai của tháng hiện tại)
function demKyHieu(rows, thang, nam) {
    const ngayCuoi = (thang && nam) ? ngayCuoiHienThi(thang, nam) : 31;
    const counts = {};
    rows.forEach(row => {
        Object.keys(row).forEach(k => {
            if (META_FIELDS.has(k)) return;
            const n = Number(k);
            if (!Number.isInteger(n) || n < 1 || n > 31) return;
            if (n > ngayCuoi) return; // ← bỏ ngày chưa đến
            const kh = (row[k] == null || String(row[k]).trim() === '') ? 'KP' : String(row[k]).trim();
            counts[kh] = (counts[kh] || 0) + 1;
        });
    });
    return counts;
}

function tongHopTheoPhongBan(allData) {
    const pbMap = {};
    allData.forEach(({ thang, nam, rows }) => {
        const ngayCuoi = (thang && nam) ? ngayCuoiHienThi(thang, nam) : 31;
        rows.forEach(row => {
            const pb = row.TenPB || row.tenPB || row.MaPB || row.maPB || 'Khác';
            if (!pbMap[pb]) pbMap[pb] = {};
            Object.keys(row).forEach(k => {
                if (META_FIELDS.has(k)) return;
                const n = Number(k);
                if (!Number.isInteger(n) || n < 1 || n > 31) return;
                if (n > ngayCuoi) return; // ← bỏ ngày chưa đến
                const kh = (row[k] == null || String(row[k]).trim() === '') ? 'KP' : String(row[k]).trim();
                pbMap[pb][kh] = (pbMap[pb][kh] || 0) + 1;
            });
        });
    });
    return pbMap;
}

function tinhTyLeChuyenCan(counts) {
    const diLam = ['X','P','CT','L','TC','H','TS','QC','DC'].reduce((s,k) => s + (counts[k]||0), 0)
                + (counts['1/2']||0) * 0.5 + (counts['O']||0) * 0.5;
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    return total > 0 ? Math.round((diLam / total) * 100) : 0;
}

// ─── KPI ─────────────────────────────────────────────────────────────────────
function capNhatKPI(counts) {
    [['kpiX','X'],['kpiP','P'],['kpiKP','KP'],['kpiTC','TC']].forEach(([id, k]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = (counts[k] || 0).toLocaleString('vi-VN');
    });
    const rate = tinhTyLeChuyenCan(counts);
    const rEl  = document.getElementById('kpiRate');
    if (rEl) {
        rEl.textContent = rate + '%';
        rEl.style.color = rate >= 90 ? '#2f855a' : rate >= 75 ? '#b7791f' : '#c53030';
    }
}

// ─── RENDER TẤT CẢ ───────────────────────────────────────────────────────────
function renderTatCaBieuDo(allData, phamVi, chuKy, nam) {
    [chartCot, chartTron, chartDuong, chartNgang].forEach(c => { try { c?.destroy(); } catch(e){} });
    chartCot = chartTron = chartDuong = chartNgang = null;

    const allRows = allData.flatMap(d => d.rows);
    console.log("[BD] renderTatCaBieuDo - allRows:", allRows.length, "phamVi:", phamVi);
    if (!allRows.length) { hienThiKhongCoDuLieu(); return; }

    // Tổng hợp counts cho KPI/biểu đồ cột/tròn — mỗi tháng tính riêng đúng giới hạn ngày
    const totalCounts = allData.reduce((acc, { thang, nam, rows }) => {
        const c = demKyHieu(rows, thang, nam);
        Object.entries(c).forEach(([k, v]) => acc[k] = (acc[k] || 0) + v);
        return acc;
    }, {});

    // Nếu NV chưa có bất kỳ ký hiệu nào sau khi demKyHieu (không nên xảy ra vì đã điền KP)
    // thì vẫn tiếp tục render (không bail out) — biểu đồ sẽ hiện trống nhưng không crash
    capNhatKPI(totalCounts);

    // Cập nhật tiêu đề biểu đồ cột theo phạm vi
    const cotTitle = document.getElementById("lblCotTitle");
    const hintCot  = document.getElementById("hintCot");
    if (cotTitle) {
        if (phamVi === 'nhan_vien') {
            const tenNV = allRows[0]?.HoTen || '';
            cotTitle.textContent = tenNV ? `Phân bố ngày công — ${tenNV}` : 'Phân bố ngày công — Nhân viên';
            if (hintCot) hintCot.textContent = 'Cột dọc • Số ngày theo từng ký hiệu';
        } else {
            cotTitle.textContent = 'Phân bố ngày công theo ký hiệu';
            if (hintCot) hintCot.textContent = 'Cột dọc • So sánh các loại ký hiệu';
        }
    }

    renderBieuDoCot(totalCounts);
    renderBieuDoTron(totalCounts);
    renderBieuDoDuong(allData, phamVi, chuKy, nam);

    if (phamVi === 'toan_cong_ty') {
        document.getElementById("cardNgang").style.display = "block";
        renderBieuDoNgang(tongHopTheoPhongBan(allData));
    } else {
        document.getElementById("cardNgang").style.display = "none";
    }
    renderBangChiTiet(allData, phamVi);
}

// ─── KHÔNG CÓ DỮ LIỆU ───────────────────────────────────────────────────────
function hienThiKhongCoDuLieu() {
    ['kpiX','kpiP','kpiKP','kpiTC'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '—';
    });
    const rEl = document.getElementById('kpiRate');
    if (rEl) { rEl.textContent = '—'; rEl.style.color = '#94a3b8'; }

    document.getElementById('detailTbody').innerHTML = `<tr><td colspan="8" class="bd-empty-row" style="padding:40px;color:#94a3b8;text-align:center;"><i class="fa-solid fa-circle-info" style="font-size:24px;margin-bottom:8px;display:block;"></i>Không có dữ liệu chấm công trong kỳ này</td></tr>`;
    document.getElementById('detailThead').innerHTML = '';

    ['chartCot','chartTron','chartDuong'].forEach(id => {
        const canvas = document.getElementById(id);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.fillStyle = 'rgba(148,163,184,0.5)';
        ctx.font = '14px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText('Không có dữ liệu', canvas.width / 2, canvas.height / 2);
        ctx.restore();
    });
}

// ─── 1. BIỂU ĐỒ CỘT ─────────────────────────────────────────────────────────
function renderBieuDoCot(counts) {
    const ctx    = document.getElementById("chartCot").getContext("2d");
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 12);
    const labels = sorted.map(([k]) => k);
    const data   = sorted.map(([, v]) => v);
    const bg     = labels.map(k => (COLORS[k] || { bg:     'rgba(160,174,192,0.7)' }).bg);
    const bd     = labels.map(k => (COLORS[k] || { border: '#a0aec0' }).border);

    if (chartCot) chartCot.destroy();
    chartCot = new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets: [{ label: 'Số lượt', data, backgroundColor: bg, borderColor: bd, borderWidth: 2, borderRadius: 6, borderSkipped: false }] },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${c.parsed.y.toLocaleString('vi-VN')} lượt` } } },
            scales: {
                x: { grid: { display: false }, ticks: { font: { weight: '600', size: 12 }, color: '#334155' } },
                y: { beginAtZero: true, grid: { color: 'rgba(203,213,225,0.5)' }, ticks: { color: '#64748b', callback: v => v.toLocaleString('vi-VN') } }
            },
            animation: { duration: 600 }
        }
    });
}

// ─── 2. BIỂU ĐỒ TRÒN ────────────────────────────────────────────────────────
function renderBieuDoTron(counts) {
    const ctx   = document.getElementById("chartTron").getContext("2d");
    const nhom  = {
        'Đi làm (X)':     counts['X']   || 0,
        'Nghỉ phép (P)':  counts['P']   || 0,
        'Tăng ca (TC)':   counts['TC']  || 0,
        'Công tác (CT)':  counts['CT']  || 0,
        'Nửa ngày (1/2)': counts['1/2'] || 0,
        'Nghỉ lễ (L)':    counts['L']   || 0,
        'Vắng KP':        counts['KP']  || 0,
        'Khác': Object.entries(counts).filter(([k]) => !['X','P','TC','CT','1/2','L','KP'].includes(k)).reduce((a,[,v])=>a+v,0)
    };
    const filtered = Object.entries(nhom).filter(([,v]) => v > 0);
    const palette  = ['rgba(43,108,176,0.85)','rgba(47,133,90,0.85)','rgba(107,70,193,0.85)','rgba(102,153,0,0.85)','rgba(221,107,32,0.85)','rgba(151,90,22,0.85)','rgba(197,48,48,0.85)','rgba(160,174,192,0.75)'];

    if (chartTron) chartTron.destroy();
    chartTron = new Chart(ctx, {
        type: 'doughnut',
        data: { labels: filtered.map(([k])=>k), datasets: [{ data: filtered.map(([,v])=>v), backgroundColor: palette.slice(0, filtered.length), borderColor: '#ffffff', borderWidth: 3, hoverOffset: 8 }] },
        options: {
            responsive: true, maintainAspectRatio: false, cutout: '62%',
            plugins: {
                legend: { position: 'bottom', labels: { font: { size: 11 }, color: '#334155', padding: 12, usePointStyle: true } },
                tooltip: { callbacks: { label: c => { const t = c.dataset.data.reduce((a,b)=>a+b,0); return ` ${c.label}: ${c.parsed.toLocaleString('vi-VN')} (${t>0?((c.parsed/t)*100).toFixed(1):0}%)`; } } }
            },
            animation: { animateRotate: true, duration: 700 }
        }
    });
}

// ─── 3. BIỂU ĐỒ ĐƯỜNG ────────────────────────────────────────────────────────
function renderBieuDoDuong(allData, phamVi, chuKy, nam) {
    const ctx = document.getElementById("chartDuong").getContext("2d");
    let labels=[], dsX=[], dsKP=[], dsTC=[], dsRate=[];

    if (chuKy === 'thang' && allData.length === 1) {
        const { rows, thang } = allData[0];
        // FIX: chỉ vẽ đến ngày hiện tại nếu là tháng hiện tại
        const ngayCuoi = ngayCuoiHienThi(thang, nam);
        const isNV = phamVi === 'nhan_vien';
        for (let d = 1; d <= ngayCuoi; d++) {
            const dow = new Date(nam, thang-1, d).getDay();
            if (dow===0||dow===6) continue;
            labels.push(`${d}/${thang}`);
            let cX=0, cKP=0, cTC=0;
            rows.forEach(row => {
                const kh = (row[d]==null||String(row[d]).trim()==='') ? 'KP' : String(row[d]).trim();
                if (kh==='X')  cX++;
                if (kh==='TC') cTC++;
                if (kh==='KP') cKP++;
            });
            dsX.push(cX); dsKP.push(cKP); dsTC.push(cTC);
            // Với NV (rows.length=1): tỷ lệ = 0 hoặc 100 — dùng đúng cX/rows.length
            dsRate.push(rows.length > 0 ? Math.round((cX/rows.length)*100) : 0);
        }
        if (isNV) {
            const tenNV = rows[0]?.HoTen || 'Nhân viên';
            document.getElementById("lblDuongTitle").textContent = `Diễn biến chấm công từng ngày — ${tenNV} — Tháng ${thang}/${nam}`;
        } else {
            document.getElementById("lblDuongTitle").textContent = `Xu hướng chấm công từng ngày — Tháng ${thang}`;
        }
    } else {
        allData.forEach(({ thang, nam, rows }) => {
            labels.push(`T${thang}`);
            const c = demKyHieu(rows, thang, nam);
            dsX.push(c['X']||0); dsKP.push(c['KP']||0); dsTC.push(c['TC']||0);
            dsRate.push(tinhTyLeChuyenCan(c));
        });
        document.getElementById("lblDuongTitle").textContent = `Xu hướng chấm công — Tháng ${thang !== undefined ? thang : ''}/${nam}`;
    }

    if (chartDuong) chartDuong.destroy();
    chartDuong = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets: [
            { label:'Đi làm (X)',       data:dsX,    borderColor:'#2b6cb0', backgroundColor:'rgba(43,108,176,0.08)',  tension:0.38, pointRadius:4, borderWidth:2.5, fill:true,  yAxisID:'yCount' },
            { label:'Vắng KP',          data:dsKP,   borderColor:'#c53030', backgroundColor:'rgba(197,48,48,0.08)',   tension:0.38, pointRadius:4, borderWidth:2,   borderDash:[5,3], fill:false, yAxisID:'yCount' },
            { label:'Tăng ca (TC)',     data:dsTC,   borderColor:'#6b46c1', backgroundColor:'rgba(107,70,193,0.08)',  tension:0.38, pointRadius:4, borderWidth:2,   fill:false, yAxisID:'yCount' },
            { label:'Tỷ lệ có mặt (%)', data:dsRate, borderColor:'#2f855a', backgroundColor:'rgba(47,133,90,0.05)',   tension:0.38, pointRadius:5, borderWidth:2.5, fill:false, yAxisID:'yRate', pointStyle:'triangle' },
        ]},
        options: {
            responsive:true, maintainAspectRatio:false,
            interaction:{ mode:'index', intersect:false },
            plugins: {
                legend:{ position:'top', labels:{ font:{size:11}, usePointStyle:true, padding:16, color:'#334155' } },
                tooltip:{ callbacks:{ label: c => ` ${c.dataset.label}: ${c.parsed.y}${c.dataset.yAxisID==='yRate'?'%':' lượt'}` } }
            },
            scales: {
                x:{ grid:{color:'rgba(203,213,225,0.35)'}, ticks:{color:'#64748b',font:{size:11}} },
                yCount:{ type:'linear', position:'left',  beginAtZero:true, grid:{color:'rgba(203,213,225,0.5)'}, ticks:{color:'#64748b'} },
                yRate:{ type:'linear',  position:'right', min:0, max:100, grid:{drawOnChartArea:false}, ticks:{color:'#2f855a', callback:v=>v+'%'} }
            },
            animation:{ duration:700 }
        }
    });
}

// ─── 4. BIỂU ĐỒ CỘT NGANG ───────────────────────────────────────────────────
function renderBieuDoNgang(pbMap) {
    const cardEl = document.getElementById("cardNgang");
    if (!Object.keys(pbMap).length) { cardEl.style.display = "none"; return; }
    const ctx = document.getElementById("chartNgang").getContext("2d");

    const sorted   = Object.entries(pbMap).map(([pb,counts]) => ({ pb, rate:tinhTyLeChuyenCan(counts), kp:counts['KP']||0 })).sort((a,b)=>b.rate-a.rate);
    const labels   = sorted.map(d => d.pb);
    const rateData = sorted.map(d => d.rate);
    const kpData   = sorted.map(d => d.kp);
    const bgRate   = rateData.map(r => r>=90 ? 'rgba(47,133,90,0.85)' : r>=75 ? 'rgba(183,121,31,0.85)' : 'rgba(197,48,48,0.85)');

    if (chartNgang) chartNgang.destroy();
    chartNgang = new Chart(ctx, {
        type:'bar',
        data:{ labels, datasets:[
            { label:'Tỷ lệ chuyên cần (%)',       data:rateData, backgroundColor:bgRate, borderColor:bgRate.map(c=>c.replace('0.85','1')), borderWidth:2, borderRadius:5, xAxisID:'xRate' },
            { label:'Vắng không phép (lượt)', data:kpData,   backgroundColor:'rgba(197,48,48,0.2)', borderColor:'rgba(197,48,48,0.7)', borderWidth:1.5, borderRadius:4, xAxisID:'xKP' }
        ]},
        options:{
            indexAxis:'y', responsive:true, maintainAspectRatio:false,
            interaction:{mode:'index',intersect:false},
            plugins:{
                legend:{position:'top',labels:{usePointStyle:true,font:{size:11},color:'#334155',padding:16}},
                tooltip:{callbacks:{label:c=>c.datasetIndex===0?` Chuyên cần: ${c.parsed.x}%`:` Vắng KP: ${c.parsed.x} lượt`}}
            },
            scales:{
                y:{ grid:{display:false}, ticks:{color:'#334155',font:{weight:'600',size:12}} },
                xRate:{ type:'linear', position:'top', min:0, max:100, grid:{color:'rgba(203,213,225,0.4)'}, ticks:{color:'#64748b',callback:v=>v+'%'}, title:{display:true,text:'Tỷ lệ chuyên cần',color:'#64748b',font:{size:11}} },
                xKP:{ type:'linear', position:'bottom', beginAtZero:true, grid:{display:false}, ticks:{color:'#c53030',callback:v=>v+' lượt'}, title:{display:true,text:'Vắng không phép',color:'#c53030',font:{size:11}} }
            },
            animation:{duration:600}
        }
    });
}

// ─── 5. BẢNG CHI TIẾT (toàn cty / phòng ban) ────────────────────────────────
function renderBangChiTiet(allData, phamVi) {
    const thead = document.getElementById("detailThead");
    const tbody = document.getElementById("detailTbody");
    document.getElementById("lblDetailTitle").textContent = "Tóm tắt chuyên cần theo phòng ban";
    const pbMap = tongHopTheoPhongBan(allData);
    thead.innerHTML = `<tr><th>Phòng ban</th><th>Đi làm (X)</th><th>Nghỉ phép (P)</th><th>Tăng ca (TC)</th><th>Vắng KP</th><th>Tổng lượt</th><th>Tỷ lệ</th></tr>`;
    tbody.innerHTML = Object.entries(pbMap).sort((a,b) => tinhTyLeChuyenCan(b[1]) - tinhTyLeChuyenCan(a[1])).map(([pb, c]) => {
        const total = Object.values(c).reduce((a, b) => a + b, 0), r = tinhTyLeChuyenCan(c);
        return `<tr><td style="font-weight:600;">${pb}</td><td>${c['X']||0}</td><td>${c['P']||0}</td><td>${c['TC']||0}</td><td style="color:#c53030;">${c['KP']||0}</td><td>${total}</td><td style="${mauTyLe(r)}">${r}%</td></tr>`;
    }).join('');
}

// ─── SUBTITLE & LOADING ───────────────────────────────────────────────────────
function capNhatSubtitle(phamVi, maPB, maNV, chuKy, quy, thang, nam) {
    const el = document.getElementById("lblSubtitle");
    if (!el) return;
    let scope = 'Toàn công ty';
    if (phamVi === 'phong_ban') {
        const opt = document.querySelector(`#selPhongBan option[value="${maPB}"]`);
        scope = opt ? `Phòng: ${opt.textContent}` : `Phòng ${maPB}`;
    } else if (phamVi === 'nhan_vien') {
        // Lấy tên từ cache thay vì chip đã bị ẩn
        const nvInfo = dsNVCache.find(nv => nv.MaNV === maNV);
        const ten = nvInfo ? nvInfo.HoTen : (document.getElementById("nvDaChonTen")?.textContent || '');
        scope = ten ? `NV: ${ten} (Mã: ${maNV})` : `Mã NV: ${maNV}`;
    }
    const period = `Tháng ${thang}/${nam}`;
    el.textContent = `${scope} — ${period}`;
}

function setLoadingState(isLoading) {
    const btn = document.getElementById("btnLocBieuDo");
    if (!btn) return;
    btn.innerHTML = isLoading ? `<i class="fa-solid fa-spinner fa-spin"></i> Đang tải...` : `<i class="fa-solid fa-magnifying-glass"></i> Phân tích`;
    btn.disabled  = isLoading;
}