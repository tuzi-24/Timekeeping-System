using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity
{
    public static class AppSession
    {
        // ── Thông tin cơ bản ─────────────────────────────────────────────────────
        public static int MaNV { get; set; }
        public static string HoTen { get; set; } = "";
        public static string MaCV { get; set; } = "";

        // ── Phân quyền (điền sau khi đăng nhập) ──────────────────────────────────
        // QuyenHan: 1 = AD/GD, 2 = HR, 3 = TT, 4 = NV  (theo bảng Chucvu)
        public static int QuyenHan { get; set; } = 4;
        public static string MaPB { get; set; } = "";
        public static string TenPB { get; set; } = "";
        public static float TongPhep { get; set; }
        public static float PhepConLai { get; set; }

        // ── Kiểm tra nhanh ───────────────────────────────────────────────────────
        public static bool IsLoggedIn => MaNV > 0;

        // ── Xoá session khi đăng xuất ────────────────────────────────────────────
        public static void Clear()
        {
            MaNV = 0;
            HoTen = "";
            MaCV = "";
            QuyenHan = 4;
            MaPB = "";
            TenPB = "";
        }
    }
}
