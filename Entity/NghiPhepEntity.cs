using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity
{
    // ---------- NghiPhep ----------
    public class NghiPhepEntity
    {
        public int MaDon { get; set; }
        public int MaNV { get; set; }
        public string HoTen { get; set; }
        public DateTime TuNgay { get; set; }
        public DateTime DenNgay { get; set; }
        public string LoaiNghi { get; set; }   // P, O, TS, K...
        public string LyDo { get; set; }
        /// <summary>P=Pending, A=Approved, R=Rejected</summary>
        public char TrangThai { get; set; }

        public int SoNgay => (DenNgay - TuNgay).Days + 1;
    }

    // ---------- PhepNam ----------
    public class PhepNam
    {
        public int MaNV { get; set; }
        public int Nam { get; set; }
        public double TongPhepNam { get; set; }
        public double PhepDaDung { get; set; }
        public double PhepConLai { get; set; }
    }
}
