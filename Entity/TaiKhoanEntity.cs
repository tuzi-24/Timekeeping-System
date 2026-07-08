using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity
{
    public class TaiKhoanEntity
    {
        public int MaNV { get; set; }
        public string MatKhau { get; set; }
        public string HoTen { get; set; }
        public string MaCV { get; set; }
        public bool TrangThai { get; set; }
        public byte[] Avatar { get; set; }
    }
    public class AccountEntity
    {
        public int MaNV { get; set; }
        public string HoTen { get; set; }
        public string TenPB { get; set; }
        public string TenCV { get; set; }
        public float TongPhepNam { get; set; }
        public float PhepConLai { get; set; }
        public byte[] Avatar { get; set; }
    }
}
