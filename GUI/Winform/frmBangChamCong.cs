using BLL;
using Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.IO;
using System.Text;
using System.Windows.Forms;

namespace GUI
{
    public partial class frmBangChamCong : frmBase
    {
        private BangChamcongBLL bll = new BangChamcongBLL();

        private int _quyenHan = 1; // Mặc định để quyền Admin (1) để nếu DB chưa chuẩn vẫn load được toàn bộ dữ liệu
        private string _maPBLogin = "ALL";

        private List<BangChamCongEntity> _danhSachChiTiet = new List<BangChamCongEntity>();
        private bool _isChiTiet = false;
        private bool _dangKhoiTao = true;

        // Định dạng chuỗi hướng dẫn (Placeholder)
        private const string PLACEHOLDER_TEXT = "Tìm nhân viên";

        public frmBangChamCong()
        {
            InitializeComponent();

            // ÉP BUỘC ĐẤU NỐI SỰ KIỆN TRỰC TIẾP BẰNG CODE (BỎ QUA DESIGNER)

            this.Load -= new System.EventHandler(this.frmBangChamCong_Load);
            this.Load += new System.EventHandler(this.frmBangChamCong_Load);

            // Đấu nối xử lý sự kiện cho ô nhập mã nhân viên tìm kiếm
            this.txtTimNhanvien.Enter -= new System.EventHandler(this.Xuly_txtTimNhanvien_Enter);
            this.txtTimNhanvien.Leave -= new System.EventHandler(this.Xuly_txtTimNhanvien_Leave);
            this.txtTimNhanvien.KeyDown -= new System.Windows.Forms.KeyEventHandler(this.Xuly_txtTimNhanvien_KeyDown);

            this.txtTimNhanvien.Enter += new System.EventHandler(this.Xuly_txtTimNhanvien_Enter);
            this.txtTimNhanvien.Leave += new System.EventHandler(this.Xuly_txtTimNhanvien_Leave);
            this.txtTimNhanvien.KeyDown += new System.Windows.Forms.KeyEventHandler(this.Xuly_txtTimNhanvien_KeyDown);

            // Đấu nối thay đổi lựa chọn thời gian và phòng ban để tự động Tải lại dữ liệu
            this.cboPhongBan.SelectedIndexChanged -= new System.EventHandler(this.cboPhongBan_SelectedIndexChanged);
            this.cboPhongBan.SelectedIndexChanged += new System.EventHandler(this.cboPhongBan_SelectedIndexChanged);

            this.dtpNgay.ValueChanged -= new System.EventHandler(this.dtpNgay_ValueChanged);
            this.dtpNgay.ValueChanged += new System.EventHandler(this.dtpNgay_ValueChanged);
        }

        // SỰ KIỆN LOAD FORM CHÍNH
        private void frmBangChamCong_Load(object sender, EventArgs e)
        {
            try
            {
                _dangKhoiTao = true;

                // Cấu hình GridView hiển thị bảng dữ liệu
                dgvChamCong.AutoSizeColumnsMode = DataGridViewAutoSizeColumnsMode.Fill;
                dgvChamCong.SelectionMode = DataGridViewSelectionMode.FullRowSelect;
                dgvChamCong.ReadOnly = true;

                // Thiết lập chữ mờ ban đầu cho ô tìm kiếm
                txtTimNhanvien.Text = PLACEHOLDER_TEXT;
                txtTimNhanvien.ForeColor = Color.Gray;

                // 1. Đọc thông tin phân quyền từ CSDL dựa trên MaNV đăng nhập
                try
                {
                    DataRow quyenRow = bll.LayThongTinQuyenForm(AppSession.MaNV);
                    if (quyenRow != null && quyenRow["QuyenHan"] != DBNull.Value)
                    {
                        _quyenHan = Convert.ToInt32(quyenRow["QuyenHan"]);
                        _maPBLogin = quyenRow["MaPB"].ToString();
                    }
                }
                catch
                {
                    // Nếu lỗi phân quyền, giữ mặc định _quyenHan = 1 (Admin) để không bị chặn xem dữ liệu
                    _quyenHan = 1;
                }

                // 2. Tải dữ liệu phòng ban vào ComboBox
                LoadComboBoxPhongBan();

                // 3. Thiết lập trạng thái điều khiển theo Quyền hạn
                if (_quyenHan == 4) // Chỉ là nhân viên thông thường
                {
                    cboPhongBan.Enabled = false;
                    txtTimNhanvien.ReadOnly = true;
                    txtTimNhanvien.Text = "Không có quyền";
                    txtTimNhanvien.ForeColor = Color.Red;
                    _isChiTiet = true;

                    // Khóa ComboBox về đúng phòng ban của chính mình
                    cboPhongBan.SelectedValue = _maPBLogin;
                }
                else // Quản trị viên, Nhân sự, Trưởng phòng
                {
                    cboPhongBan.Enabled = true;
                    txtTimNhanvien.ReadOnly = false;
                    _isChiTiet = false;

                    if (_quyenHan == 3) // Cấp Trưởng phòng
                    {
                        // Mặc định chọn phòng ban đang quản lý và khóa lại không cho chọn phòng khác
                        cboPhongBan.SelectedValue = _maPBLogin;
                        cboPhongBan.Enabled = false;
                    }
                }

                _dangKhoiTao = false;

                // 4. CHỨC NĂNG CHÍNH: Tự động nạp dữ liệu lên lưới ngay khi mở Form thành công!
                LoadDanhSachChamCong();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Lỗi khởi tạo form: " + ex.Message, "Thông báo lỗi", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        // NẠP DỮ LIỆU COMBOBOX PHÒNG BAN
        private void LoadComboBoxPhongBan()
        {
            DataTable dtPB = new DataTable();
            dtPB.Columns.Add("MaPB", typeof(string));
            dtPB.Columns.Add("TenPB", typeof(string));

            DataRow rowAll = dtPB.NewRow();
            rowAll["MaPB"] = "ALL";
            rowAll["TenPB"] = "--- Toàn bộ ---";
            dtPB.Rows.Add(rowAll);

            try
            {
                DataTable dtTuDatabase = bll.LayDanhSachPhongBan();
                if (dtTuDatabase != null && dtTuDatabase.Rows.Count > 0)
                {
                    foreach (DataRow r in dtTuDatabase.Rows)
                    {
                        DataRow newRow = dtPB.NewRow();
                        newRow["MaPB"] = r["MaPB"].ToString();
                        newRow["TenPB"] = r["TenPB"].ToString();
                        dtPB.Rows.Add(newRow);
                    }
                }
            }
            catch
            {
                // Giữ nguyên dòng "Toàn bộ" nếu xảy ra lỗi kết nối CSDL
            }

            cboPhongBan.DataSource = null;
            cboPhongBan.DisplayMember = "TenPB";
            cboPhongBan.ValueMember = "MaPB";
            cboPhongBan.DataSource = dtPB;

            if (cboPhongBan.Items.Count > 0)
            {
                cboPhongBan.SelectedIndex = 0;
            }
        }

        // TỰ ĐỘNG TẢI VÀ ĐIỀU PHỐI DỮ LIỆU LÊN GRIDVIEW
        private void LoadDanhSachChamCong()
        {
            try
            {
                int? maNhanVien = null;

                if (_quyenHan == 4)
                {
                    maNhanVien = AppSession.MaNV;
                    _isChiTiet = true;
                }
                else
                {
                    string textTim = txtTimNhanvien.Text.Trim();
                    // Sửa lỗi: Chỉ nhận tìm kiếm khi ô text khác rỗng và không phải là chuỗi gợi ý
                    if (!string.IsNullOrEmpty(textTim) && textTim != PLACEHOLDER_TEXT && textTim != "Không có quyền")
                    {
                        if (int.TryParse(textTim, out int parseID))
                        {
                            maNhanVien = parseID;
                            _isChiTiet = true;

                            if (!bll.KiemTraQuyenXemNV(AppSession.MaNV, maNhanVien.Value, _quyenHan, _maPBLogin))
                            {
                                MessageBox.Show("Bạn không có quyền xem thông tin chấm công của nhân viên mang mã số này!",
                                                "Từ chối truy cập", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                                dgvChamCong.DataSource = null;
                                return;
                            }
                        }
                        else
                        {
                            MessageBox.Show("Mã số nhân viên tìm kiếm bắt buộc phải nhập ký tự số!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                            return;
                        }
                    }
                    else
                    {
                        // Nếu ô tìm kiếm trống hoặc đang hiện "Tìm nhân viên" -> Mặc định load danh sách tổng hợp
                        _isChiTiet = false;
                    }
                }

                int thang = dtpNgay.Value.Month;
                int nam = dtpNgay.Value.Year;

                string maPBSelected = "ALL";
                if (cboPhongBan.SelectedValue != null)
                {
                    maPBSelected = cboPhongBan.SelectedValue.ToString();
                }

                // Thực thi nạp dữ liệu từ tầng BLL xuống CSDL
                if (_isChiTiet && maNhanVien.HasValue)
                {
                    _danhSachChiTiet = bll.LayChiTiet1Nguoi(maNhanVien.Value, nam, thang);
                    dgvChamCong.DataSource = null;
                    dgvChamCong.DataSource = _danhSachChiTiet;
                }
                else
                {
                    DataTable dtPivot = bll.LayBangCongTongHopPivot(thang, nam, maPBSelected);
                    dgvChamCong.DataSource = null;
                    dgvChamCong.DataSource = dtPivot;
                }

                DinhDangTieuDeCacCot();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Lỗi khi tải dữ liệu bảng công: " + ex.Message, "Lỗi hệ thống", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void DinhDangTieuDeCacCot()
        {
            if (dgvChamCong.Columns.Count == 0) return;

            if (dgvChamCong.Columns.Contains("MaNV")) dgvChamCong.Columns["MaNV"].HeaderText = "Mã NV";
            if (dgvChamCong.Columns.Contains("HoTen")) dgvChamCong.Columns["HoTen"].HeaderText = "Họ và tên";
            if (dgvChamCong.Columns.Contains("TenPB")) dgvChamCong.Columns["TenPB"].HeaderText = "Phòng ban";
            if (dgvChamCong.Columns.Contains("Ngay")) dgvChamCong.Columns["Ngay"].HeaderText = "Ngày";
            if (dgvChamCong.Columns.Contains("Thu")) dgvChamCong.Columns["Thu"].HeaderText = "Thứ";
            if (dgvChamCong.Columns.Contains("KyHieu")) dgvChamCong.Columns["KyHieu"].HeaderText = "Ký hiệu";
            if (dgvChamCong.Columns.Contains("Giovao")) dgvChamCong.Columns["Giovao"].HeaderText = "Giờ vào";
            if (dgvChamCong.Columns.Contains("Giora")) dgvChamCong.Columns["Giora"].HeaderText = "Giờ ra";
            if (dgvChamCong.Columns.Contains("Dimuon")) dgvChamCong.Columns["Dimuon"].HeaderText = "Đi muộn (phút)";
            if (dgvChamCong.Columns.Contains("Vesom")) dgvChamCong.Columns["Vesom"].HeaderText = "Về sớm (phút)";
            if (dgvChamCong.Columns.Contains("ThoigianOT")) dgvChamCong.Columns["ThoigianOT"].HeaderText = "Giờ OT";
            if (dgvChamCong.Columns.Contains("TongCong")) dgvChamCong.Columns["TongCong"].HeaderText = "Tổng công";
        }

        // ═══════════════════════════════════════════════════════════
        // LOGIC XỬ LÝ TRẠNG THÁI CHỮ GỢI Ý CỦA Ô TÌM KIẾM (PLACEHOLDER)
        // ═══════════════════════════════════════════════════════════
        private void Xuly_txtTimNhanvien_Enter(object sender, EventArgs e)
        {
            if (_quyenHan == 4) return;
            if (txtTimNhanvien.Text == PLACEHOLDER_TEXT)
            {
                txtTimNhanvien.Text = "";
                txtTimNhanvien.ForeColor = Color.Black;
            }
        }

        private void Xuly_txtTimNhanvien_Leave(object sender, EventArgs e)
        {
            if (_quyenHan == 4) return;
            if (string.IsNullOrWhiteSpace(txtTimNhanvien.Text))
            {
                txtTimNhanvien.Text = PLACEHOLDER_TEXT;
                txtTimNhanvien.ForeColor = Color.Gray;

                // Khi người dùng xóa trống ô tìm kiếm và bấm ra ngoài -> Tự động load lại danh sách tổng hợp
                LoadDanhSachChamCong();
            }
        }

        private void Xuly_txtTimNhanvien_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.KeyCode == Keys.Enter)
            {
                e.Handled = true;
                e.SuppressKeyPress = true; // Tắt tiếng bíp Windows kêu khó chịu
                LoadDanhSachChamCong();
            }
        }

        // ═══════════════════════════════════════════════════════════
        // TỰ ĐỘNG TẢI LẠI KHI THAY ĐỔI THỜI GIAN HOẶC PHÒNG BAN
        // ═══════════════════════════════════════════════════════════
        private void dtpNgay_ValueChanged(object sender, EventArgs e)
        {
            if (!_dangKhoiTao)
            {
                LoadDanhSachChamCong();
            }
        }

        private void cboPhongBan_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (!_dangKhoiTao)
            {
                LoadDanhSachChamCong();
            }
        }

        // ═══════════════════════════════════════════════════════════
        // CÁC HÀM ĐỂ TRÁNH LỖI BIÊN DỊCH VỚI FILE DESIGNER CŨ
        // ═══════════════════════════════════════════════════════════
        private void txtTimNhanvien_Enter(object sender, EventArgs e) { }
        private void TxtTimNhanvien_Enter(object sender, EventArgs e) { }
        private void txtTimNhanvien_Leave(object sender, EventArgs e) { }
        private void TxtTimNhanvien_Leave(object sender, EventArgs e) { }
        private void txtTimNhanvien_KeyDown(object sender, KeyEventArgs e) { }
        private void TxtTimNhanvien_KeyDown(object sender, KeyEventArgs e) { }
        private void btnXem_Click(object sender, EventArgs e) { }
        private void btnSuaKyHieu_Click(object sender, EventArgs e) { }

        private void btnXuatExcel_Click(object sender, EventArgs e)
        {
            if (dgvChamCong.Rows.Count == 0)
            {
                MessageBox.Show("Không tìm thấy dữ liệu để xuất báo cáo Excel!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            using (SaveFileDialog sfd = new SaveFileDialog())
            {
                sfd.Filter = "Excel Files (*.xls)|*.xls";
                sfd.FileName = "Bang_Cham_Cong_Thang_" + dtpNgay.Value.ToString("MM_yyyy");

                if (sfd.ShowDialog() == DialogResult.OK)
                {
                    try
                    {
                        using (StreamWriter sw = new StreamWriter(sfd.FileName, false, Encoding.Unicode))
                        {
                            var headers = new List<string>();
                            for (int i = 0; i < dgvChamCong.Columns.Count; i++)
                                if (dgvChamCong.Columns[i].Visible)
                                    headers.Add(dgvChamCong.Columns[i].HeaderText.Replace("\n", " "));
                            sw.WriteLine(string.Join("\t", headers));

                            for (int i = 0; i < dgvChamCong.Rows.Count; i++)
                            {
                                var cells = new List<string>();
                                for (int j = 0; j < dgvChamCong.Columns.Count; j++)
                                    if (dgvChamCong.Columns[j].Visible)
                                        cells.Add(dgvChamCong.Rows[i].Cells[j].Value?.ToString() ?? "");
                                sw.WriteLine(string.Join("\t", cells));
                            }
                        }
                        MessageBox.Show("Xuất dữ liệu báo cáo Excel thành công!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show("Lỗi ghi file Excel: " + ex.Message, "Lỗi", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    }
                }
            }
        }
    }
}