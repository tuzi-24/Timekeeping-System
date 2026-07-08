using BLL;
using Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace GUI
{
    public partial class frmAccount : frmBase
    {
        private TaiKhoanBLL accountBLL = new TaiKhoanBLL();

        public frmAccount()
        {
            InitializeComponent();
        }

        // Sự kiện xảy ra khi Form được tải lên màn hình
        private void frmAccount_Load(object sender, EventArgs e)
        {
            LoadAccountInformation();
        }

        // Hàm lấy dữ liệu từ BLL và điền vào các ô thông tin bên phải
        private void LoadAccountInformation()
        {
            // Sử dụng GlobalSession.MaNV đã có sẵn trong hệ thống của bạn
            AccountEntity acc = accountBLL.TaiThongTinNhanVien(AppSession.MaNV);

            if (acc != null)
            {
                lblMaNV.Text = acc.MaNV.ToString();
                lblHoTen.Text = acc.HoTen;
                lblPhongBan.Text = acc.TenPB;
                lblChucVu.Text = acc.TenCV;

                // Định dạng hiển thị phép: "Phép còn lại / Tổng phép năm ngày"
                lblPhepConLai.Text = $"{acc.PhepConLai} / {acc.TongPhepNam} ngày";

                // Xử lý hiển thị ảnh lên picAvatar cục bộ nếu database đã có ảnh ban đầu
                if (acc.Avatar != null && acc.Avatar.Length > 0)
                {
                    using (MemoryStream ms = new MemoryStream(acc.Avatar))
                    {
                        picAvatar.Image = Image.FromStream(ms);
                    }
                    picAvatar.SizeMode = PictureBoxSizeMode.StretchImage;
                }
                else if (frmBase.SharedAvatar != null)
                {
                    // Nếu DB chưa có nhưng lớp Base đang giữ ảnh tạm thời thì dùng luôn
                    picAvatar.Image = frmBase.SharedAvatar;
                    picAvatar.SizeMode = PictureBoxSizeMode.StretchImage;
                }
            }
            else
            {
                MessageBox.Show("Không thể tải thông tin tài khoản!", "Lỗi", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void btnChangeAvatar_Click(object sender, EventArgs e)
        {
            // 1. Mở hộp thoại chọn file ảnh
            using (OpenFileDialog ofd = new OpenFileDialog())
            {
                ofd.Title = "Chọn ảnh đại diện";
                ofd.Filter = "Image Files|*.jpg;*.jpeg;*.png;*.bmp;*.gif;*.webp";

                if (ofd.ShowDialog() != DialogResult.OK) return;

                Image selectedImage;
                try
                {
                    // Đọc bằng byte[] để tránh lỗi file bị khóa
                    byte[] imgBytes = File.ReadAllBytes(ofd.FileName);
                    using (var ms = new MemoryStream(imgBytes))
                    {
                        selectedImage = Image.FromStream(ms);
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Không thể đọc file ảnh: " + ex.Message, "Lỗi");
                    return;
                }

                // 2. Mở frmCropImage, truyền ảnh vào để cắt
                frmCropImage cropForm = new frmCropImage();
                cropForm.OriginalImage = selectedImage;

                // 3. Hiển thị dạng Dialog để chờ người dùng cắt xong
                DialogResult result = cropForm.ShowDialog(this);

                // 4. Nếu người dùng nhấn "Crop" (DialogResult.OK) thì cập nhật ảnh
                if (result == DialogResult.OK && frmBase.SharedAvatar != null)
                {
                    // Cập nhật UI của thanh Sidebar/Thanh điều hướng chung của Hệ thống thông qua frmBase
                    UpdateAvatarUI();

                    // Cập nhật lại PictureBox picAvatar ngay trên Form thông tin tài khoản này
                    picAvatar.Image = frmBase.SharedAvatar;
                    picAvatar.SizeMode = PictureBoxSizeMode.StretchImage;

                    // Lưu đồng thời: 1 xuống Database SQL, 2 ra File cục bộ máy
                    byte[] dbImageBytes = ImageToByteArray(frmBase.SharedAvatar);
                    accountBLL.UpdateAvatar(AppSession.MaNV, dbImageBytes);

                    SaveAvatarToFile(frmBase.SharedAvatar);

                    MessageBox.Show("Cập nhật ảnh đại diện thành công!", "Thành công",
                        MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
            }
        }

        // Hàm phụ trợ chuyển đổi đối tượng Image thành mảng byte[] để lưu vào SQL Server varbinary(max)
        private byte[] ImageToByteArray(Image imageIn)
        {
            using (var ms = new MemoryStream())
            {
                // Sử dụng định dạng Png để giữ nguyên độ trong suốt (nếu có)
                imageIn.Save(ms, ImageFormat.Png);
                return ms.ToArray();
            }
        }

        private void SaveAvatarToFile(Image avatar)
        {
            try
            {
                // Lưu vào thư mục AppData để không bị mất khi chạy lại
                string folder = Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
                    "QLChamCong"
                );
                Directory.CreateDirectory(folder);

                string filePath = Path.Combine(folder, $"avatar_{AppSession.MaNV}.png");
                avatar.Save(filePath, System.Drawing.Imaging.ImageFormat.Png);

                // Lưu đường dẫn vào Settings để frmBase load lại lần sau
                Properties.Settings.Default.AvatarPath = filePath;
                Properties.Settings.Default.Save();
            }
            catch (Exception ex)
            {
                MessageBox.Show("Không thể lưu ảnh ra file cục bộ: " + ex.Message, "Lỗi");
            }
        }

        private void btnChangePassword_Click(object sender, EventArgs e)
        {
            NavigateTo(new frmChangePassword());
        }

        private void btnLogout_Click(object sender, EventArgs e)
        {
            if (MessageBox.Show("Bạn có muốn đăng xuất?", "Xác nhận", MessageBoxButtons.YesNo) == DialogResult.Yes)
            {
                Properties.Settings.Default.IsLoggedIn = false;
                Properties.Settings.Default.RememberMe = false;
                Properties.Settings.Default.Save();

                this.DialogResult = DialogResult.Abort;
                this.Close();
            }
        }

    }
}