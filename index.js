var express = require("express")
var app = express()

var multer = require("multer")
var upload = multer()
var AWS = require("aws-sdk")
AWS.config.update({
    region: "ap-southeast-1",
    accessKeyId:process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
})

var docClient = new AWS.DynamoDB.DocumentClient()
var tableName = 'SinhVien'
app.use(express.static('./component'))
app.set('view engine', 'ejs')
app.set('views', './component')
app.use(express.json())
app.get("/hello", function (req, res) {
    res.json("Hello anh em nhá")
})
app.get("/home", function (req, res) {
    const params = {
        TableName: tableName
    }
    docClient.scan(params, function (err, data) {
        console.log(data);
        return res.render("home", { sinhViens: data.Items })
    })
})
//Tìm sinh viên theo id
app.get("/sinhVien/:id",function (req,res) {
    res.status(200).json("Có cái nịt mà nhìn bài nhá")
})
//Cập nhật sinh viên nhá các cháu 
app.get("/edit/:id",function (req,res) {
    res.status(200).json("Nhìn bài này thì đúng còn cái nịt")
})
//Thêm sinh viên vào trong database nhá
app.post("/saveSinhVien", upload.fields([]), function (req, res) {
    const ma_sinhvie = req.body.ma_sinhvie
    const ten_sinhvien = req.body.ten_sinhvien
    const dia_chi = req.body.dia_chi
    const dta = req.body
    console.log(dta);
    const params = {
        TableName: tableName,
        Item: {
            ma_sinhvie,
            ten_sinhvien,
            dia_chi
        }
    }
    docClient.put(params, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            alert("Thêm thành công nhá bạn")
            return res.redirect("/addSinhVien")
        }
    })
})
//Xóa sinh viên tìm theo id nhá
app.post("/deleteSinhVien", upload.fields([]), function (req, res) {
    const listItems = Object.keys(req.body);
    if (listItems === 0) {
        return res.redirect("/home")
    }
    function onDelete(index) {
        const params = {
            TableName: tableName,
            Key: {
                "ma_sinhvie": listItems[index]
            }
        }
        docClient.delete(params, function (err, data) {
            if (err) {
                res.status(500).json("Lỗi xóa nhá bạn ơi")
            } else {
                if (index > 0) {
                    onDelete
                } else {
                    return res.redirect("/home")
                }
            }
        })
    }
    onDelete(listItems.length - 1)
})
app.get("/addSinhVien", function (req, res) {
    return res.render('addSinhVien')
})
var service = app.listen(3000, function (host, port) {
    var host = service.address().address
    var port = service.address().port
    console.log("Chạy thành công nhá anh dương ơi", host, port);
})
