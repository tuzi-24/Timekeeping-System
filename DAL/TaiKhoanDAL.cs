// File: TaiKhoanDAL.cs (Trong dự án DAL)
using Entity;
using System;
using System.Data;
using System.Data.SqlClient;

namespace DAL
{
    public class TaiKhoanDAL
    {
        private readonly DatabaseHelper db = new DatabaseHelper();

        // Đăng nhập: dùng stored procedure sp_Login
        // Nhận @maNV + @pass, trả về MaNV, HoTen, MaCV nếu hợp lệ
        public DataRow GetTaiKhoanByLogin(int maNV, string matKhau)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@maNV", maNV),
                new SqlParameter("@pass", matKhau)
            };

            DataTable dt = db.GetDataTable("sp_Login", parameters, CommandType.StoredProcedure);
            return dt.Rows.Count > 0 ? dt.Rows[0] : null;
        }

        // Đổi mật khẩu: dùng stored procedure sp_DoiMatKhau
        // Trả về 1 nếu thành công, 0 nếu sai mật khẩu cũ
        public int DoiMatKhau(int maNV, string passCu, string passMoi)
        {
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@maNV",    maNV),
                new SqlParameter("@passCu",  passCu),
                new SqlParameter("@passMoi", passMoi)
            };

            object result = db.ExecuteScalar("sp_DoiMatKhau", parameters, CommandType.StoredProcedure);
            return result != null ? Convert.ToInt32(result) : 0;
        }

        // Lấy thông tin tài khoản đầy đủ để hiển thị lên frmAccount
        public AccountEntity TaiThongTinNhanVien(int maNV)
        {
            string sql = @"
                SELECT nv.MaNV, 
                       nv.HoTen, 
                       pb.TenPB, 
                       cv.TenCV, 
                       ISNULL(pn.TongPhepNam, 12) AS TongPhepNam,
                       ISNULL(pn.PhepConlai,  12) AS PhepConlai, 
                       tk.Avatar
                FROM   Nhanvien  nv
                LEFT JOIN TaiKhoan tk ON nv.MaNV  = tk.MaNV
                LEFT JOIN PhongBan pb ON nv.MaPB  = pb.MaPB
                LEFT JOIN Chucvu   cv ON nv.MaCV  = cv.MaCV
                LEFT JOIN PhepNam  pn ON nv.MaNV  = pn.MaNV
                                     AND pn.Nam   = YEAR(GETDATE())
                WHERE nv.MaNV = @MaNV";

            SqlParameter[] pars = new SqlParameter[]
            {
                new SqlParameter("@MaNV", maNV)
            };

            DataTable dt = db.GetDataTable(sql, pars, CommandType.Text);

            if (dt.Rows.Count > 0)
            {
                DataRow row = dt.Rows[0];
                return new AccountEntity
                {
                    MaNV = Convert.ToInt32(row["MaNV"]),
                    HoTen = row["HoTen"].ToString(),
                    TenPB = row["TenPB"] != DBNull.Value ? row["TenPB"].ToString() : "Chưa rõ",
                    TenCV = row["TenCV"] != DBNull.Value ? row["TenCV"].ToString() : "Chưa rõ",
                    TongPhepNam = row["TongPhepNam"] != DBNull.Value ? Convert.ToSingle(row["TongPhepNam"]) : 12f,
                    PhepConLai = row["PhepConlai"] != DBNull.Value ? Convert.ToSingle(row["PhepConlai"]) : 12f,
                    Avatar = row["Avatar"] != DBNull.Value ? (byte[])row["Avatar"] : null
                };
            }
            return null;
        }

        // Cập nhật ảnh đại diện (lưu byte[] vào cột Avatar kiểu VARBINARY(MAX))
        public bool UpdateAvatar(int maNV, byte[] imageBytes)
        {
            string sql = "UPDATE TaiKhoan SET Avatar = @Avatar WHERE MaNV = @MaNV";
            SqlParameter[] pars = new SqlParameter[]
            {
                new SqlParameter("@Avatar", (object)imageBytes ?? DBNull.Value),
                new SqlParameter("@MaNV",   maNV)
            };
            return db.ExecuteNonQuery(sql, pars, CommandType.Text) > 0;
        }
    }
}