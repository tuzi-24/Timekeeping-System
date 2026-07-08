using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity
{
    internal class CongTacEntity
    {
        public int MaCongTac { get; set; }
        public int MaNV { get; set; }
        public DateTime TuNgay { get; set; }
        public DateTime DenNgay { get; set; }
        public string DiaDiem { get; set; }
        public char TrangThai { get; set; }
    }
}
