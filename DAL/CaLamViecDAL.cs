using Entity;
using System;
using System.Data;
using System.Data.SqlClient;

namespace DAL
{
    public class CaLamviecDAL
    {
        private readonly DatabaseHelper db = new DatabaseHelper();

        // Lấy giờ vào/ra chuẩn (chỉ có 1 dòng trong bảng CaLamviec)
        public CaLamViecEntity GetCaLamviec()
        {
            string sql = "SELECT TOP 1 GioVaoChuan, GioRaChuan FROM CaLamviec";
            DataTable dt = db.GetDataTable(sql, null, CommandType.Text);

            if (dt.Rows.Count > 0)
            {
                DataRow row = dt.Rows[0];
                return new CaLamViecEntity
                {
                    GioVaoChuan = (TimeSpan)row["GioVaoChuan"],
                    GioRaChuan = (TimeSpan)row["GioRaChuan"]
                };
            }
            return null;
        }

        // Cập nhật giờ vào/ra chuẩn
        public bool UpdateCaLamviec(string gioVao, string gioRa)
        {
            string sql = "UPDATE CaLamviec SET GioVaoChuan = @GioVao, GioRaChuan = @GioRa";
            SqlParameter[] pars = new SqlParameter[]
            {
                new SqlParameter("@GioVao", gioVao),
                new SqlParameter("@GioRa",  gioRa)
            };
            return db.ExecuteNonQuery(sql, pars, CommandType.Text) > 0;
        }

        // Lấy toàn bộ danh sách ký hiệu chấm công
        public DataTable GetAllKyHieu()
        {
            string sql = "SELECT KyHieu, TenKyKieu FROM KH ORDER BY KyHieu";
            return db.GetDataTable(sql, null, CommandType.Text);
        }
    }
}