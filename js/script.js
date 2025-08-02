// Clock functionality
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
showTime(); // Initial call

// Download file function for GitHub Pages
async function downloadFile(filePath, downloadName) {
    const button = event.target;
    const originalText = button.textContent;
    const statusSpan = button.nextElementSibling;

    try {
        // Show loading state
        button.textContent = button.textContent.includes('ดาวน์โหลด') ? 'กำลังดาวน์โหลด...' : 'Downloading...';
        button.className = 'btn btn-primary downloading';
        button.disabled = true;

        // Fetch the file
        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get file as blob
        const blob = await response.blob();

        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = downloadName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Show success state
        button.textContent = button.textContent.includes('กำลัง') ? 'ดาวน์โหลดสำเร็จ!' : 'Downloaded!';
        button.className = 'btn btn-primary success';
        if (statusSpan) {
            statusSpan.textContent = button.textContent.includes('ดาวน์โหลด') ? '✓ ดาวน์โหลดเรียบร้อย' : '✓ Download completed';
            statusSpan.className = 'file-status file-available';
        }

        // Reset after delay
        setTimeout(() => {
            button.textContent = originalText;
            button.className = 'btn btn-primary';
            button.disabled = false;
            if (statusSpan) {
                statusSpan.textContent = button.textContent.includes('ดาวน์โหลด') ? '✓ พร้อมใช้งาน' : '✓ Available';
            }
        }, 3000);

    } catch (error) {
        console.error('Download error:', error);

        // Show error state
        button.textContent = button.textContent.includes('กำลัง') || button.textContent.includes('ดาวน์โหลด') ? 'ไฟล์ไม่พบ' : 'File not found';
        button.className = 'btn btn-primary error';
        if (statusSpan) {
            statusSpan.textContent = '✗ ไฟล์ไม่พบ';
            statusSpan.className = 'file-status file-missing';
        }

        // Reset after delay
        setTimeout(() => {
            button.textContent = originalText;
            button.className = 'btn btn-primary';
            button.disabled = false;
            if (statusSpan) {
                statusSpan.textContent = '✗ ตรวจสอบไฟล์';
            }
        }, 3000);
    }
}

// Check file availability on page load
async function checkFileAvailability() {
    const buttons = document.querySelectorAll('[onclick^="downloadFile"]');

    for (let button of buttons) {
        const onclickAttr = button.getAttribute('onclick');
        const match = onclickAttr.match(/downloadFile\('([^']+)'/);

        if (match) {
            const filePath = match[1];
            const statusSpan = button.nextElementSibling;

            try {
                const response = await fetch(filePath, { method: 'HEAD' });
                if (response.ok) {
                    statusSpan.textContent = button.textContent.includes('ดาวน์โหลด') ? '✓ พร้อมใช้งาน' : '✓ Available';
                    statusSpan.className = 'file-status file-available';
                } else {
                    statusSpan.textContent = '✗ ไฟล์ไม่พบ';
                    statusSpan.className = 'file-status file-missing';
                }
            } catch (error) {
                statusSpan.textContent = '✗ ตรวจสอบไฟล์';
                statusSpan.className = 'file-status file-missing';
            }
        }
    }
}

// Dropdown event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Check file availability when page loads
    checkFileAvailability();

    document.getElementById('priceDropdown').addEventListener('change', function () {
        console.log('เลือก:', this.value + ' ตังค์');
    });

    document.getElementById('priceDropdownone').addEventListener('change', function () {
        console.log('เลือก:', this.value);
    });
});