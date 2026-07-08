using System;
using System.Data;
using System.Data.SqlClient;

namespace DAL
{
    public class BangChamCongDAL
    {
        private DatabaseHelper dbHelper = new DatabaseHelper();

        // Lấy thông tin quyền hạn + phòng ban của người đăng nhập
        public DataRow GetThongTinQuyenForm(int maNV)
        {
            string query = @"SELECT cv.QuyenHan, nv.MaPB, pb.TenPB 
                             FROM TaiKhoan tk 
                             INNER JOIN Nhanvien nv ON tk.MaNV = nv.MaNV
                             INNER JOIN Chucvu cv ON tk.MaCV = cv.MaCV 
                             LEFT JOIN PhongBan pb ON nv.MaPB = pb.MaPB
                             WHERE tk.MaNV = @MaNV AND tk.TrangThai = 1";
            SqlParameter[] p = { new SqlParameter("@MaNV", maNV) };
            DataTable dt = dbHelper.GetDataTable(query, p);
            return dt.Rows.Count > 0 ? dt.Rows[0] : null;
        }

        // Lấy danh sách toàn bộ phòng ban
        public DataTable GetDanhSachPhongBan()
        {
            return dbHelper.GetDataTable("SELECT MaPB, TenPB FROM PhongBan ORDER BY MaPB", null);
        }

        // Lấy dữ liệu chấm công chi tiết theo từng ngày của 1 nhân viên cụ thể
        public DataTable GetChamCong1NguoiTrongThang(int maNV, int nam, int thang)
        {
            // Đã bổ sung pb.TenPB và INNER JOIN PhongBan
            string query = @"
            SELECT nv.MaNV, nv.HoTen, pb.TenPB, bcc.Ngay, bcc.KyHieu, 
                   bcc.Giovao, bcc.Giora, bcc.Dimuon, bcc.Vesom, bcc.ThoigianOT
            FROM BangChamcong bcc
            INNER JOIN Nhanvien nv ON bcc.MaNV = nv.MaNV
            INNER JOIN PhongBan pb ON nv.MaPB = pb.MaPB
            WHERE bcc.MaNV = @MaNV 
              AND MONTH(bcc.Ngay) = @Thang 
              AND YEAR(bcc.Ngay) = @Nam
            ORDER BY bcc.Ngay ASC";

            SqlParameter[] p = {
                new SqlParameter("@MaNV", maNV),
                new SqlParameter("@Thang", thang),
                new SqlParameter("@Nam", nam)
            };
            return dbHelper.GetDataTable(query, p);
        }

        // Lấy dữ liệu chấm công thô của tất cả nhân viên (Hỗ trợ lọc theo Phòng ban)
        public DataTable GetChamCongTatCaNhanVienTrongThang(int thang, int nam, string maPB)
        {
            string query = @"
                SELECT nv.MaNV, nv.HoTen, pb.TenPB, bcc.Ngay, bcc.KyHieu, 
                       bcc.Giovao, bcc.Giora, bcc.Dimuon, bcc.Vesom, bcc.ThoigianOT
                FROM Nhanvien nv
                INNER JOIN TaiKhoan tk ON nv.MaNV = tk.MaNV
                LEFT JOIN PhongBan pb ON nv.MaPB = pb.MaPB
                LEFT JOIN BangChamcong bcc ON bcc.MaNV = nv.MaNV 
                    AND MONTH(bcc.Ngay) = @Thang
                    AND YEAR(bcc.Ngay) = @Nam
                WHERE tk.TrangThai = 1";

            if (!string.IsNullOrEmpty(maPB) && maPB != "ALL")
            {
                query += " AND nv.MaPB = @MaPB";
            }

            query += " ORDER BY nv.MaNV ASC, bcc.Ngay ASC";

            var pList = new System.Collections.Generic.List<SqlParameter> {
                new SqlParameter("@Thang", thang),
                new SqlParameter("@Nam",   nam)
            };

            if (!string.IsNullOrEmpty(maPB) && maPB != "ALL")
            {
                pList.Add(new SqlParameter("@MaPB", maPB));
            }

            return dbHelper.GetDataTable(query, pList.ToArray());
        }

        // Lấy danh sách bảng mã ký hiệu
        public DataTable GetDanhSachKyHieu()
        {
            return dbHelper.GetDataTable("SELECT KyHieu AS KyHieuCode, TenKyKieu AS TenKyHieu FROM KH ORDER BY KyHieu", null);
        }

        // Cập nhật ký hiệu ngày công
        public int CapNhatKyHieu(int maNV, DateTime ngay, string kyHieu)
        {
            string query = "UPDATE BangChamcong SET KyHieu=@KyHieu WHERE MaNV=@MaNV AND Ngay=@Ngay";
            SqlParameter[] p = {
                new SqlParameter("@KyHieu", kyHieu),
                new SqlParameter("@MaNV", maNV),
                new SqlParameter("@Ngay", ngay)
            };
            return dbHelper.ExecuteNonQuery(query, p);
        }
    }
}