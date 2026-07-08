using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity
{
    internal class DangKiOTEntity
    {
        public int MaOT { get; set; }
        public int MaNV { get; set; }
        public string HoTen { get; set; }
        public double SoGioDangKi { get; set; }
        public DateTime NgayDK { get; set; }
        public string LoaiOT { get; set; }
        /// <summary>P=Pending, A=Approved, R=Rejected</summary>
        public char TrangThai { get; set; }
    }
}
