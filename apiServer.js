var express = require('express');
var logger=require('morgan');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);



var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

var mongoose=require('mongoose');

//mongo client
mongoose.connect('mongodb://test:test@ds113935.mlab.com:13935/book_shop')
//local db
//mongoose.connect('mongodb://localhost/bookshop')

var db=mongoose.connection;
db.on('error',console.error.bind(console,'# MongoDB - connection error:'))

app.use(session({
    secret:'mySecretString',
    saveUninitialized:false,
    resave:false,
    cookie:{maxAge:1000*60*60*24*2},
    store: new MongoStore({mongooseConnection:db,ttl:2*24*60*60})
}))

app.post('/cart',function (req,res) {
    var cart=req.body;
    req.session.cart=cart;
    req.session.save(function (err) {
        if(err){
            console.log(err);
        }
        res.json(req.session.cart);
    })
})

app.get('/cart',function (req,res) {
    if(typeof req.session.cart !== 'undefined'){
        res.json(req.session.cart);
    }
})

     // .then(() =>  console.log('connection succesful'))
     // .catch((err) => console.error(err));

var Books=require('./models/books.js');

app.post('/bookstore',function (req,res) {
    console.log('--->call<------');
    debugger
    var book=req.body;
    console.log(book)
    const newBook  = new Books(book);
    debugger
    console.log(newBook);
    newBook.save()
        .then( () => {
            console.log('successs');
            res.json({book:book});
        })
        .catch( err => {
            console.log('errr');
            res.json({ error: err })
        });
})

app.get('/book',function (req,res) {
    Books.find(function(err, bears) {
        if (err)
            res.send(err);

        res.json(bears);
    });
})

app.delete('/bookstore/:_id',function (req,res) {
    var _id = req.params._id;
    console.log(_id);
    Books.remove({ _id },function (err,books) {
        if(err){
            console.log(err);        }
        res.json(books);
    })
})

app.put('/books/:_id',function (req,res) {
    var book=req.body;
    var query=req.params._id;
    var update={
        '$set':{
            title:book.title,
            description:book.description,
            image:book.image,
            price:book.price
        }
    }

    var options = {new:true};

    Books.findOneAndUpdate(query,update,options,function (err,books) {
        if(err){
            throw err;
        }
        res.json(books)
    })

})

app.get('/images',function (req,res) {
    const imgFolder=__dirname+'/public/images/';
    console.log('---->call<-----',imgFolder)
    const fs=require('fs');
    fs.readdir(imgFolder,function (err,files) {
        if(err){
            return console.log(err);
        }
        const filesArr = [];
        var i=1;

        files.forEach(function (file) {
            filesArr.push({name:file});
            i++;
        })
        res.json(filesArr);
    })
})


app.listen(3001,function(err){
    if(err){
        console.log(err);
    }
    console.log('API Server is listening on http://localhost:3001')
})
