namespace GUI
{
    partial class Base
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
            this.mnuMain = new System.Windows.Forms.MenuStrip();
            this.danhSáchNhânViênToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.thêmNhânViênToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.xóaNhânViênToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.thayĐổiThôngTinToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.bảngChấmCôngToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.xuấtBảngBiểuChấmCônToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.báoCáoChấmCôngToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.chấmCôngVàoToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.chấmCôngRaToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.quảnLýChấmCôngToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.tsTextBoxTimKiem = new System.Windows.Forms.ToolStripTextBox();
            this.pnlBase.SuspendLayout();
            this.pnlHeader.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.picLogo)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.picAvatar)).BeginInit();
            this.mnuMain.SuspendLayout();
            this.SuspendLayout();
            // 
            // pnlBase
            // 
            this.pnlBase.ColumnCount = 1;
            this.pnlBase.ColumnStyles.Add(new System.Windows.Forms.ColumnStyle(System.Windows.Forms.SizeType.Percent, 100F));
            this.pnlBase.Controls.Add(this.pnlHeader, 0, 0);
            this.pnlBase.Location = new System.Drawing.Point(8, 65);
            this.pnlBase.Name = "pnlBase";
            this.pnlBase.RowCount = 2;
            this.pnlBase.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 11.11111F));
            this.pnlBase.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Percent, 88.88889F));
            this.pnlBase.Size = new System.Drawing.Size(797, 373);
            this.pnlBase.TabIndex = 0;
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
            this.pnlHeader.RowStyles.Add(new System.Windows.Forms.RowStyle(System.Windows.Forms.SizeType.Absolute, 35F));
            this.pnlHeader.Size = new System.Drawing.Size(791, 35);
            this.pnlHeader.TabIndex = 0;
            // 
            // picLogo
            // 
            this.picLogo.Dock = System.Windows.Forms.DockStyle.Fill;
            this.picLogo.Image = global::GUI.Properties.Resources.picLogo;
            this.picLogo.Location = new System.Drawing.Point(3, 3);
            this.picLogo.Name = "picLogo";
            this.picLogo.Size = new System.Drawing.Size(37, 29);
            this.picLogo.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.picLogo.TabIndex = 0;
            this.picLogo.TabStop = false;
            // 
            // lblName
            // 
            this.lblName.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.lblName.AutoSize = true;
            this.lblName.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblName.Location = new System.Drawing.Point(46, 3);
            this.lblName.Name = "lblName";
            this.lblName.Size = new System.Drawing.Size(430, 29);
            this.lblName.TabIndex = 1;
            this.lblName.Text = "PHẦN MỀM QUẢN LÝ CHẤM CÔNG";
            this.lblName.Click += new System.EventHandler(this.lblName_Click);
            // 
            // picAvatar
            // 
            this.picAvatar.Dock = System.Windows.Forms.DockStyle.Fill;
            this.picAvatar.Location = new System.Drawing.Point(749, 3);
            this.picAvatar.Name = "picAvatar";
            this.picAvatar.Size = new System.Drawing.Size(39, 29);
            this.picAvatar.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.picAvatar.TabIndex = 2;
            this.picAvatar.TabStop = false;
            // 
            // mnuMain
            // 
            this.mnuMain.Dock = System.Windows.Forms.DockStyle.None;
            this.mnuMain.GripMargin = new System.Windows.Forms.Padding(2, 2, 0, 2);
            this.mnuMain.ImageScalingSize = new System.Drawing.Size(24, 24);
            this.mnuMain.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.danhSáchNhânViênToolStripMenuItem,
            this.bảngChấmCôngToolStripMenuItem,
            this.báoCáoChấmCôngToolStripMenuItem,
            this.quảnLýChấmCôngToolStripMenuItem,
            this.tsTextBoxTimKiem});
            this.mnuMain.Location = new System.Drawing.Point(8, 8);
            this.mnuMain.Name = "mnuMain";
            this.mnuMain.Size = new System.Drawing.Size(763, 35);
            this.mnuMain.TabIndex = 1;
            // 
            // danhSáchNhânViênToolStripMenuItem
            // 
            this.danhSáchNhânViênToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.thêmNhânViênToolStripMenuItem,
            this.xóaNhânViênToolStripMenuItem,
            this.thayĐổiThôngTinToolStripMenuItem});
            this.danhSáchNhânViênToolStripMenuItem.Name = "danhSáchNhânViênToolStripMenuItem";
            this.danhSáchNhânViênToolStripMenuItem.Size = new System.Drawing.Size(191, 31);
            this.danhSáchNhânViênToolStripMenuItem.Text = "Danh sách nhân viên";
            // 
            // thêmNhânViênToolStripMenuItem
            // 
            this.thêmNhânViênToolStripMenuItem.Name = "thêmNhânViênToolStripMenuItem";
            this.thêmNhânViênToolStripMenuItem.Size = new System.Drawing.Size(260, 34);
            this.thêmNhânViênToolStripMenuItem.Text = "Thêm nhân viên";
            // 
            // xóaNhânViênToolStripMenuItem
            // 
            this.xóaNhânViênToolStripMenuItem.Name = "xóaNhânViênToolStripMenuItem";
            this.xóaNhânViênToolStripMenuItem.Size = new System.Drawing.Size(260, 34);
            this.xóaNhânViênToolStripMenuItem.Text = "Xóa nhân viên";
            // 
            // thayĐổiThôngTinToolStripMenuItem
            // 
            this.thayĐổiThôngTinToolStripMenuItem.Name = "thayĐổiThôngTinToolStripMenuItem";
            this.thayĐổiThôngTinToolStripMenuItem.Size = new System.Drawing.Size(260, 34);
            this.thayĐổiThôngTinToolStripMenuItem.Text = "Thay đổi thông tin";
            // 
            // bảngChấmCôngToolStripMenuItem
            // 
            this.bảngChấmCôngToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.xuấtBảngBiểuChấmCônToolStripMenuItem});
            this.bảngChấmCôngToolStripMenuItem.Name = "bảngChấmCôngToolStripMenuItem";
            this.bảngChấmCôngToolStripMenuItem.Size = new System.Drawing.Size(161, 31);
            this.bảngChấmCôngToolStripMenuItem.Text = "Bảng chấm công";
            // 
            // xuấtBảngBiểuChấmCônToolStripMenuItem
            // 
            this.xuấtBảngBiểuChấmCônToolStripMenuItem.Name = "xuấtBảngBiểuChấmCônToolStripMenuItem";
            this.xuấtBảngBiểuChấmCônToolStripMenuItem.Size = new System.Drawing.Size(328, 34);
            this.xuấtBảngBiểuChấmCônToolStripMenuItem.Text = "Xuất bảng biểu chấm công";
            // 
            // báoCáoChấmCôngToolStripMenuItem
            // 
            this.báoCáoChấmCôngToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.chấmCôngVàoToolStripMenuItem,
            this.chấmCôngRaToolStripMenuItem});
            this.báoCáoChấmCôngToolStripMenuItem.Name = "báoCáoChấmCôngToolStripMenuItem";
            this.báoCáoChấmCôngToolStripMenuItem.Size = new System.Drawing.Size(119, 31);
            this.báoCáoChấmCôngToolStripMenuItem.Text = "Chấm công";
            // 
            // chấmCôngVàoToolStripMenuItem
            // 
            this.chấmCôngVàoToolStripMenuItem.Name = "chấmCôngVàoToolStripMenuItem";
            this.chấmCôngVàoToolStripMenuItem.Size = new System.Drawing.Size(239, 34);
            this.chấmCôngVàoToolStripMenuItem.Text = "Chấm công vào";
            // 
            // chấmCôngRaToolStripMenuItem
            // 
            this.chấmCôngRaToolStripMenuItem.Name = "chấmCôngRaToolStripMenuItem";
            this.chấmCôngRaToolStripMenuItem.Size = new System.Drawing.Size(239, 34);
            this.chấmCôngRaToolStripMenuItem.Text = "Chấm công ra ";
            // 
            // quảnLýChấmCôngToolStripMenuItem
            // 
            this.quảnLýChấmCôngToolStripMenuItem.Name = "quảnLýChấmCôngToolStripMenuItem";
            this.quảnLýChấmCôngToolStripMenuItem.Size = new System.Drawing.Size(180, 31);
            this.quảnLýChấmCôngToolStripMenuItem.Text = "Quản lý ca làm việc";
            // 
            // tsTextBoxTimKiem
            // 
            this.tsTextBoxTimKiem.Font = new System.Drawing.Font("Segoe UI", 9F);
            this.tsTextBoxTimKiem.ForeColor = System.Drawing.SystemColors.GrayText;
            this.tsTextBoxTimKiem.Name = "tsTextBoxTimKiem";
            this.tsTextBoxTimKiem.Size = new System.Drawing.Size(100, 31);
            this.tsTextBoxTimKiem.Text = "Tìm kiếm";
            // 
            // Base
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(9F, 20F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Controls.Add(this.mnuMain);
            this.Controls.Add(this.pnlBase);
            this.Name = "Base";
            this.Text = "Base";
            this.pnlBase.ResumeLayout(false);
            this.pnlHeader.ResumeLayout(false);
            this.pnlHeader.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.picLogo)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.picAvatar)).EndInit();
            this.mnuMain.ResumeLayout(false);
            this.mnuMain.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.TableLayoutPanel pnlBase;
        private System.Windows.Forms.Label lblName;
        private System.Windows.Forms.MenuStrip mnuMain;
        private System.Windows.Forms.ToolStripMenuItem danhSáchNhânViênToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem thêmNhânViênToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem xóaNhânViênToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem thayĐổiThôngTinToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem bảngChấmCôngToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem xuấtBảngBiểuChấmCônToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem báoCáoChấmCôngToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem chấmCôngVàoToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem chấmCôngRaToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem quảnLýChấmCôngToolStripMenuItem;
        private System.Windows.Forms.ToolStripTextBox tsTextBoxTimKiem;
        private System.Windows.Forms.TableLayoutPanel pnlHeader;
        private System.Windows.Forms.PictureBox picAvatar;
        private System.Windows.Forms.PictureBox picLogo;
    }
}