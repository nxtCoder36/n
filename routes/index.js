import { Console, error } from 'console';
import express, { response } from 'express';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';

const router = express.Router();

// reading data from a file on server
// fs.readFile(`${process.cwd()}/text_file.txt`, 'UTF-8', (err, data) => {
//     if(err){
//         console.log(err)
//         return
//     }
//     console.log(data)
// })

router.get('/hello', (req, res) => {
    res.send("Hello");
});

router.get(`/filename/:fileName`, (req,res) => {
    const fileName = req.params.fileName;
    fs.readFile(`${process.cwd()}/${fileName}`, 'UTF-8', (err,data) => {
        if (err) {
            res.send(err);
        }
        res.send(data);
    })
});

router.get('/stream/:filename', (req,res) => {
    const fileName = req.params.filename; 
    const filePath = `${process.cwd()}/${fileName}`;
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    // console.log('aaaaaaaaaaaa', filePath, stat)
    // const range = req.headers.range;
    const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4"
    }
    res.writeHead(200, head);

    fs.createReadStream(filePath, {highWaterMark: 64*1024}).pipe(res);
});

// using fs promises 
router.get("/stream2/:filename", async (req, res) => {
    const f = req.params.filename;
    const fd = await fsp.open("./" + f);
    const buf = Buffer.alloc(0xffff);
    while (true) {
        try {
            await fd.read(buf, 0xffff);
            res.write(buf);
        } catch (err) {
            console.log(err);
            res.end()
        }
    }
});

router.get('/download/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = `${process.cwd()}/${fileName}`;
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    // // console.log('aaaaaaaaaaaa', filePath, stat)
    // // Content-Type header sets the MIME type of the response to application/octet-stream which is a generic binary data type.
    // res.setHeader("Content-Type", "video/mp4")
    // // Content-Length header to the size of the file
    // res.setHeader("Content-Length", fileSize)
    // // Content-Disposition header tells the browser to treat the response as a file download
    // res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`)
    console.log(filePath)
    const fileStream = fs.createWriteStream({path: filePath});
    res.pipe(fileStream);

    fileStream.on("finish", () => {
        fileStream.close();
    })
    // const fileStream = fs.createWriteStream(filePath, {highWaterMark: 2*1024*1024, wri});
    // res.pipe(fileStream);
    // res.pipe(write);
    // write.on("finish", () => {
    //     write.close();
    // })
})

export default router;