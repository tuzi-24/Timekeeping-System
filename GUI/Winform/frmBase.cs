using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Windows.Forms;

namespace GUI
{
    public partial class frmBase : Form
    {
        public static FormWindowState CurrentSharedState = FormWindowState.Normal;
        public static Size CurrentSharedSize;
        public static Point CurrentSharedLocation;
        public static Image SharedAvatar = null;
        public static Image SharedLogo = null;

        public bool IsDialogForm { get; set; } = false;
        public bool IsMainForm { get; set; } = false;

        public frmBase()
        {
            InitializeComponent();
            this.MinimumSize = new Size(800, 500);
        }

        // txtMaNV CHỈ NHẬN SỐ NGUYÊN
        protected void ChiNhanSo(TextBox txt)
        {
            txt.KeyPress += (sender, e) =>
            {
                if (!char.IsDigit(e.KeyChar) && e.KeyChar != (char)Keys.Back)
                    e.Handled = true;
            };
        }

        // ═══════════════════════════════════════════════════════════
        // UI UPDATE
        // ═══════════════════════════════════════════════════════════

        public void UpdateAvatarUI()
        {
            Control[] controls = this.Controls.Find("picAvatar", true);
            if (controls.Length > 0 && controls[0] is PictureBox pic && SharedAvatar != null)
            {
                pic.Image = SharedAvatar;
                pic.SizeMode = PictureBoxSizeMode.Zoom;
            }
        }

        public void UpdateLogoUI()
        {
            Control[] controls = this.Controls.Find("picLogo", true);
            if (controls.Length > 0 && controls[0] is PictureBox pic && SharedLogo != null)
            {
                pic.Image = SharedLogo;
                pic.SizeMode = PictureBoxSizeMode.Zoom;
            }
        }

        private Image LoadImage(string path)
        {
            if (!string.IsNullOrEmpty(path) && File.Exists(path))
            {
                try
                {
                    byte[] imgBytes = File.ReadAllBytes(path);
                    using (var ms = new MemoryStream(imgBytes))
                        return Image.FromStream(ms);
                }
                catch { return null; }
            }
            return null;
        }

        // ═══════════════════════════════════════════════════════════
        // HEADER EVENTS (Logo + Avatar)
        // ═══════════════════════════════════════════════════════════

        private void picLogo_Click(object sender, EventArgs e)
        {
            NavigateToMain();
        }

        private void picAvatar_Click(object sender, EventArgs e)
        {
            if (this.Name != "frmAccount")
                NavigateTo(new frmAccount());
        }

        // Bind sự kiện cho picLogo và picAvatar — gọi trong OnLoad của mọi form con
        private void BindHeaderEvents()
        {
            // picLogo — chỉ bind NavigateToMain cho form con (không phải frmMain)
            Control logo = this.Controls.Find("picLogo", true).FirstOrDefault();
            if (logo != null)
            {
                logo.Cursor = Cursors.Hand;
                // -= trước để tránh double-bind nếu designer đã bind sẵn
                logo.Click -= picLogo_Click;
                if (!IsMainForm)
                    logo.Click += picLogo_Click;
            }

            // picAvatar — bind cho tất cả form (kể cả frmMain)
            Control avatar = this.Controls.Find("picAvatar", true).FirstOrDefault();
            if (avatar != null)
            {
                avatar.Cursor = Cursors.Hand;
                avatar.Click -= picAvatar_Click;
                avatar.Click += picAvatar_Click;
            }
        }

        // ═══════════════════════════════════════════════════════════
        // NAVIGATION
        // ═══════════════════════════════════════════════════════════

        public void NavigateToMain()
        {
            if (IsMainForm) return;
            this.DialogResult = DialogResult.OK;
            this.Close();
        }

        public void NavigateTo(Form targetForm)
        {
            CurrentSharedState = this.WindowState;
            if (this.WindowState == FormWindowState.Normal)
            {
                CurrentSharedSize = this.Size;
                CurrentSharedLocation = this.Location;
            }
            else
            {
                CurrentSharedSize = this.RestoreBounds.Size;
                CurrentSharedLocation = this.RestoreBounds.Location;
            }

            targetForm.StartPosition = FormStartPosition.Manual;
            targetForm.WindowState = CurrentSharedState;
            if (CurrentSharedState == FormWindowState.Normal)
            {
                targetForm.Size = CurrentSharedSize;
                targetForm.Location = CurrentSharedLocation;
            }

            this.Hide();
            DialogResult result = targetForm.ShowDialog();

            if (result == DialogResult.Abort)
            {
                this.DialogResult = DialogResult.Abort;
                this.Close();
                return;
            }

            if (!this.IsDisposed)
            {
                this.WindowState = CurrentSharedState;
                if (CurrentSharedState == FormWindowState.Normal)
                {
                    this.Size = CurrentSharedSize;
                    this.Location = CurrentSharedLocation;
                }
                this.UpdateAvatarUI();
                this.Show();
            }
            else if (result == DialogResult.Abort)
            {
                this.DialogResult = DialogResult.Abort;
                this.Close();
            }
        }

        public void GoBack()
        {
            this.DialogResult = DialogResult.Retry;
            this.Close();
        }

        // ═══════════════════════════════════════════════════════════
        // FORM EVENTS
        // ═══════════════════════════════════════════════════════════

        protected override void OnLoad(EventArgs e)
        {
            if (this.Name == "frmLogin")
            {
                this.StartPosition = FormStartPosition.CenterScreen;
                this.WindowState = FormWindowState.Normal;
                base.OnLoad(e);
            }
            else
            {
                this.StartPosition = FormStartPosition.Manual;
                this.WindowState = CurrentSharedState;
                this.Size = (CurrentSharedSize.Width > 100) ? CurrentSharedSize : Properties.Settings.Default.LastFormSize;
                this.Location = (!CurrentSharedLocation.IsEmpty) ? CurrentSharedLocation : Properties.Settings.Default.LastLocation;

                base.OnLoad(e);

                if (SharedAvatar == null)
                    SharedAvatar = LoadImage(Properties.Settings.Default.AvatarPath);

                if (SharedLogo == null)
                    SharedLogo = Properties.Resources.picLogo;

                UpdateAvatarUI();
                UpdateLogoUI();

                // Bind sự kiện header cho tất cả form (trừ frmLogin)
                BindHeaderEvents();
            }
        }

        protected override void OnSizeChanged(EventArgs e)
        {
            base.OnSizeChanged(e);
            if (this.WindowState == FormWindowState.Normal)
            {
                CurrentSharedSize = this.Size;
                CurrentSharedState = FormWindowState.Normal;
            }
            else if (this.WindowState == FormWindowState.Maximized)
                CurrentSharedState = FormWindowState.Maximized;
        }

        protected override void OnLocationChanged(EventArgs e)
        {
            base.OnLocationChanged(e);
            if (this.WindowState == FormWindowState.Normal)
                CurrentSharedLocation = this.Location;
        }

        protected override void OnFormClosing(FormClosingEventArgs e)
        {
            if (this.Name != "frmLogin" && this.WindowState != FormWindowState.Minimized)
            {
                if (this.WindowState == FormWindowState.Maximized)
                {
                    Properties.Settings.Default.IsMaximized = true;
                    Properties.Settings.Default.LastFormSize = this.RestoreBounds.Size;
                    Properties.Settings.Default.LastLocation = this.RestoreBounds.Location;
                }
                else
                {
                    Properties.Settings.Default.IsMaximized = false;
                    Properties.Settings.Default.LastFormSize = this.Size;
                    Properties.Settings.Default.LastLocation = this.Location;
                }
                Properties.Settings.Default.Save();
            }

            if (e.CloseReason == CloseReason.UserClosing && !IsDialogForm)
            {
                if (this.DialogResult != DialogResult.OK && this.DialogResult != DialogResult.Retry)
                    Application.Exit();
            }

            base.OnFormClosing(e);
        }
    }
}