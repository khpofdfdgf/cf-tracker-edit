const express = require('express');

const os = require('os');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const multer = require('multer')
const http = require('http');
const { exec } = require('child_process');

const app = express();
const server = http.createServer(app);

const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/cf-tracker.html');
});
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/public/Login.html');

    
});


  

  const upload = multer({ dest: 'uploads/' });

app.post('/save', (req, res) => {
    const { filename, content, folder } = req.body;

    if (!filename || !content) {
        return res.status(400).json({ message: 'Tên tệp và nội dung là bắt buộc' });
    }

    const filePath = path.join(__dirname, 'public', folder || '', filename);

    fs.writeFile(filePath, content, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Lưu tệp thất bại' });
        }
        res.status(200).json({ message: 'Lưu tệp thành công' });
    });
});

app.get('/files', (req, res) => {
    const folder = req.query.folder || '';
    const directoryPath = path.join(__dirname, 'public', folder);

    fs.readdir(directoryPath, { withFileTypes: true }, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Không thể quét thư mục' });
        }
        const fileList = files.map(file => ({
            name: file.name,
            isDirectory: file.isDirectory()
        }));
        res.status(200).json(fileList);
    });
});

app.get('/file', (req, res) => {
    const { filename, folder } = req.query;

    if (!filename) {
        return res.status(400).json({ message: 'Tên tệp là bắt buộc' });
    }

    const filePath = path.join(__dirname, 'public', folder || '', filename);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Không thể đọc tệp' });
        }
        res.status(200).json({ content: data });
    });
});

app.post('/upload', upload.single('file'), (req, res) => {
    const folder = req.body.folder || '';
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, 'public', folder, req.file.originalname);

    fs.rename(tempPath, targetPath, (err) => {
        if (err) return res.status(500).json({ message: 'Tải lên tệp thất bại' });
        res.status(200).json({ message: 'Tải lên tệp thành công' });
    });
});

app.get('/download', (req, res) => {
    const { filename, folder } = req.query;

    if (!filename) {
        return res.status(400).json({ message: 'Tên tệp là bắt buộc' });
    }

    const filePath = path.join(__dirname, 'public', folder || '', filename);

    res.download(filePath, err => {
        if (err) {
            res.status(500).json({ message: 'Tải xuống tệp thất bại' });
        }
    });
});

app.get('/get-backend-code', (req, res) => {
    const backendFilePath = path.join(__dirname, 'index.js');

    fs.readFile(backendFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Không thể đọc mã backend' });
        }
        res.status(200).json({ content: data });
    });
});

app.post('/update-backend', (req, res) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ message: 'Nội dung là bắt buộc' });
    }

    const filePath = path.join(__dirname, 'index.js');

    fs.writeFile(filePath, content, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Cập nhật backend thất bại' });
        }
        res.status(200).json({ message: 'Cập nhật backend thành công. Vui lòng khởi động lại máy chủ.' });
    });
});

app.post('/restart-server', (req, res) => {
    res.status(200).json({ message: 'Khởi động lại máy chủ...' });
    exec('pm2 restart server', (err, stdout, stderr) => {
        if (err) {
            console.error(`Lỗi khi khởi động lại máy chủ: ${err}`);
            return;
        }
        console.log(`Kết quả: ${stdout}`);
        console.error(`Lỗi: ${stderr}`);
    });
});





// Lấy địa chỉ IP của máy
const getIPAddress = () => {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
        const interfaces = networkInterfaces[interfaceName];
        for (const interface of interfaces) {
            if (interface.family === 'IPv4' && !interface.internal) {
                return interface.address;
            }
        }
    }
    return null;
};



// Lắng nghe trên cổng và địa chỉ IP của máy
const ipAddress = getIPAddress();
if (!ipAddress) {
    console.error('Unable to determine IP address. Server cannot be started.');
} else {
    app.listen(PORT, ipAddress, () => {
        console.log(`Server is running on http://${ipAddress}:${PORT}`);
    });
}