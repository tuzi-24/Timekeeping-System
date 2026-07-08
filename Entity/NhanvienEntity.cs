using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity
{
    // ---------- NhanVien ----------
    public class NhanVien
    {
        public int MaNV { get; set; }
        public string HoTen { get; set; }
        public string MaPB { get; set; }
        public string MaCV { get; set; }

        // Navigation (join thêm khi cần)
        public string TenPB { get; set; }
        public string TenCV { get; set; }
    }
    // ---------- PhongBan ----------
    public class PhongBan
    {
        public string MaPB { get; set; }
        public string TenPB { get; set; }
    }

    // ---------- ChucVu ----------
    public class ChucVu
    {
        public string MaCV { get; set; }
        public string TenCV { get; set; }
        public int QuyenHan { get; set; }   // 1=AD, 2=HR, 3=TT, 4=NV
    }
}
