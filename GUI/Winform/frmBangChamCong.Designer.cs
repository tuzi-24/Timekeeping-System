namespace GUI
{
    partial class frmBangChamCong
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
            this.pnlBase = new System.Windows.Forms.TableLayoutPanel();
            this.pnlHeader = new System.Windows.Forms.TableLayoutPanel();
            this.picLogo = new System.Windows.Forms.PictureBox();
            this.lblName = new System.Windows.Forms.Label();
            this.picAvatar = new System.Windows.Forms.PictureBox();
            this.pnlBangChamCong = new System.Windows.Forms.TableLayoutPanel();
            this.pnlFilters = new System.Windows.Forms.TableLayoutPanel();
            this.cboPhongBan = new System.Windows.Forms.ComboBox();
            this.dtpNgay = new System.Windows.Forms.DateTimePicker();
            this.txtTimNhanvien = new System.Windows.Forms.TextBox();
            this.btnXuatExcel = new System.Windows.Forms.Button();
            this.dgvChamCong = new System.Windows.Forms.DataGridView();
            this.pnlBase.SuspendLayout();
            this.pnlHeader.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.picLogo)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.picAvatar)).BeginInit();
            this.pnlBangChamCong.SuspendLayout();
            this.pnlFilters.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dgvChamCong)).BeginInit();
            this.SuspendLayout();
            // 
            // pnlBase
            // 
            this.pnlBase.ColumnCount = 1;
            this.pnlBase.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 100F));
            this.pnlBase.Controls.Add(this.pnlHeader, 0, 0);
            this.pnlBase.Controls.Add(this.pnlBangChamCong, 0, 1);
            this.pnlBase.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pnlBase.Location = new System.Drawing.Point(0, 0);
            this.pnlBase.Name = "pnlBase";
            this.pnlBase.RowCount = 2;
            this.pnlBase.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 11.11111F));
            this.pnlBase.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 88.88889F));
            this.pnlBase.Size = new System.Drawing.Size(873, 450);
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
            this.pnlHeader.Controls.Add(this.picAvatar, 2, 0);
            this.pnlHeader.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pnlHeader.Location = new System.Drawing.Point(3, 3);
            this.pnlHeader.Name = "pnlHeader";
            this.pnlHeader.RowCount = 1;
            this.pnlHeader.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 100F));
            this.pnlHeader.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Absolute, 43F));
            this.pnlHeader.Size = new System.Drawing.Size(867, 43);
            this.pnlHeader.TabIndex = 0;
            // 
            // picLogo
            // 
            this.picLogo.Dock = System.Windows.Forms.DockStyle.Fill;
            this.picLogo.Image = global::GUI.Properties.Resources.picLogo;
            this.picLogo.Location = new System.Drawing.Point(3, 3);
            this.picLogo.Name = "picLogo";
            this.picLogo.Size = new System.Drawing.Size(42, 37);
            this.picLogo.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.picLogo.TabIndex = 0;
            this.picLogo.TabStop = false;
            // 
            // lblName
            // 
            this.lblName.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.lblName.AutoSize = true;
            this.lblName.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblName.Location = new System.Drawing.Point(51, 7);
            this.lblName.Name = "lblName";
            this.lblName.Size = new System.Drawing.Size(430, 29);
            this.lblName.TabIndex = 1;
            this.lblName.Text = "PHẦN MỀM QUẢN LÝ CHẤM CÔNG";
            // 
            // picAvatar
            // 
            this.picAvatar.Dock = System.Windows.Forms.DockStyle.Fill;
            this.picAvatar.Location = new System.Drawing.Point(821, 3);
            this.picAvatar.Name = "picAvatar";
            this.picAvatar.Size = new System.Drawing.Size(43, 37);
            this.picAvatar.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.picAvatar.TabIndex = 2;
            this.picAvatar.TabStop = false;
            // 
            // pnlBangChamCong
            // 
            this.pnlBangChamCong.ColumnCount = 1;
            this.pnlBangChamCong.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 100F));
            this.pnlBangChamCong.Controls.Add(this.pnlFilters, 0, 0);
            this.pnlBangChamCong.Controls.Add(this.dgvChamCong, 0, 1);
            this.pnlBangChamCong.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pnlBangChamCong.Location = new System.Drawing.Point(3, 52);
            this.pnlBangChamCong.Name = "pnlBangChamCong";
            this.pnlBangChamCong.RowCount = 2;
            this.pnlBangChamCong.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 11.2538F));
            this.pnlBangChamCong.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 88.74619F));
            this.pnlBangChamCong.Size = new System.Drawing.Size(867, 395);
            this.pnlBangChamCong.TabIndex = 1;
            // 
            // pnlFilters
            // 
            this.pnlFilters.ColumnCount = 4;
            this.pnlFilters.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 26.24917F));
            this.pnlFilters.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 27.81478F));
            this.pnlFilters.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 26.24917F));
            this.pnlFilters.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 19.68687F));
            this.pnlFilters.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Absolute, 20F));
            this.pnlFilters.Controls.Add(this.cboPhongBan, 0, 0);
            this.pnlFilters.Controls.Add(this.dtpNgay, 1, 0);
            this.pnlFilters.Controls.Add(this.txtTimNhanvien, 3, 0);
            this.pnlFilters.Controls.Add(this.btnXuatExcel, 2, 0);
            this.pnlFilters.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pnlFilters.Location = new System.Drawing.Point(3, 3);
            this.pnlFilters.Name = "pnlFilters";
            this.pnlFilters.RowCount = 1;
            this.pnlFilters.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 100F));
            this.pnlFilters.Size = new System.Drawing.Size(861, 38);
            this.pnlFilters.TabIndex = 0;
            // 
            // cboPhongBan
            // 
            this.cboPhongBan.Dock = System.Windows.Forms.DockStyle.Fill;
            this.cboPhongBan.FormattingEnabled = true;
            this.cboPhongBan.Location = new System.Drawing.Point(3, 3);
            this.cboPhongBan.Name = "cboPhongBan";
            this.cboPhongBan.Size = new System.Drawing.Size(220, 28);
            this.cboPhongBan.TabIndex = 0;
            this.cboPhongBan.SelectedIndexChanged += new System.EventHandler(this.cboPhongBan_SelectedIndexChanged);
            // 
            // dtpNgay
            // 
            this.dtpNgay.CustomFormat = "MM/yyyy";
            this.dtpNgay.Dock = System.Windows.Forms.DockStyle.Fill;
            this.dtpNgay.Format = System.Windows.Forms.DateTimePickerFormat.Custom;
            this.dtpNgay.Location = new System.Drawing.Point(229, 3);
            this.dtpNgay.Name = "dtpNgay";
            this.dtpNgay.Size = new System.Drawing.Size(233, 26);
            this.dtpNgay.TabIndex = 1;
            this.dtpNgay.ValueChanged += new System.EventHandler(this.dtpNgay_ValueChanged);
            // 
            // txtTimNhanvien
            // 
            this.txtTimNhanvien.Dock = System.Windows.Forms.DockStyle.Fill;
            this.txtTimNhanvien.ForeColor = System.Drawing.SystemColors.GrayText;
            this.txtTimNhanvien.Location = new System.Drawing.Point(694, 3);
            this.txtTimNhanvien.Name = "txtTimNhanvien";
            this.txtTimNhanvien.Size = new System.Drawing.Size(164, 26);
            this.txtTimNhanvien.TabIndex = 2;
            this.txtTimNhanvien.Text = "Tìm nhân viên";
            this.txtTimNhanvien.Enter += new System.EventHandler(this.TxtTimNhanvien_Enter);
            this.txtTimNhanvien.KeyDown += new System.Windows.Forms.KeyEventHandler(this.txtTimNhanvien_KeyDown);
            this.txtTimNhanvien.Leave += new System.EventHandler(this.TxtTimNhanvien_Leave);
            // 
            // btnXuatExcel
            // 
            this.btnXuatExcel.Anchor = System.Windows.Forms.AnchorStyles.Top;
            this.btnXuatExcel.Location = new System.Drawing.Point(507, 3);
            this.btnXuatExcel.Name = "btnXuatExcel";
            this.btnXuatExcel.Size = new System.Drawing.Size(141, 28);
            this.btnXuatExcel.TabIndex = 3;
            this.btnXuatExcel.Text = "Xuất Excel";
            this.btnXuatExcel.UseVisualStyleBackColor = true;
            this.btnXuatExcel.Click += new System.EventHandler(this.btnXuatExcel_Click);
            // 
            // dgvChamCong
            // 
            this.dgvChamCong.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dgvChamCong.Dock = System.Windows.Forms.DockStyle.Fill;
            this.dgvChamCong.Location = new System.Drawing.Point(3, 47);
            this.dgvChamCong.Name = "dgvChamCong";
            this.dgvChamCong.RowHeadersWidth = 62;
            this.dgvChamCong.RowTemplate.Height = 28;
            this.dgvChamCong.Size = new System.Drawing.Size(861, 345);
            this.dgvChamCong.TabIndex = 1;
            // 
            // frmBangChamCong
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(9F, 20F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(873, 450);
            this.Controls.Add(this.pnlBase);
            this.Name = "frmBangChamCong";
            this.StartPosition = System.Windows.Forms.FormStartPosition.Manual;
            this.Text = "Bảng chấm công";
            this.pnlBase.ResumeLayout(false);
            this.pnlHeader.ResumeLayout(false);
            this.pnlHeader.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.picLogo)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.picAvatar)).EndInit();
            this.pnlBangChamCong.ResumeLayout(false);
            this.pnlFilters.ResumeLayout(false);
            this.pnlFilters.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dgvChamCong)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.TableLayoutPanel pnlBase;
        private System.Windows.Forms.TableLayoutPanel pnlHeader;
        private System.Windows.Forms.PictureBox picLogo;
        private System.Windows.Forms.Label lblName;
        private System.Windows.Forms.PictureBox picAvatar;
        private System.Windows.Forms.TableLayoutPanel pnlBangChamCong;
        private System.Windows.Forms.TableLayoutPanel pnlFilters;
        private System.Windows.Forms.ComboBox cboPhongBan;
        private System.Windows.Forms.DateTimePicker dtpNgay;
        private System.Windows.Forms.TextBox txtTimNhanvien;
        private System.Windows.Forms.Button btnXuatExcel;
        private System.Windows.Forms.DataGridView dgvChamCong;
    }
}