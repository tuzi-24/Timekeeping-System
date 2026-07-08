// xemtoanbo.js

let currentManagerUser = null;
let rootPivotData = [];

document.addEventListener("DOMContentLoaded", async () => {
    khoiTaoThangNamOption();
    await dongBoThongTinQuanLyVaPhongBan();
    await xuLyNapDuLieuHeThong();

    document.getElementById("btnLocToanBo").addEventListener("click", async () => {
        await xuLyNapDuLieuHeThong();
    });

    document.getElementById("selectThang").addEventListener("change", async () => {
        await xuLyNapDuLieuHeThong();
    });

    document.getElementById("selectNam").addEventListener("change", async () => {
        await xuLyNapDuLieuHeThong();
    });

    document.getElementById("txtTimKiemNhanVien").addEventListener("input", async (e) => {
        const keyword = e.target.value.trim();
        if (keyword === "") {
            dungGiaoDienLuoiPivot(rootPivotData);
        } else {
            await xuLyNapDuLieuHeThong();
        }
    });

   const btnXemBieuDo = document.getElementById("btnXemBieuDo");
    if (btnXemBieuDo) {
        btnXemBieuDo.addEventListener("click", () => {
            const thangSelected = document.getElementById("selectThang").value;
            const namSelected   = document.getElementById("selectNam").value;

            // Truyền thông tin phân quyền sang trang biểu đồ
            let quyenHan = 1;   // Mặc định: admin/GĐ — xem được tất cả
            let maPB     = "";  // Rỗng = không giới hạn phòng ban

            if (currentManagerUser) {
                quyenHan = parseInt(currentManagerUser.QuyenHan) || 1;
                maPB     = currentManagerUser.MaPB || "";
            }

        window.location.href = `https://app.assets/bieudo.html?thang=${thangSelected}&nam=${namSelected}&quyenhan=${quyenHan}&mapb=${encodeURIComponent(maPB)}`;        });
    }

    document.getElementById("btnXuatExcel").addEventListener("click", () => {
        xuatExcelTuTable();
    });

    document.getElementById("btnQuayLaiTrangChu").addEventListener("click", () => {
        window.location.href = "https://app.assets/trangchu.html";
    });
});

function khoiTaoThangNamOption() {
    const selectThang = document.getElementById("selectThang");
    const selectNam = document.getElementById("selectNam");
    const dateHienTai = new Date();

    for (let t = 1; t <= 12; t++) {
        const opt = document.createElement("option");
        opt.value = t; opt.innerText = `Tháng ${t}`;
        if (t === (dateHienTai.getMonth() + 1)) opt.selected = true;
        selectThang.appendChild(opt);
    }
    for (let n = dateHienTai.getFullYear(); n >= dateHienTai.getFullYear() - 3; n--) {
        const opt = document.createElement("option");
        opt.value = n; opt.innerText = `Năm ${n}`;
        if (n === dateHienTai.getFullYear()) opt.selected = true;
        selectNam.appendChild(opt);
    }
}

async function dongBoThongTinQuanLyVaPhongBan() {
    try {
        let responseUser = null;
        if (typeof window.chrome !== 'undefined' && typeof window.chrome.webview !== 'undefined') {
            responseUser = await callCSharp("LayThongTinSessionHienTai", {});
        }

        if (responseUser) {
            currentManagerUser = responseUser;
            const quyenHan = parseInt(currentManagerUser.QuyenHan);

            const divPB = document.getElementById("divGropPhongBan");
            const selectPB = document.getElementById("selectPhongBan");

            if (quyenHan <= 2) {
                document.getElementById("lblTieuDeXemCong").innerText = "Bảng Công Toàn Công Ty";
                if (divPB) divPB.style.display = "flex";

                let dsPhongBan = null;
                if (typeof window.chrome !== 'undefined' && typeof window.chrome.webview !== 'undefined') {
                    dsPhongBan = await callCSharp("LayPB", {});
                }

                if (!dsPhongBan || dsPhongBan.length === 0) dsPhongBan = [];

                if (selectPB) {
                    selectPB.innerHTML = `<option value="ALL">── Tất cả phòng ban ──</option>`;
                    dsPhongBan.forEach(pb => {
                        const opt = document.createElement("option");
                        opt.value = pb.MaPB; opt.innerText = pb.TenPB;
                        selectPB.appendChild(opt);
                    });
                }
            } else if (quyenHan === 3) {
                document.getElementById("lblTieuDeXemCong").innerText = `Bảng Công - ${currentManagerUser.TenPB}`;
                document.getElementById("lblMoTaXemCong").innerText = `Hệ thống hiển thị danh sách nhân viên trực thuộc quản lý của phòng ban.`;
                if (divPB) divPB.style.display = "none";
            }
        }
    } catch (e) {
        console.error("Lỗi đồng bộ phân quyền:", e);
    }
}

async function xuLyNapDuLieuHeThong() {
    const thead = document.querySelector("#mainTablePivot thead");
    const tbody = document.getElementById("tableToanBoCong");

    const thangSelected = parseInt(document.getElementById("selectThang").value);
    const namSelected   = parseInt(document.getElementById("selectNam").value);
    const keyword       = document.getElementById("txtTimKiemNhanVien").value.trim();

    let filterMaPB = "";
    if (currentManagerUser) {
        if (parseInt(currentManagerUser.QuyenHan) <= 2) {
            const cmbPB = document.getElementById("selectPhongBan");
            filterMaPB = cmbPB && cmbPB.value !== "ALL" ? cmbPB.value : "";
        } else {
            filterMaPB = currentManagerUser.MaPB;
        }
    }

    tbody.innerHTML = `<tr><td colspan="35" style="text-align:center; padding:30px; color:#718096;"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải dữ liệu chấm công...</td></tr>`;

    try {
        // Tìm 1 người theo mã NV (số)
        if (keyword !== "") {
            let chiTietData = null;

            if (typeof window.chrome !== 'undefined' && typeof window.chrome.webview !== 'undefined') {
                const maNVSearch = parseInt(keyword);
                if (!isNaN(maNVSearch)) {
                    // FIX 4: gọi đúng BLL LayChiTiet1Nguoi(maNV, nam, thang)
                    chiTietData = await callCSharp("LayChiTiet1Nguoi", {
                        maNV: maNVSearch,
                        thang: thangSelected,
                        nam: namSelected
                    });
                } else {
                    // Tìm theo tên: lấy pivot rồi lọc JS
                    const pivotAll = await callCSharp("LayBangCongTongHopPivot", {
                        thang: thangSelected,
                        nam: namSelected,
                        maPB: filterMaPB
                    });
                    if (pivotAll && pivotAll.length > 0) {
                        const match = pivotAll.find(r => r.HoTen && r.HoTen.toLowerCase().includes(keyword.toLowerCase()));
                        if (match) {
                            chiTietData = await callCSharp("LayChiTiet1Nguoi", {
                                maNV: match.MaNV,
                                thang: thangSelected,
                                nam: namSelected
                            });
                        }
                    }
                }
            }

            if (!chiTietData || chiTietData.length === 0) {
                tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:#e53e3e;padding:30px;">⚠️ Không tìm thấy dữ liệu chấm công cho nhân viên này.</td></tr>`;
            } else {
                dungGiaoDienChiTiet1Nguoi(chiTietData);
            }
        } else {
            // Bảng Pivot nhiều người
            let pivotData = null;
            if (typeof window.chrome !== 'undefined' && typeof window.chrome.webview !== 'undefined') {
                pivotData = await callCSharp("LayBangCongTongHopPivot", {
                    thang: thangSelected,
                    nam: namSelected,
                    maPB: filterMaPB
                });
            }

            if (!pivotData || pivotData.length === 0) {
                tbody.innerHTML = `<tr><td colspan="35" style="text-align:center;color:#718096;padding:30px;">📭 Không có dữ liệu chấm công cho tháng/năm này.</td></tr>`;
            } else {
                rootPivotData = pivotData;
                dungGiaoDienLuoiPivot(rootPivotData);
            }
        }
    } catch (error) {
        console.error(error);
        tbody.innerHTML = `<tr><td colspan="35" style="text-align:center; color:#e53e3e; padding:30px;">💥 Lỗi hệ thống: ${error.message}</td></tr>`;
    }
}

// Bảng dọc chi tiết 1 người 
function dungGiaoDienChiTiet1Nguoi(dataList) {
    const thead = document.querySelector("#mainTablePivot thead");
    const tbody = document.getElementById("tableToanBoCong");

    if (!dataList || dataList.length === 0) {
        thead.innerHTML = `<tr><th style="padding:12px;">Thông báo</th></tr>`;
        tbody.innerHTML = `<tr><td style="text-align:center; color:#a0aec0; padding:30px;">Không tìm thấy lịch sử chi tiết của nhân viên này!</td></tr>`;
        return;
    }

    // Lấy thông tin nhân viên từ dòng đầu
    const firstRow = dataList[0];
    const tenNV  = firstRow.TenNhanVien || firstRow.HoTen || "";
    const tenPB  = firstRow.TenPB || "";

    thead.innerHTML = `
        <tr>
            <th colspan="8" style="background:#ebf8ff;color:#2b6cb0;text-align:left;padding:10px 14px;">
                <i class="fa-solid fa-user" style="margin-right:6px;"></i>
                ${tenNV} ${tenPB ? '— ' + tenPB : ''}
            </th>
        </tr>
        <tr>
            <th style="min-width:110px;text-align:center;">Ngày</th>
            <th style="min-width:80px;text-align:center;">Thứ</th>
            <th style="min-width:90px;text-align:center;">Giờ Vào</th>
            <th style="min-width:90px;text-align:center;">Giờ Ra</th>
            <th style="min-width:110px;text-align:center;color:#b45309;">Đi Muộn</th>
            <th style="min-width:110px;text-align:center;color:#b45309;">Về Sớm</th>
            <th style="min-width:100px;text-align:center;color:#7c3aed;">Tăng Ca (OT)</th>
            <th style="min-width:110px;text-align:center;">Ký Hiệu Công</th>
        </tr>
    `;

    tbody.innerHTML = "";
    dataList.forEach(row => {
        const tr = document.createElement("tr");

        // FIX 1 & 4: Ngày dạng DD/MM/YYYY, giờ dạng HH:mm
        const ngayDisplay  = dinhDangNgayVN(row.Ngay || "");
        const thuDisplay   = row.Thu  || "";
        const giovaoDisplay = formatTimeChiHHmm(row.Giovao);
        const gioraDisplay  = formatTimeChiHHmm(row.Giora);

        // FIX 4: Đọc đúng field Dimuon, Vesom, ThoigianOT từ BLL
        const diMuon  = row.Dimuon     !== undefined ? row.Dimuon     : 0;
        const veSom   = row.Vesom      !== undefined ? row.Vesom      : 0;
        const otGio   = row.ThoigianOT !== undefined ? row.ThoigianOT : 0;
        const kyHieu  = row.KyHieu     || "";

        const muonHtml = diMuon > 0
            ? `<span style="color:#ef4444;font-weight:bold;">${diMuon} phút</span>`
            : `<span style="color:#718096;">—</span>`;

        const somHtml = veSom > 0
            ? `<span style="color:#ef4444;font-weight:bold;">${veSom} phút</span>`
            : `<span style="color:#718096;">—</span>`;

        const otHtml = otGio > 0
            ? `<span style="color:#7c3aed;font-weight:bold;">${otGio} giờ</span>`
            : `<span style="color:#718096;">—</span>`;

        let kyHieuStyle = "color:#4a5568;font-weight:600;";
        if      (kyHieu === "X")   kyHieuStyle = "color:#3182ce;font-weight:bold;";
        else if (kyHieu === "1/2") kyHieuStyle = "color:#dd6b20;font-weight:bold;";
        else if (kyHieu === "P")   kyHieuStyle = "color:#38a169;font-weight:bold;";
        else if (kyHieu === "KP")  kyHieuStyle = "color:#e53e3e;font-weight:bold;";
        else if (kyHieu === "TC")  kyHieuStyle = "color:#7c3aed;font-weight:bold;";

        tr.innerHTML = `
            <td style="font-weight:bold;text-align:center;">${ngayDisplay}</td>
            <td style="color:#4a5568;text-align:center;">${thuDisplay}</td>
            <td style="text-align:center;font-weight:500;">${giovaoDisplay}</td>
            <td style="text-align:center;font-weight:500;">${gioraDisplay}</td>
            <td style="text-align:center;">${muonHtml}</td>
            <td style="text-align:center;">${somHtml}</td>
            <td style="text-align:center;">${otHtml}</td>
            <td style="text-align:center;${kyHieuStyle}">${kyHieu}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Bảng Pivot tổng hợp nhiều người 
function dungGiaoDienLuoiPivot(dataList) {
    const thead = document.querySelector("#mainTablePivot thead");
    const tbody = document.getElementById("tableToanBoCong");

    if (!dataList || dataList.length === 0) {
        thead.innerHTML = `<tr><th style="padding:12px;">Thông báo</th></tr>`;
        tbody.innerHTML = `<tr><td style="text-align:center; color:#a0aec0; padding:30px;">Không tìm thấy kết quả phù hợp!</td></tr>`;
        return;
    }

    let allColumns   = Object.keys(dataList[0]);
    let listNgayCols = allColumns.filter(c => !isNaN(c)).sort((a, b) => parseInt(a) - parseInt(b));

    let headerHtml = `<tr>
        <th class="sticky-col-1">Mã NV</th>
        <th class="sticky-col-2">Nhân Viên</th>
        <th class="sticky-col-2">Phòng Ban</th>`;

    listNgayCols.forEach(ngay => {
        headerHtml += `<th style="min-width:38px;">${ngay}</th>`;
    });
    headerHtml += `<th style="min-width:100px;background-color:#c6f6d5;color:#22543d;">Tổng Công</th></tr>`;
    thead.innerHTML = headerHtml;

    tbody.innerHTML = "";
    dataList.forEach(row => {
        const tr = document.createElement("tr");
        let rowHtml = `
            <td class="sticky-col-1" style="font-weight:bold;text-align:center;">${row.MaNV}</td>
            <td class="sticky-col-2" style="font-weight:500;">${row.HoTen}</td>
            <td class="sticky-col-2" style="font-weight:500;">${row.TenPB || ''}</td>`;

        listNgayCols.forEach(ngay => {
        let kHieu = row[ngay] || "";
        let textStyle = "text-align:center; font-weight:600; color:#4a5568;"; // Mặc định nếu ô trống hoặc ký hiệu lạ

        // Bổ sung màu nền (background-color) và căn giữa cho bảng tổng hợp nhiều người
        if (kHieu === "X") textStyle = "color:#2b6cb0; background-color:#ebf8ff; font-weight:bold; text-align:center;";
        else if (kHieu === "1/2") textStyle = "color:#dd6b20; background-color:#feebc8; font-weight:bold; text-align:center;";
        else if (kHieu === "P")   textStyle = "color:#2f855a; background-color:#f0fff4; font-weight:bold; text-align:center;";
        else if (kHieu === "KP")  textStyle = "color:#c53030; background-color:#fff5f5; font-weight:bold; text-align:center;";
        else if (kHieu === "TC")  textStyle = "color:#6b46c1; background-color:#faf5ff; font-weight:bold; text-align:center;";
        else if (kHieu === "L")   textStyle = "color:#975a16; background-color:#fefcbf; font-weight:bold; text-align:center;";

        rowHtml += `<td style="${textStyle}">${kHieu}</td>`;
    });

        rowHtml += `<td class="col-tong-cong">${row.TongCong || '0'}</td>`;
        tr.innerHTML = rowHtml;
        tbody.appendChild(tr);
    });
}

// FFormat giờ HH:mm 
function formatTimeChiHHmm(timespan) {
    if (!timespan) return "--:--";
    if (typeof timespan === 'string') {
        const parts = timespan.split(':');
        if (parts.length >= 2) {
            return parts[0].padStart(2, '0') + ':' + parts[1].padStart(2, '0');
        }
        return timespan;
    }
    if (typeof timespan === 'object') {
        const h = String(timespan.hours   || 0).padStart(2, '0');
        const m = String(timespan.minutes || 0).padStart(2, '0');
        return `${h}:${m}`;
    }
    return "--:--";
}

//  Ngày dạng DD/MM/YYYY
function dinhDangNgayVN(chuoiNgay) {
    if (!chuoiNgay) return "";
    const date = new Date(chuoiNgay);
    if (isNaN(date.getTime())) return chuoiNgay;
    return `${date.getDate().toString().padStart(2,'0')}/${(date.getMonth()+1).toString().padStart(2,'0')}/${date.getFullYear()}`;
}

function xuatExcelTuTable() {
    const tableElement = document.getElementById("mainTablePivot");
    if (!tableElement) return;
    const thang = document.getElementById("selectThang").value;
    const nam   = document.getElementById("selectNam").value;
    const wb = XLSX.utils.table_to_book(tableElement, { sheet: "Bảng Công Chấm" });
    XLSX.writeFile(wb, `Bang_Cong_Thang_${thang}_Nam_${nam}.xlsx`);
}
