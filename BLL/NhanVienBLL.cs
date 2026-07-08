using System;
using System.Data;
using DAL;

namespace BLL
{
    public class NhanVienBLL
    {
        private NhanVienDAL dal = new NhanVienDAL();

        public DataTable LayDanhSachNV() => dal.GetAllNhanVien();
        public DataTable LayPB() => dal.GetPhongBan();
        public DataTable LayCV() => dal.GetChucVu();

        public DataTable TimNhanVienTheoMa(int maNV)
        {
            return dal.TimNhanVienTheoMa(maNV);
        }

        public string XuLyNhanVien(string hanhDong, int maNV, string hoTen, string maPB, string maCV)
        {
            if (hanhDong == "Thêm nhân viên")
            {
                if (string.IsNullOrEmpty(hoTen)) return "Họ tên không được để trống!";
                int newID = dal.ThemNhanVien(hoTen, maPB, maCV);
                return $"Thêm thành công! Mã NV mới: {newID}";
            }
            if (hanhDong == "Sửa thông tin nhân viên")
            {
                return dal.SuaNhanVien(maNV, hoTen, maPB, maCV) ? "Cập nhật thành công!" : "Sửa thất bại!";
            }
            if (hanhDong == "Xóa nhân viên")
            {
                return dal.XoaNhanVien(maNV) ? "Xóa thành công!" : "Xóa thất bại! (Ràng buộc dữ liệu)";
            }
            return "Hành động không hợp lệ";
        }

        public bool DangKyChucNang(string loaiDon, int maNV, DateTime tuNgay, DateTime denNgay, string thongTinThem)
        {
            if (loaiDon == "Đăng ký OT")
                return dal.DangKyOT(maNV, tuNgay, thongTinThem);
            if (loaiDon == "Nghỉ phép")
                return dal.DangKyNghiPhep(maNV, tuNgay, denNgay, "P", thongTinThem);
            if (loaiDon == "Công tác")
                return dal.DangKyCongTac(maNV, tuNgay, denNgay, thongTinThem);
            return false;
        }
    }
}