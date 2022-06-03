const http = require('http')
const fs = require('fs')
const formidable = require('formidable');

function getTemplate(filePath, res, mimeType) {
    fs.readFile(filePath, 'utf8',((err, data) => {
        if (err){
            throw new Error(err.message)
        }
        res.writeHead(200, {'Content-type': mimeType})
        res.write(data);
        res.end()
    }))
}

const server = http.createServer(((req, res) => {

    const urlPath = req.url;
    console.log(urlPath)

    switch (urlPath) {
        case '/list.html':
            getTemplate('./views/list.html',res,'text/plain')
            break;
        case '/css/style.css':
            getTemplate('css/style.css',res, 'text/css' )
        case '/images/image1.png':
            fs.readFile('images/image1.png', function (err, content) {
                if (err) {
                    res.writeHead(400, {'Content-type':'text/html'})
                    res.end("No such image");
                } else {
                    res.writeHead(200,{'Content-type':'image/png'});
                    res.end(content);
                }
            });
            break;
        case '/add.html':
            if (req.method === 'POST') {
                //  Xu ly form upload bằngt thư viện
                const form = formidable({ multiples: true });

                form.parse(req, function (err, fields, files) {
                    // filepath đường dẫn của file upload trong bộ nhớ tạm của máy tính
                    const oldpath = files.avatar.filepath;

                    const newPath = 'images/' + files.avatar.originalFilename

                    // Đổi tên file, nếu không có file thì thêm mới
                    fs.rename(oldpath, newPath, (err) =>{
                        if (err) throw err;
                        res.write('File uploaded and moved!');
                        res.end();
                    })
                });
                return;
            }
            break
        default:
            getTemplate('views/add.html', res, 'text/html')
            break
    }
}))


server.listen(8080);
