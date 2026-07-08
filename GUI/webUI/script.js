// Lưu các Promise đang chờ kết quả, key = tên method
const _pendingCalls = {};

// Thời gian tối đa chờ C# trả lời (10 giây)
const TIMEOUT_MS = 10000;


/**
 * Gửi yêu cầu lên C# và trả về Promise.
 * Cách dùng:
 *   const result = await callCSharp("KiemTraDangNhap", { maNV: 1000, pass: "abc" });
 *
 * @param {string} bllMethodName - Tên hàm BLL cần gọi (phải có trong whitelist C#)
 * @param {object} dataObj       - Tham số truyền kèm (object JS thường)
 * @returns {Promise<any>}       - Kết quả C# trả về, hoặc lỗi nếu timeout
 */
function callCSharp(bllMethodName, dataObj = {}) {
    return new Promise((resolve, reject) => {

        // Đăng ký callback hứng kết quả cho lần gọi này
        _pendingCalls[bllMethodName] = { resolve, reject };

        // Cài đặt bộ đếm thời gian - nếu C# không trả lời sau TIMEOUT_MS thì reject
        const timer = setTimeout(() => {
            if (_pendingCalls[bllMethodName]) {
                delete _pendingCalls[bllMethodName];
                reject(new Error(`[Timeout] Không nhận được phản hồi từ C# cho hàm: "${bllMethodName}"`));
            }
        }, TIMEOUT_MS);

        // Lưu timer vào pending để có thể huỷ khi nhận được kết quả đúng hạn
        _pendingCalls[bllMethodName].timer = timer;

        // Đóng gói và bắn gói tin sang C#
        const packet = { method: bllMethodName, data: dataObj };

        if (window.chrome?.webview) {
            window.chrome.webview.postMessage(JSON.stringify(packet));
        } else {
            // Chế độ chạy Live Preview trong trình duyệt thường (không có C#)
            console.log("[Live Preview] Gói gửi đi C#:", packet);
            // Tự resolve ngay để không bị treo khi test giao diện
            clearTimeout(timer);
            delete _pendingCalls[bllMethodName];
            resolve(null);
        }
    });
}


/**
 * C# gọi hàm này để đẩy kết quả xuống JS.
 * Hàm này được C# gọi qua ExecuteScriptAsync, KHÔNG gọi trực tiếp trong JS.
 *
 * @param {string} callbackName - Tên callback = tên hàm BLL + "_Result" (ví dụ: "KiemTraDangNhap_Result")
 * @param {any}    dataResult   - Dữ liệu JSON đã được deserialize, do C# truyền xuống
 */
function receiveFromCSharp(callbackName, dataResult) {
    console.log("[C# → JS]", callbackName, dataResult);

    // Ưu tiên 1: Resolve Promise đang chờ (nếu gọi qua callCSharp)
    // Tên method gốc = bỏ đuôi "_Result"
    const methodName = callbackName.replace(/_Result$/, "");
    if (_pendingCalls[methodName]) {
        clearTimeout(_pendingCalls[methodName].timer);   // Huỷ bộ đếm timeout
        _pendingCalls[methodName].resolve(dataResult);   // Trả kết quả về cho await
        delete _pendingCalls[methodName];
        return;
    }

    // Ưu tiên 2: Fallback - tìm hàm global tên trùng callbackName (cách cũ vẫn hoạt động)
    const fallbackFn = window[callbackName];
    if (typeof fallbackFn === "function") {
        fallbackFn(dataResult);
    } else {
        console.warn("[Bridge] Không tìm thấy handler nào cho:", callbackName);
    }
}

// Hàm gửi sự kiện lên C# điều khiển đóng/mở cửa sổ ứng dụng
function closeApp() {
    window.chrome.webview.postMessage({
        method: "DieuKhienCuaSo",
        data: { action: "close" }
    });
}

function minimizeApp() {
    window.chrome.webview.postMessage({
        method: "DieuKhienCuaSo",
        data: { action: "minimize" }
    });
}
