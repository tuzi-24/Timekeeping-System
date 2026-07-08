using System;
using System.Collections.Generic;
using System.Data;
using DAL;
using Entity;

namespace BLL
{
    public class BangChamcongBLL
    {
        private BangChamCongDAL dal = new BangChamCongDAL();

        public DataRow LayThongTinQuyenForm(int maNV)
            => dal.GetThongTinQuyenForm(maNV);

        public DataTable LayDanhSachPhongBan()
            => dal.GetDanhSachPhongBan();

        public List<KyHieu> LayDanhSachKyHieu()
        {
            var list = new List<KyHieu>();
            foreach (DataRow r in dal.GetDanhSachKyHieu().Rows)
                list.Add(new KyHieu
                {
                    KyHieuCode = r["KyHieuCode"].ToString(),
                    TenKyHieu = r["TenKyHieu"].ToString()
                });
            return list;
        }

        // ── XEM CHI TIẾT LỊCH SỬ CHẤM CÔNG CỦA 1 NGƯỜI ────────────────────────────
        public List<BangChamCongEntity> LayChiTiet1Nguoi(int maNV, int nam, int thang)
        {
            DataTable dt = dal.GetChamCong1NguoiTrongThang(maNV, nam, thang);
            List<BangChamCongEntity> list = new List<BangChamCongEntity>();

            foreach (DataRow row in dt.Rows)
            {
                var item = new BangChamCongEntity
                {
                    MaNV = Convert.ToInt32(row["MaNV"]),
                    TenNhanVien = row["HoTen"].ToString(),
                    TenPB = row["TenPB"].ToString(),
                    Ngay = Convert.ToDateTime(row["Ngay"]),
                    Thu = ConvertToThu(Convert.ToDateTime(row["Ngay"])),
                    KyHieu = row["KyHieu"].ToString(),
                    Dimuon = row["Dimuon"] == DBNull.Value ? 0 : Convert.ToInt32(row["Dimuon"]),
                    Vesom = row["Vesom"] == DBNull.Value ? 0 : Convert.ToInt32(row["Vesom"]),
                    ThoigianOT = row["ThoigianOT"] == DBNull.Value ? 0 : Convert.ToDouble(row["ThoigianOT"])
                };

                if (row["Giovao"] != DBNull.Value) item.Giovao = (TimeSpan)row["Giovao"];
                if (row["Giora"] != DBNull.Value) item.Giora = (TimeSpan)row["Giora"];

                list.Add(item);
            }
            return list;
        }

        // ── LẬP BẢNG CÔNG TỔNG HỢP PIVOT THEO THÁNG ────────────────────────────
        public DataTable LayBangCongTongHopPivot(int thang, int nam, string maPB)
        {
            DataTable dtRaw = dal.GetChamCongTatCaNhanVienTrongThang(thang, nam, maPB);

            DataTable pivot = new DataTable();
            pivot.Columns.Add("MaNV", typeof(int));
            pivot.Columns.Add("HoTen", typeof(string));
            pivot.Columns.Add("TenPB", typeof(string));

            int soNgayTrongThang = DateTime.DaysInMonth(nam, thang);
            for (int d = 1; d <= soNgayTrongThang; d++)
            {
                pivot.Columns.Add(d.ToString(), typeof(string));
            }
            pivot.Columns.Add("TongCong", typeof(string));

            var nvRows = new Dictionary<int, DataRow>();

            foreach (DataRow rawRow in dtRaw.Rows)
            {
                int maNV = Convert.ToInt32(rawRow["MaNV"]);
                string hoTen = rawRow["HoTen"].ToString();
                string tenPB = rawRow["TenPB"]?.ToString() ?? "";
                DateTime? ngayNullable = rawRow["Ngay"] == DBNull.Value ? null : (DateTime?)Convert.ToDateTime(rawRow["Ngay"]);
                string kyHieu = rawRow["KyHieu"] == DBNull.Value ? "" : rawRow["KyHieu"].ToString();

                if (!nvRows.ContainsKey(maNV))
                {
                    DataRow newRow = pivot.NewRow();
                    newRow["MaNV"] = maNV;
                    newRow["HoTen"] = hoTen;
                    newRow["TenPB"] = tenPB;
                    pivot.Rows.Add(newRow);
                    nvRows[maNV] = newRow;
                }

                // Chỉ cập nhật cột ngày nếu có dữ liệu ngày
                if (ngayNullable.HasValue)
                {
                    DataRow rPivot = nvRows[maNV];
                    rPivot[ngayNullable.Value.Day.ToString()] = kyHieu;
                }
            }

            foreach (DataRow row in pivot.Rows)
            {
                double tongCong = 0;
                for (int d = 1; d <= soNgayTrongThang; d++)
                {
                    string kHieu = row[d.ToString()].ToString();
                    if (kHieu == "X" || kHieu == "P" || kHieu == "L" || kHieu == "CT") tongCong += 1.0;
                    else if (kHieu == "1/2") tongCong += 0.5;
                    else if (string.IsNullOrEmpty(kHieu))
                    {
                        row[d.ToString()] = "";
                    }
                }
                row["TongCong"] = tongCong.ToString();
            }
            return pivot;
        }

        // ── KIỂM TRA QUYỀN XEM ───────────────────────────────────────────────
        public bool KiemTraQuyenXemNV(int maNVLogin, int maNVTarget, int quyenHan, string maPBLogin)
        {
            if (quyenHan <= 2) return true; // HR và Admin được phép xem tất cả
            if (quyenHan == 4) return maNVLogin == maNVTarget; // Nhân viên chỉ xem chính mình

            // Cấp Trưởng phòng: Nhân viên mục tiêu phải trực thuộc cùng phòng ban quản lý
            DataRow quyenRow = dal.GetThongTinQuyenForm(maNVTarget);
            if (quyenRow == null) return false;
            return quyenRow["MaPB"].ToString() == maPBLogin;
        }

        private string ConvertToThu(DateTime dt)
        {
            switch (dt.DayOfWeek)
            {
                case DayOfWeek.Monday: return "Thứ 2";
                case DayOfWeek.Tuesday: return "Thứ 3";
                case DayOfWeek.Wednesday: return "Thứ 4";
                case DayOfWeek.Thursday: return "Thứ 5";
                case DayOfWeek.Friday: return "Thứ 6";
                case DayOfWeek.Saturday: return "Thứ 7";
                default: return "Chủ Nhật";
            }
        }
    }
}