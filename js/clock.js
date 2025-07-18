setInterval(showTime, 1000);
function showTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false,  // เปลี่ยนเป็น false เพื่อใช้ระบบ 24 ชั่วโมง
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('clock').textContent = timeString;

}
showTime();
 
    