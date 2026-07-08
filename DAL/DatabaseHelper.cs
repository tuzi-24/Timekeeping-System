using System;
using System.Data;
using System.Data.SqlClient;

namespace DAL
{
    public class DatabaseHelper
    {
        private readonly string connectionString = @"Data Source=localhost;Initial Catalog=QLChamcong;Integrated Security=True;Encrypt=False;TrustServerCertificate=True";

        public SqlConnection GetConnection()
        {
            return new SqlConnection(connectionString);
        }

        //  CommandType để đổ dữ liệu từ Store lên GridView
        public DataTable GetDataTable(string sql, SqlParameter[] parameters = null, CommandType type = CommandType.Text)
        {
            using (SqlConnection conn = GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand(sql, conn))
                {
                    cmd.CommandType = type; // Thêm dòng này
                    if (parameters != null) cmd.Parameters.AddRange(parameters);
                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        DataTable dt = new DataTable();
                        da.Fill(dt);
                        return dt;
                    }
                }
            }
        }

        public object ExecuteScalar(string sql, SqlParameter[] parameters, CommandType type = CommandType.Text)
        {
            using (SqlConnection conn = GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand(sql, conn))
                {
                    cmd.CommandType = type;
                    if (parameters != null) cmd.Parameters.AddRange(parameters);
                    conn.Open();
                    return cmd.ExecuteScalar();
                }
            }
        }

        // Thêm CommandType để thực thi Insert/Update từ Store
        public int ExecuteNonQuery(string sql, SqlParameter[] parameters = null, CommandType type = CommandType.Text)
        {
            using (SqlConnection conn = GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand(sql, conn))
                {
                    cmd.CommandType = type; // Thêm dòng này
                    if (parameters != null) cmd.Parameters.AddRange(parameters);
                    conn.Open();
                    return cmd.ExecuteNonQuery();
                }
            }
        }

        public bool TestConnection()
        {
            try { using (SqlConnection conn = GetConnection()) { conn.Open(); return true; } }
            catch { return false; }
        }
    }
}