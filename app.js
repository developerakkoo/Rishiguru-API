const express = require('express');

const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const multer = require('multer');
const dotenv = require('dotenv');
const cors = require('cors');
var request = require('request');
const AppError = require('./utils/appError');
const rp = require("request-promise");
const adminAuthRoute = require('./Routes/auth/admin/authRoute');
const blogRoute = require('./Routes/blog/blogRoute');
const astrologerRoute = require('./Routes/auth/astrologer/astrologerRoute');
const rechargeRoute = require('./Routes/recharge/rechargeRoute');
const roomRoute = require('./Routes/room/room');
const userRoute = require('./Routes/auth/user/user');
const messageRoute = require('./Routes/message/message');

const app = express();



const diskStorage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'images');
    },

    filename: (req, file, cb) =>{
        cb(null, Date.now()  + file.originalname.replace(/\\/g, "/"));
    }
})
const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/jpg' || 
       file.mimetype === 'image/jpeg'|| 
       file.mimetype === 'image/png')
    {
        cb(null, true)
    }else{
        cb(null, false)
    }
}


app.use(multer({ storage: diskStorage, fileFilter: fileFilter }).single('file'));

app.use('/images',express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
  });

dotenv.config({
    path:'config.env'
})


app.use(express.json());

app.use(cors());
app.use(adminAuthRoute);
app.use(blogRoute);
app.use(astrologerRoute);
app.use(rechargeRoute);
app.use(roomRoute);
app.use(userRoute);
app.use(messageRoute);


app.post('/api/call', (req, res) => {


    let data = {
        From: `+91${req.body.sender}`,
        To: `+91${req.body.receiver}`,
        CallerId: "02071178011",
        CallerType: 'trans'
    }

    console.log(data);
    var options = {
        'method': 'POST',
        'url': 'https://d07d26129826e344a0d9ac80c785805eca164397b93a17fc:94a87bf49f558b65245b8a82ca93c55df31332c833cd7b5e@api.exotel.com/v1/Accounts/rishiguru1/Calls/connect',
        'headers': {
        },
        formData: {
          'From': `+91${req.body.sender}`,
          'To': `+91${req.body.receiver}`,
          'CallerId': '02071178011'
        }
      };
      request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
        res.json(response.body);
      });

    
})



app.use((err, req, res, next) => {
    console.log(err);
    const status = err.status || 500;
    const message = err.message;
    const data = err.data;

    res.status(status).json({
        message: message,
        data: data,
        error: err
    })
});

app.all('*', (req, res, next) => {

    res.status(400).json({
        status: 'Not Found',
        message: 'This API is not available.'
    })

    
})

process.on('unhandledRejection', function(reason, p) {
    console.log("Unhandled Rejection:", reason.stack);
    //process.exit(1);
  });

mongoose.connect(process.env.DATABASE_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}).then((connected) => {
    const server = app.listen(  );
     const io = require('./socket').init(server);

    io.on('connection', (connection) => {
        console.log("Connection established");


        connection.on('msg:typing', (data) =>{
            console.log("User typing"+ data['name']);
        })

        connection.on('chat:opened', (data) =>{
            console.log("Chat Opened:- "+ data['roomId']);

            
            io.emit('chat:astrologer-open', {roomId: data['roomId']})
        })


        connection.on("chat:closed", (data) =>{
            console.log("Chat Closed:- "+ data['roomId']);
            io.emit('chat:astrologer-close', {roomId: data['roomId']});

        })

        connection.on('disconnect', () =>{
            console.log("Connection closed");
        })
    })

}).catch((err) =>{
    console.log(err);
    
})