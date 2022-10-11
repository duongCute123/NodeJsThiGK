var express=require("express")
var app=express()

var multer=require("multer")
var upload=multer()
var AWS=require("aws-sdk")
AWS.config.update({
    region:"ap-southeast-1",
    accessKeyId:"AKIASREHWAQR7HFMDYBW",
    secretAccessKey:"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"
    
})

var docClient=new AWS.DynamoDB.DocumentClient()
var tableName='SinhVien'
app.use(express.static('./component'))
app.set('view engine', 'ejs')
app.set('views','./component')
app.use(express.json())
app.get("/hello",function (req,res) {
    res.json("Hello anh em nhá")
})
app.get("/home",function (req,res) {
    const params={
        TableName:tableName
    }
    docClient.scan(params,function (err,data) {
        console.log(data);
        return res.render("home",{sinhViens:data.Items})
    })
})
app.post("/saveSinhVien",upload.fields([]),function (req,res) {
    const ma_sinhvie=String(req.body.ma_sinhvie)
    const ten_sinhvien=String(req.body.ten_sinhvien)
    const dia_chi=String(req.body.dia_chi)
    const params={
        TableName:tableName,
        Item:{
            "ma_sinhvie":ma_sinhvie,
            "ten_sinhvien":ten_sinhvien,
            "dia_chi":dia_chi
        }
    }
    docClient.put(params,function (err,data) {
        if (err) {
            console.log(err);
        }else{
            return res.redirect("/addSinhVien")
        }
    })
})
app.post("/deleteSinhVien",upload.fields([]),function (req,res) {
    const listItems=Object.keys(req.body);
    if (listItems===0) {
        return res.redirect("/home")
    }
    function onDelete(index) {
        const params={
            TableName:tableName,
            Key:{
                "ma_sinhvie":listItems[index]
            }
        }
        docClient.delete(params,function (err,data) {
            if (err) {
                res.status(500).json("Lỗi xóa nhá bạn ơi")
            }else{
                if (index>0) {
                    onDelete
                }else{
                    return res.redirect("/home")
                }
            }
        })
    }
    onDelete(listItems.length-1)
})
app.get("/addSinhVien",function (req,res) {
    return res.render('addSinhVien')
})
var service=app.listen(3000,function (host,port) {
    var host=service.address().address
    var port=service.address().port
    console.log("Chạy thành công nhá anh dương ơi",host,port);
})