using System;
using System.Data;
using System.Data.SqlClient;

namespace DAL
{
    public class ChamCongDAL
    {
        private DatabaseHelper db = new DatabaseHelper();

        public bool ThucHienChamCong(int maNV, TimeSpan gioHienTai, DateTime ngayHienTai)
        {
            // Khởi tạo mảng tham số tương ứng với sp_ChamCongVaoRa trong SQL
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@maNV", maNV),
                new SqlParameter("@gioHienTai", gioHienTai),
                new SqlParameter("@ngay", ngayHienTai)
            };

            // Gọi ExecuteNonQuery với CommandType là StoredProcedure
            int result = db.ExecuteNonQuery("sp_ChamCongVaoRa", parameters, CommandType.StoredProcedure);

            // Vì sp_ChamCongVaoRa dùng cả INSERT và UPDATE nên nếu thành công sẽ ảnh hưởng > 0 dòng
            return result > 0;
        }
    }
}