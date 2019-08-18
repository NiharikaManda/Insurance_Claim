var express = require('express');
var app = express();
var multer = require('multer')
var cors = require('cors');
var tesseract = require('tesseract.js');
var bodyParser =  require("body-parser");
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/dbproducts');
require("./models/Products");
var Product  = mongoose.model('Products');

var config = {
    lang: 'eng',
    oem: 1,
    psm: 4
}

app.use(cors())

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' +file.originalname )
    }
})
  
var upload = multer({ storage: storage });
  
app.get('/',function(req,res){
    return res.send('Hello Server');
})

app.post('/upload', upload.single('file'), (req, res) => {
    tesseract.recognize('./public/uploads/' + req.file.filename)
    .catch(err => console.error(err))
    .then(function (result) {
        var text = result.text.trim();
        var dataList = text.split(/\r?\n/);
        dataList = dataList.filter(Boolean); //Remove blank elements in the array
        var dataToStore = [];
        var vendorName = "";
        var billDate = ""
        for(var i=0; i<dataList.length; i++)
        {
            if( i==0 && dataList[i] !== ""){
                vendorName = dataList[i].trim();
            }
            else if( i==1 && dataList[i] !== ""){
                var date = dataList[i].split(":");
                billDate = date[1].trim();
            }
            else if(i> 2 && i < dataList.length-1){
                var itemDetails = dataList[i].split(" ");
                var item = new Product({
                    store: vendorName,
                    item: itemDetails[0],
                    qty: itemDetails[1],
                    price: itemDetails[2],
                    total: itemDetails[3],
                    date: billDate
                });
                dataToStore.push(item);
            }
        }

        Product.insertMany(dataToStore, function(error) {
            if(error){
                throw error;
           }
           res.json({success : "Uploaded Successfully", status : 200, data: {}});
        });
    })
});

app.post('/reports', function(req, res) {
    var startDate = new Date(req.body.startDate);
    var endDate = new Date(req.body.endDate);
    
    Product.aggregate([
        { $match: { 
            "date": { 
                $lt: startDate,
                $gte: endDate 
            }
        }},
        { $group: {
            _id: "$item",
            "qty": {
                $sum: "$qty"
            },
            "totalPrice": {
                $sum: "$total"
            }
        }}
    ], function(err, docs) {
        if (!err){ 
            res.json({success : "Updated Successfully", status : 200, data: docs});
        } else { 
            throw err;
        }
    })
});

app.listen(8000, function() {
    console.log('App running on port 8000');
});