using System;
using System.Data;
using System.Data.SqlClient;

namespace DAL
{
    public class NhanVienDAL
    {
        private DatabaseHelper db = new DatabaseHelper();

                public DataTable GetAllNhanVien()
        {
            string sql = @"SELECT nv.MaNV, nv.HoTen, nv.MaPB, pb.TenPB, nv.MaCV, cv.TenCV 
                           FROM Nhanvien nv
                           INNER JOIN PhongBan pb ON nv.MaPB = pb.MaPB
                           INNER JOIN Chucvu cv ON nv.MaCV = cv.MaCV
                           INNER JOIN TaiKhoan tk ON nv.MaNV = tk.MaNV
                           WHERE tk.TrangThai = 1";
            return db.GetDataTable(sql);
        }

        public DataTable TimNhanVienTheoMa(int maNV)
        {
            string sql = @"SELECT nv.HoTen, nv.MaPB, pb.TenPB, nv.MaCV, cv.TenCV
                        FROM Nhanvien nv
                        INNER JOIN TaiKhoan  tk ON nv.MaNV = tk.MaNV
                        INNER JOIN PhongBan  pb ON nv.MaPB = pb.MaPB
                        INNER JOIN Chucvu    cv ON nv.MaCV = cv.MaCV
                        WHERE nv.MaNV = @ma AND tk.TrangThai = 1";
            SqlParameter[] prs = { new SqlParameter("@ma", maNV) };
            return db.GetDataTable(sql, prs);
        }

        public int ThemNhanVien(string hoTen, string maPB, string maCV)
        {
            SqlParameter[] prs = {
                new SqlParameter("@hoTen", hoTen),
                new SqlParameter("@maPB", maPB),
                new SqlParameter("@maCV", maCV)
            };
            object result = db.ExecuteScalar("sp_ThemNhanVienMoi", prs, CommandType.StoredProcedure);
            return Convert.ToInt32(result);
        }

        public bool SuaNhanVien(int maNV, string hoTen, string maPB, string maCV)
        {
            string sql = "UPDATE Nhanvien SET HoTen = @hoTen, MaPB = @maPB, MaCV = @maCV WHERE MaNV = @maNV";
            SqlParameter[] prs = {
                new SqlParameter("@maNV", maNV),
                new SqlParameter("@hoTen", hoTen),
                new SqlParameter("@maPB", maPB),
                new SqlParameter("@maCV", maCV)
            };
            return db.ExecuteNonQuery(sql, prs) > 0;
        }

        public bool XoaNhanVien(int maNV)
        {
            string sql = "UPDATE TaiKhoan SET TrangThai = 0 WHERE MaNV = @maNV";
            SqlParameter[] prs = { new SqlParameter("@maNV", maNV) };
            return db.ExecuteNonQuery(sql, prs) > 0;
        }

        public DataTable GetPhongBan() => db.GetDataTable("SELECT * FROM PhongBan");
        public DataTable GetChucVu() => db.GetDataTable("SELECT * FROM Chucvu");

        public bool DangKyOT(int maNV, DateTime ngayOT, string loai)
        {
            string sql = "INSERT INTO DangkiOT (MaNV, NgayOT, LoaiOT) VALUES (@maNV, @ngayOT, @loai)";
            SqlParameter[] prs = { 
                new SqlParameter("@maNV", maNV), 
                new SqlParameter("@ngayOT", ngayOT), 
                new SqlParameter("@loai", loai) 
            };
            return db.ExecuteNonQuery(sql, prs) > 0;
        }

        public bool DangKyNghiPhep(int maNV, DateTime tuNgay, DateTime denNgay, string loai, string lyDo)
        {
            string sql = "INSERT INTO NghiPhep (MaNV, TuNgay, DenNgay, LoaiNghi, Lydo) VALUES (@maNV, @tuNgay, @denNgay, @loai, @lyDo)";
            SqlParameter[] prs = { 
                new SqlParameter("@maNV", maNV), 
                new SqlParameter("@tuNgay", tuNgay), 
                new SqlParameter("@denNgay", denNgay), 
                new SqlParameter("@loai", loai), 
                new SqlParameter("@lyDo", lyDo) 
            };
            return db.ExecuteNonQuery(sql, prs) > 0;
        }

        public bool DangKyCongTac(int maNV, DateTime tuNgay, DateTime denNgay, string diaDiem)
        {
            string sql = "INSERT INTO CongTac (MaNV, TuNgay, DenNgay, Diadiem) VALUES (@maNV, @tuNgay, @denNgay, @diaDiem)";
            SqlParameter[] prs = { 
                new SqlParameter("@maNV", maNV), 
                new SqlParameter("@tuNgay", tuNgay), 
                new SqlParameter("@denNgay", denNgay), 
                new SqlParameter("@diaDiem", diaDiem) 
            };
            return db.ExecuteNonQuery(sql, prs) > 0;
        }
    }
}