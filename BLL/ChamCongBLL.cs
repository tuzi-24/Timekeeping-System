using System;
using DAL;

namespace BLL
{
    public class ChamCongBLL
    {
        private ChamCongDAL chamCongDAL = new ChamCongDAL();

        public bool ChamCong(int maNV)
        {
            // Lấy thời gian thực tế của hệ thống máy tính
            DateTime ngayHienTai = DateTime.Today;
            TimeSpan gioHienTai = DateTime.Now.TimeOfDay;

            // Gọi xuống tầng DAL để xử lý dữ liệu
            return chamCongDAL.ThucHienChamCong(maNV, gioHienTai, ngayHienTai);
        }
    }
}