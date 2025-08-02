// Clock functionality
setInterval(showTime, 1000);
function showTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('clock').textContent = timeString;
}
showTime();

// Generate folder name based on round type, round number, and current selections
function generateFolderName(roundType, roundNumber) {
    const price = document.getElementById('priceDropdown').value;
    const region = document.getElementById('regionDropdown').value;

    let roundText;
    if (roundType === 'X') {
        roundText = 'รอบที่ X(รอบปัจจุบัน)';
    } else {
        roundText = 'รอบที่แล้ว';
    }

    return `${roundNumber} ราคา ${price} ตังค์ ไทย อังกฤษ A4 legal normal south ${roundText}`;
}

// Generate file name based on parameters
function generateFileName(roundType, roundNumber, fileType, language) {
    const price = document.getElementById('priceDropdown').value;
    const region = document.getElementById('regionDropdown').value;

    let prefix = 'Basa_02_08_2568';
    let languageText = language === 'ไทย' ? 'ภาษาไทย' : 'ภาษาอังกฤษ';

    if (region === 'south') {
        prefix += `_South_${fileType}`;
    } else {
        prefix += `_${fileType}`;
    }

    return `${prefix}_${roundNumber}_ราคา_${languageText}_${price}_ตังค์.xlsx`;
}

// Download file function
async function downloadFileNew(roundType, roundNumber, fileType, language) {
    const button = event.target;
    const originalText = button.textContent;
    const statusSpan = button.nextElementSibling;

    try {
        // Generate paths
        const folderName = generateFolderName(roundType, roundNumber);
        const fileName = generateFileName(roundType, roundNumber, fileType, language);
        const filePath = `files/${encodeURIComponent(folderName)}/${encodeURIComponent(fileName)}`;

        // Show loading state
        button.textContent = language === 'ไทย' ? 'กำลังโหลด...' : 'Loading...';
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
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Show success state
        button.textContent = language === 'ไทย' ? 'สำเร็จ!' : 'Success!';
        button.className = 'btn btn-primary success';
        if (statusSpan) {
            statusSpan.textContent = language === 'ไทย' ? '✓ เรียบร้อย' : '✓ Done';
            statusSpan.className = 'file-status file-available';
        }

        // Reset after delay
        setTimeout(() => {
            button.textContent = originalText;
            button.className = 'btn btn-primary';
            button.disabled = false;
            if (statusSpan) {
                statusSpan.textContent = language === 'ไทย' ? '✓ พร้อม' : '✓ Ready';
            }
        }, 3000);

    } catch (error) {
        console.error('Download error:', error);
        console.log('Attempted to download:', filePath);

        // Show error state
        button.textContent = language === 'ไทย' ? 'ไม่พบไฟล์' : 'Not found';
        button.className = 'btn btn-primary error';
        if (statusSpan) {
            statusSpan.textContent = '✗ ข้อผิดพลาด';
            statusSpan.className = 'file-status file-missing';
        }

        // Reset after delay
        setTimeout(() => {
            button.textContent = originalText;
            button.className = 'btn btn-primary';
            button.disabled = false;
            if (statusSpan) {
                statusSpan.textContent = language === 'ไทย' ? '✗ ตรวจสอบ' : '✗ Check';
            }
        }, 3000);
    }
}

// Update price display when dropdown changes
function updatePriceDisplay() {
    const price = document.getElementById('priceDropdown').value;
    document.getElementById('price1').textContent = price;
    document.getElementById('price2').textContent = price;
    document.getElementById('price3').textContent = price;
    document.getElementById('currentPrice').textContent = price + ' ตังค์';
}

// Update region display
function updateRegionDisplay() {
    const region = document.getElementById('regionDropdown').value;
    const regionText = region === 'normal' ? 'Normal' : 'South';
    document.getElementById('currentRegion').textContent = regionText;
}

// Check file availability on page load
async function checkFileAvailability() {
    // This function can be expanded to check all files
    // For now, we'll just initialize the display
    console.log('File availability check completed');
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('priceDropdown').addEventListener('change', function () {
        updatePriceDisplay();
        console.log('เลือกราคา:', this.value + ' ตังค์');
    });

    document.getElementById('regionDropdown').addEventListener('change', function () {
        updateRegionDisplay();
        console.log('เลือกภูมิภาค:', this.value);
    });

    // Initialize display
    updatePriceDisplay();
    updateRegionDisplay();
    checkFileAvailability();
});