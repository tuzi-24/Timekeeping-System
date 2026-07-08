// dangnhap.js

document.addEventListener("DOMContentLoaded", () => {
    const btnLogin = document.getElementById("btnLogin");
    if (btnLogin) btnLogin.addEventListener("click", loginXuly);
});

function togglePassword(inputId, btnElement) {
    const passwordInput = document.getElementById(inputId);
    const icon = btnElement.querySelector('i'); 
    if (!passwordInput || !icon) return;
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.className = "fa-regular fa-eye-slash"; 
    } else {
        passwordInput.type = "password";
        icon.className = "fa-regular fa-eye"; 
    }
}

function showNotification(resultType, messageText) {
    const msgBox = document.getElementById('msgBox');
    if (!msgBox) return;
    if (resultType === "SUCCESS") { msgBox.className = "alert-message success"; msgBox.innerHTML = messageText; }
    else if (resultType === "ERROR") { msgBox.className = "alert-message error"; msgBox.innerHTML = messageText; }
    else if (resultType === "WARNING") { msgBox.className = "alert-message warning"; msgBox.innerHTML = messageText; }
    else { msgBox.className = ""; msgBox.innerHTML = ""; }
}

async function loginXuly() {
    const maNV = document.getElementById('txtMaNV').value.trim();
    const matKhau = document.getElementById('txtMatKhau').value;
    const rememberMe = document.getElementById('chkRemember')?.checked ?? false;

    if (maNV === "" || matKhau === "") {
        showNotification("WARNING", "⚠️ Vui lòng nhập đầy đủ Mã nhân viên và Mật khẩu!");
        return;
    }

    showNotification("", "");

    try {
        // Gọi hàm whitelist phương thức "XuLyDangNhap" thông qua file cầu nối script.js
        const response = await callCSharp("XuLyDangNhap", { 
            maNV: parseInt(maNV), 
            matKhau: matKhau,
            rememberMe: rememberMe
        });

        if (response && (response.MaNV || response.maNV)) {
            const hoTen = response.HoTen || response.hoTen || "Thành viên";
            showNotification("SUCCESS", `✔️ Đăng nhập thành công! Xin chào ${hoTen}.`);
            setTimeout(() => { 
                window.location.href = "https://app.assets/trangchu.html"; 
            }, 1200);
        } else {
            showNotification("ERROR", "❌ Sai Mã nhân viên hoặc Mật khẩu!");
        }
    } catch (error) {
        console.error(error);
        showNotification("ERROR", "💥 Không thể kết nối với dịch vụ backend.");
    }
}