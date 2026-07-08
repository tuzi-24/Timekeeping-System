namespace GUI
{
    partial class frmAccount
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.pnlAccount = new System.Windows.Forms.TableLayoutPanel();
            this.pnlAvatar = new System.Windows.Forms.TableLayoutPanel();
            this.btnLogout = new System.Windows.Forms.Button();
            this.btnChangePassword = new System.Windows.Forms.Button();
            this.picAvatar = new System.Windows.Forms.PictureBox();
            this.btnChangeAvatar = new System.Windows.Forms.Button();
            this.pnlInfor = new System.Windows.Forms.TableLayoutPanel();
            this.lblTitlePhepConLai = new System.Windows.Forms.Label();
            this.lblTitleChucVu = new System.Windows.Forms.Label();
            this.lblTitlePhongBan = new System.Windows.Forms.Label();
            this.lblTitleHoTen = new System.Windows.Forms.Label();
            this.lblTitleMaNV = new System.Windows.Forms.Label();
            this.lblMaNV = new System.Windows.Forms.Label();
            this.lblHoTen = new System.Windows.Forms.Label();
            this.lblPhongBan = new System.Windows.Forms.Label();
            this.lblChucVu = new System.Windows.Forms.Label();
            this.lblPhepConLai = new System.Windows.Forms.Label();
            this.pnlBase = new System.Windows.Forms.TableLayoutPanel();
            this.pnlHeader = new System.Windows.Forms.TableLayoutPanel();
            this.picLogo = new System.Windows.Forms.PictureBox();
            this.lblName = new System.Windows.Forms.Label();
            this.pnlAccount.SuspendLayout();
            this.pnlAvatar.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.picAvatar)).BeginInit();
            this.pnlInfor.SuspendLayout();
            this.pnlBase.SuspendLayout();
            this.pnlHeader.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.picLogo)).BeginInit();
            this.SuspendLayout();
            // 
            // pnlAccount
            // 
            this.pnlAccount.ColumnCount = 2;
            this.pnlAccount.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 30F));
            this.pnlAccount.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 70F));
            this.pnlAccount.Controls.Add(this.pnlAvatar, 0, 0);
            this.pnlAccount.Controls.Add(this.pnlInfor, 1, 0);
            this.pnlAccount.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pnlAccount.Location = new System.Drawing.Point(3, 52);
            this.pnlAccount.Name = "pnlAccount";
            this.pnlAccount.RowCount = 1;
            this.pnlAccount.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 100F));
            this.pnlAccount.Size = new System.Drawing.Size(794, 395);
            this.pnlAccount.TabIndex = 0;
            // 
            // pnlAvatar
            // 
            this.pnlAvatar.ColumnCount = 1;
            this.pnlAvatar.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 100F));
            this.pnlAvatar.Controls.Add(this.btnLogout, 0, 3);
            this.pnlAvatar.Controls.Add(this.btnChangePassword, 0, 2);
            this.pnlAvatar.Controls.Add(this.picAvatar, 0, 0);
            this.pnlAvatar.Controls.Add(this.btnChangeAvatar, 0, 1);
            this.pnlAvatar.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pnlAvatar.Location = new System.Drawing.Point(3, 3);
            this.pnlAvatar.Name = "pnlAvatar";
            this.pnlAvatar.RowCount = 4;
            this.pnlAvatar.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 40F));
            this.pnlAvatar.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 17F));
            this.pnlAvatar.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 17F));
            this.pnlAvatar.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 26F));
            this.pnlAvatar.Size = new System.Drawing.Size(232, 389);
            this.pnlAvatar.TabIndex = 0;
            // 
            // btnLogout
            // 
            this.btnLogout.Anchor = System.Windows.Forms.AnchorStyles.None;
            this.btnLogout.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnLogout.Location = new System.Drawing.Point(53, 318);
            this.btnLogout.Name = "btnLogout";
            this.btnLogout.Size = new System.Drawing.Size(126, 39);
            this.btnLogout.TabIndex = 3;
            this.btnLogout.Text = "Đăng xuất";
            this.btnLogout.UseVisualStyleBackColor = true;
            this.btnLogout.Click += new System.EventHandler(this.btnLogout_Click);
            // 
            // btnChangePassword
            // 
            this.btnChangePassword.Anchor = System.Windows.Forms.AnchorStyles.None;
            this.btnChangePassword.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnChangePassword.Location = new System.Drawing.Point(57, 238);
            this.btnChangePassword.Name = "btnChangePassword";
            this.btnChangePassword.Size = new System.Drawing.Size(117, 32);
            this.btnChangePassword.TabIndex = 2;
            this.btnChangePassword.Text = "Đổi mật khẩu";
            this.btnChangePassword.UseVisualStyleBackColor = true;
            this.btnChangePassword.Click += new System.EventHandler(this.btnChangePassword_Click);
            // 
            // picAvatar
            // 
            this.picAvatar.Dock = System.Windows.Forms.DockStyle.Fill;
            this.picAvatar.Location = new System.Drawing.Point(3, 3);
            this.picAvatar.Name = "picAvatar";
            this.picAvatar.Size = new System.Drawing.Size(226, 149);
            this.picAvatar.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.picAvatar.TabIndex = 0;
            this.picAvatar.TabStop = false;
            // 
            // btnChangeAvatar
            // 
            this.btnChangeAvatar.Anchor = System.Windows.Forms.AnchorStyles.None;
            this.btnChangeAvatar.Cursor = System.Windows.Forms.Cursors.Hand;
            this.btnChangeAvatar.Location = new System.Drawing.Point(57, 172);
            this.btnChangeAvatar.Name = "btnChangeAvatar";
            this.btnChangeAvatar.Size = new System.Drawing.Size(117, 32);
            this.btnChangeAvatar.TabIndex = 1;
            this.btnChangeAvatar.Text = "Đổi Avatar";
            this.btnChangeAvatar.UseVisualStyleBackColor = true;
            this.btnChangeAvatar.Click += new System.EventHandler(this.btnChangeAvatar_Click);
            // 
            // pnlInfor
            // 
            this.pnlInfor.ColumnCount = 2;
            this.pnlInfor.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 35F));
            this.pnlInfor.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 65F));
            this.pnlInfor.Controls.Add(this.lblTitlePhepConLai, 0, 4);
            this.pnlInfor.Controls.Add(this.lblTitleChucVu, 0, 3);
            this.pnlInfor.Controls.Add(this.lblTitlePhongBan, 0, 2);
            this.pnlInfor.Controls.Add(this.lblTitleHoTen, 0, 1);
            this.pnlInfor.Controls.Add(this.lblTitleMaNV, 0, 0);
            this.pnlInfor.Controls.Add(this.lblMaNV, 1, 0);
            this.pnlInfor.Controls.Add(this.lblHoTen, 1, 1);
            this.pnlInfor.Controls.Add(this.lblPhongBan, 1, 2);
            this.pnlInfor.Controls.Add(this.lblChucVu, 1, 3);
            this.pnlInfor.Controls.Add(this.lblPhepConLai, 1, 4);
            this.pnlInfor.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pnlInfor.Location = new System.Drawing.Point(241, 3);
            this.pnlInfor.Name = "pnlInfor";
            this.pnlInfor.RowCount = 6;
            this.pnlInfor.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 12F));
            this.pnlInfor.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 12F));
            this.pnlInfor.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 12F));
            this.pnlInfor.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 12F));
            this.pnlInfor.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 12F));
            this.pnlInfor.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 40F));
            this.pnlInfor.Size = new System.Drawing.Size(550, 389);
            this.pnlInfor.TabIndex = 1;
            // 
            // lblTitlePhepConLai
            // 
            this.lblTitlePhepConLai.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.lblTitlePhepConLai.AutoSize = true;
            this.lblTitlePhepConLai.Location = new System.Drawing.Point(3, 197);
            this.lblTitlePhepConLai.Name = "lblTitlePhepConLai";
            this.lblTitlePhepConLai.Size = new System.Drawing.Size(99, 20);
            this.lblTitlePhepConLai.TabIndex = 10;
            this.lblTitlePhepConLai.Text = "Phép còn lại:";
            // 
            // lblTitleChucVu
            // 
            this.lblTitleChucVu.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.lblTitleChucVu.AutoSize = true;
            this.lblTitleChucVu.Location = new System.Drawing.Point(3, 151);
            this.lblTitleChucVu.Name = "lblTitleChucVu";
            this.lblTitleChucVu.Size = new System.Drawing.Size(70, 20);
            this.lblTitleChucVu.TabIndex = 9;
            this.lblTitleChucVu.Text = "Chức vụ:";
            // 
            // lblTitlePhongBan
            // 
            this.lblTitlePhongBan.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.lblTitlePhongBan.AutoSize = true;
            this.lblTitlePhongBan.Location = new System.Drawing.Point(3, 105);
            this.lblTitlePhongBan.Name = "lblTitlePhongBan";
            this.lblTitlePhongBan.Size = new System.Drawing.Size(90, 20);
            this.lblTitlePhongBan.TabIndex = 8;
            this.lblTitlePhongBan.Text = "Phòng ban:";
            // 
            // lblTitleHoTen
            // 
            this.lblTitleHoTen.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.lblTitleHoTen.AutoSize = true;
            this.lblTitleHoTen.Location = new System.Drawing.Point(3, 59);
            this.lblTitleHoTen.Name = "lblTitleHoTen";
            this.lblTitleHoTen.Size = new System.Drawing.Size(61, 20);
            this.lblTitleHoTen.TabIndex = 7;
            this.lblTitleHoTen.Text = "Họ tên:";
            // 
            // lblTitleMaNV
            // 
            this.lblTitleMaNV.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.lblTitleMaNV.AutoSize = true;
            this.lblTitleMaNV.Location = new System.Drawing.Point(3, 13);
            this.lblTitleMaNV.Name = "lblTitleMaNV";
            this.lblTitleMaNV.Size = new System.Drawing.Size(107, 20);
            this.lblTitleMaNV.TabIndex = 6;
            this.lblTitleMaNV.Text = "Mã nhân viên:";
            // 
            // lblMaNV
            // 
            this.lblMaNV.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.lblMaNV.AutoSize = true;
            this.lblMaNV.Location = new System.Drawing.Point(195, 13);
            this.lblMaNV.Name = "lblMaNV";
            this.lblMaNV.Size = new System.Drawing.Size(0, 20);
            this.lblMaNV.TabIndex = 0;
            // 
            // lblHoTen
            // 
            this.lblHoTen.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.lblHoTen.AutoSize = true;
            this.lblHoTen.Location = new System.Drawing.Point(195, 59);
            this.lblHoTen.Name = "lblHoTen";
            this.lblHoTen.Size = new System.Drawing.Size(0, 20);
            this.lblHoTen.TabIndex = 3;
            // 
            // lblPhongBan
            // 
            this.lblPhongBan.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.lblPhongBan.AutoSize = true;
            this.lblPhongBan.Location = new System.Drawing.Point(195, 105);
            this.lblPhongBan.Name = "lblPhongBan";
            this.lblPhongBan.Size = new System.Drawing.Size(0, 20);
            this.lblPhongBan.TabIndex = 2;
            // 
            // lblChucVu
            // 
            this.lblChucVu.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.lblChucVu.AutoSize = true;
            this.lblChucVu.Location = new System.Drawing.Point(195, 151);
            this.lblChucVu.Name = "lblChucVu";
            this.lblChucVu.Size = new System.Drawing.Size(0, 20);
            this.lblChucVu.TabIndex = 1;
            // 
            // lblPhepConLai
            // 
            this.lblPhepConLai.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.lblPhepConLai.AutoSize = true;
            this.lblPhepConLai.Location = new System.Drawing.Point(195, 197);
            this.lblPhepConLai.Name = "lblPhepConLai";
            this.lblPhepConLai.Size = new System.Drawing.Size(0, 20);
            this.lblPhepConLai.TabIndex = 4;
            // 
            // pnlBase
            // 
            this.pnlBase.ColumnCount = 1;
            this.pnlBase.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 100F));
            this.pnlBase.Controls.Add(this.pnlHeader, 0, 0);
            this.pnlBase.Controls.Add(this.pnlAccount, 0, 1);
            this.pnlBase.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pnlBase.Location = new System.Drawing.Point(0, 0);
            this.pnlBase.Name = "pnlBase";
            this.pnlBase.RowCount = 2;
            this.pnlBase.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 11.11111F));
            this.pnlBase.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 88.88889F));
            this.pnlBase.Size = new System.Drawing.Size(800, 450);
            this.pnlBase.TabIndex = 1;
            // 
            // pnlHeader
            // 
            this.pnlHeader.ColumnCount = 3;
            this.pnlHeader.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 5.538798F));
            this.pnlHeader.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 88.92241F));
            this.pnlHeader.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 5.538798F));
            this.pnlHeader.Controls.Add(this.picLogo, 0, 0);
            this.pnlHeader.Controls.Add(this.lblName, 1, 0);
            this.pnlHeader.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pnlHeader.Location = new System.Drawing.Point(3, 3);
            this.pnlHeader.Name = "pnlHeader";
            this.pnlHeader.RowCount = 1;
            this.pnlHeader.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 100F));
            this.pnlHeader.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Absolute, 43F));
            this.pnlHeader.Size = new System.Drawing.Size(794, 43);
            this.pnlHeader.TabIndex = 0;
            // 
            // picLogo
            // 
            this.picLogo.Dock = System.Windows.Forms.DockStyle.Fill;
            this.picLogo.Image = global::GUI.Properties.Resources.picLogo;
            this.picLogo.Location = new System.Drawing.Point(3, 3);
            this.picLogo.Name = "picLogo";
            this.picLogo.Size = new System.Drawing.Size(37, 37);
            this.picLogo.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.picLogo.TabIndex = 0;
            this.picLogo.TabStop = false;
            // 
            // lblName
            // 
            this.lblName.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.lblName.AutoSize = true;
            this.lblName.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblName.Location = new System.Drawing.Point(46, 7);
            this.lblName.Name = "lblName";
            this.lblName.Size = new System.Drawing.Size(430, 29);
            this.lblName.TabIndex = 1;
            this.lblName.Text = "PHẦN MỀM QUẢN LÝ CHẤM CÔNG";
            // 
            // frmAccount
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(9F, 20F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Controls.Add(this.pnlBase);
            this.Name = "frmAccount";
            this.StartPosition = System.Windows.Forms.FormStartPosition.Manual;
            this.Text = "Account";
            this.Load += new System.EventHandler(this.frmAccount_Load);
            this.pnlAccount.ResumeLayout(false);
            this.pnlAvatar.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.picAvatar)).EndInit();
            this.pnlInfor.ResumeLayout(false);
            this.pnlInfor.PerformLayout();
            this.pnlBase.ResumeLayout(false);
            this.pnlHeader.ResumeLayout(false);
            this.pnlHeader.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.picLogo)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.TableLayoutPanel pnlAccount;
        private System.Windows.Forms.TableLayoutPanel pnlAvatar;
        private System.Windows.Forms.Button btnLogout;
        private System.Windows.Forms.Button btnChangePassword;
        private System.Windows.Forms.PictureBox picAvatar;
        private System.Windows.Forms.Button btnChangeAvatar;
        private System.Windows.Forms.TableLayoutPanel pnlInfor;
        private System.Windows.Forms.Label lblMaNV;
        private System.Windows.Forms.Label lblChucVu;
        private System.Windows.Forms.Label lblPhongBan;
        private System.Windows.Forms.TableLayoutPanel pnlBase;
        private System.Windows.Forms.TableLayoutPanel pnlHeader;
        private System.Windows.Forms.PictureBox picLogo;
        private System.Windows.Forms.Label lblName;
        private System.Windows.Forms.Label lblHoTen;
        private System.Windows.Forms.Label lblPhepConLai;
        private System.Windows.Forms.Label lblTitlePhepConLai;
        private System.Windows.Forms.Label lblTitleChucVu;
        private System.Windows.Forms.Label lblTitlePhongBan;
        private System.Windows.Forms.Label lblTitleHoTen;
        private System.Windows.Forms.Label lblTitleMaNV;
    }
}