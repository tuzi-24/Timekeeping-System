using System;
using System.Data;
using System.Data.SqlClient;
using DAL;    // Kết nối đến DatabaseHelper tập trung của bạn
using Entity; // Kết nối tới lớp GlobalSession của bạn

namespace BLL
{
    public static class Session
    {
        // Bộ nhớ đệm Cache tối ưu hiển thị HTML
        private static int _cachedQuyen = -1;
        private static string _cachedMaPB = null;
        private static string _cachedTenPB = null;

        /// <summary>
        /// Tạo một thuộc tính NguoiDung ảo (Proxy) để giữ nguyên logic chấm gọi (.NguoiDung.MaNV, ...) ở GUI hiện tại
        /// </summary>
        public static ThongTinUserProxy NguoiDung
        {
            get
            {
                // Nếu GlobalSession ở Entity chưa có mã nhân viên, coi như chưa đăng nhập
                if (AppSession.MaNV <= 0) return null;
                return new ThongTinUserProxy();
            }
        }

        public class ThongTinUserProxy
        {
            public int MaNV => AppSession.MaNV;
            public string HoTen => AppSession.HoTen;
            public int MaCV => int.TryParse(AppSession.MaCV, out int cv) ? cv : 0;
        }

        public static int LayQuyenHan()
        {
            if (_cachedQuyen >= 0) return _cachedQuyen;
            if (NguoiDung == null) return 4;

            try
            {
                DatabaseHelper db = new DatabaseHelper();
                using (SqlConnection conn = db.GetConnection())
                {
                    const string sql = "SELECT QuyenHan FROM ChucVu WHERE MaCV = @maCV";
                    using (SqlCommand cmd = new SqlCommand(sql, conn))
                    {
                        cmd.Parameters.AddWithValue("@maCV", NguoiDung.MaCV);
                        conn.Open();
                        object r = cmd.ExecuteScalar();
                        _cachedQuyen = r == null ? 4 : Convert.ToInt32(r);
                    }
                }
            }
            catch { return 4; }
            return _cachedQuyen;
        }

        public static string LayMaPB()
        {
            if (_cachedMaPB != null) return _cachedMaPB;
            if (NguoiDung == null) return "ALL";

            try
            {
                DatabaseHelper db = new DatabaseHelper();
                using (SqlConnection conn = db.GetConnection())
                {
                    const string sql = "SELECT MaPB FROM NhanVien WHERE MaNV = @maNV";
                    using (SqlCommand cmd = new SqlCommand(sql, conn))
                    {
                        cmd.Parameters.AddWithValue("@maNV", NguoiDung.MaNV);
                        conn.Open();
                        object r = cmd.ExecuteScalar();
                        _cachedMaPB = r?.ToString() ?? "ALL";
                    }
                }
            }
            catch { return "ALL"; }
            return _cachedMaPB;
        }

        public static string LayTenPB()
        {
            if (_cachedTenPB != null) return _cachedTenPB;
            string maPB = LayMaPB();
            if (string.IsNullOrEmpty(maPB) || maPB == "ALL") return "Tất Cả";

            try
            {
                DatabaseHelper db = new DatabaseHelper();
                using (SqlConnection conn = db.GetConnection())
                {
                    const string sql = "SELECT TenPB FROM PhongBan WHERE MaPB = @maPB";
                    using (SqlCommand cmd = new SqlCommand(sql, conn))
                    {
                        cmd.Parameters.AddWithValue("@maPB", maPB);
                        conn.Open();
                        object r = cmd.ExecuteScalar();
                        _cachedTenPB = r?.ToString() ?? "Tất Cả";
                    }
                }
            }
            catch { return "Tất Cả"; }
            return _cachedTenPB;
        }

        public static void DangXuat()
        {
            AppSession.MaNV = 0;
            AppSession.HoTen = string.Empty;
            AppSession.MaCV = string.Empty;
            _cachedQuyen = -1;
            _cachedMaPB = null;
            _cachedTenPB = null;
        }
    }
}