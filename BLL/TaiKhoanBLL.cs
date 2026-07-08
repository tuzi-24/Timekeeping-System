using DAL;
using Entity;
using System.Data;

namespace BLL
{
    public class TaiKhoanBLL
    {
        private readonly TaiKhoanDAL dal = new TaiKhoanDAL();

        // ─── ĐĂNG NHẬP ───────────────────────────────────────────────────────
        // Trả về TaiKhoanEntity nếu đúng, null nếu sai tài khoản/mật khẩu
        public TaiKhoanEntity DangNhap(int maNV, string matKhau)
        {
            DataRow row = dal.GetTaiKhoanByLogin(maNV, matKhau);
            if (row == null) return null;

            return new TaiKhoanEntity
            {
                MaNV = System.Convert.ToInt32(row["MaNV"]),
                HoTen = row["HoTen"].ToString(),
                MaCV = row["MaCV"].ToString()
            };
        }

        // ─── ĐỔI MẬT KHẨU ───────────────────────────────────────────────────
        // Trả về (true, "thành công") hoặc (false, "thông báo lỗi")
        public (bool success, string message) DoiMatKhau(int maNV, string passCu, string passMoi)
        {
            if (string.IsNullOrWhiteSpace(passMoi) || passMoi.Length < 6)
                return (false, "Mật khẩu mới phải có ít nhất 6 ký tự!");

            if (passCu == passMoi)
                return (false, "Mật khẩu mới không được trùng mật khẩu cũ!");

            int affected = dal.DoiMatKhau(maNV, passCu, passMoi);

            return affected > 0
                ? (true, "Đổi mật khẩu thành công!")
                : (false, "Mật khẩu cũ không đúng. Vui lòng kiểm tra lại!");
        }

        // ─── THÔNG TIN TÀI KHOẢN (dùng cho frmAccount) ──────────────────────
        public AccountEntity TaiThongTinNhanVien(int maNV)
        {
            return dal.TaiThongTinNhanVien(maNV);
        }

        // ─── CẬP NHẬT ẢNH ĐẠI DIỆN (dùng cho frmAccount) ───────────────────
        public bool UpdateAvatar(int maNV, byte[] imageBytes)
        {
            return dal.UpdateAvatar(maNV, imageBytes);
        }
    }
}