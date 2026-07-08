using System;

namespace Entity
{
    // ---------- KyHieu ----------
    public class KyHieu
    {
        public string KyHieuCode { get; set; }
        public string TenKyHieu { get; set; }
    }

    // ---------- BangChamCong ----------
    public class BangChamCongEntity
    {
        public int MaNV { get; set; }
        public string TenNhanVien { get; set; }
        public string TenPB { get; set; }
        public DateTime Ngay { get; set; }
        public string Thu { get; set; }
        public string KyHieu { get; set; }
        public TimeSpan? Giovao { get; set; }
        public TimeSpan? Giora { get; set; }
        public int Dimuon { get; set; }
        public int Vesom { get; set; }
        public double ThoigianOT { get; set; }
    }
}