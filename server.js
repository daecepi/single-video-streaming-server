const express = require('express');
const fs = require('fs');
const app = express();
  
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/UI/index.html');
})
  
app.get('/videoplayer', (req, res) => {
    const range = req.headers.range // contains the range value that we get from the header
    
    const videoPath = './public/videos/sample-video.mp4'; // Calculated link that points to the CDN --- IMPORTANT!
    const videoSize = fs.statSync(videoPath).size // fs module statSync to get the size
    const chunkSize = 1 * 1e6; // chunk size for streaming
    const start = Number(range.replace(/\D/g, ""))
    const end = Math.min(start + chunkSize, videoSize - 1)
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    }
    res.writeHead(206, headers)
    const stream = fs.createReadStream(videoPath, {
        start,
        end
    })
    stream.pipe(res)
})
app.listen(3000);