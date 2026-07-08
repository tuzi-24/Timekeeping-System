// File: CaLamviecBLL.cs (Trong dự án BLL)
using DAL;
using Entity;
using System;
using System.Data;

namespace BLL
{
    public class CaLamviecBLL
    {
        private readonly CaLamviecDAL dal = new CaLamviecDAL();

        // Lấy giờ chuẩn hiện tại
        public CaLamViecEntity GetCaLamviec()
        {
            return dal.GetCaLamviec();
        }

        // Cập nhật giờ chuẩn — validate trước khi lưu
        public (bool success, string message) UpdateCaLamviec(string gioVao, string gioRa)
        {
            // Kiểm tra định dạng HH:mm
            if (!TimeSpan.TryParse(gioVao, out TimeSpan tVao))
                return (false, "Giờ vào không hợp lệ! Định dạng đúng: HH:mm");

            if (!TimeSpan.TryParse(gioRa, out TimeSpan tRa))
                return (false, "Giờ ra không hợp lệ! Định dạng đúng: HH:mm");

            if (tVao >= tRa)
                return (false, "Giờ vào phải nhỏ hơn giờ ra!");

            bool ok = dal.UpdateCaLamviec(gioVao, gioRa);
            return ok
                ? (true, "Cập nhật giờ chuẩn thành công!")
                : (false, "Cập nhật thất bại, vui lòng thử lại!");
        }

        // Lấy danh sách ký hiệu chấm công
        public DataTable GetAllKyHieu()
        {
            return dal.GetAllKyHieu();
        }
    }
}