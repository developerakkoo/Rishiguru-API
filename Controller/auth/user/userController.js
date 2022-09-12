const User = require('../../../model/auth/user/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const client = require('twilio')("AC98980efd829b8762ab909275ce10846d","43afffd4206d5e264906e819e302045a");

const io = require('../../../socket');


const razorpay = require('razorpay');

var instance = new razorpay({
    key_id:'rzp_test_1VkjMQej0xnMKM',
    key_secret:'g9jqCIN3fPgP8tZrBdqafYfg',
});




exports.createOrder = async(req, res, next) => {
    try {
        const amount = req.body.amount;
        
        var options = {
            amount: amount,
            currency:'INR'
        }

        instance.orders.create(options, function(err, order) {
            console.log("ORDER: " + order);

            if(err) {
                res.status(400).json({ message: err.message, status: 'error' });
            }

            res.status(201).json({status: 'success', message: 'Order Created.', order});
        });
    } catch (error) {
        res.status(400).json({message: error.message, status:'error'});
    }
}


exports.getToken = async(req, res, next) => {
    const phonenumber = req.body.phonenumber;
  
    console.log("PHONE:- "+ phonenumber);
    client.verify.services('VAd9cf754966edfca3471746c788ee7812')
    .verifications
    .create({
        to:"+91"+phonenumber,
        channel: 'sms'
    }).then((success) => {
        res.status(200).json({
            status: 'success',
            success: success
        })
    }).catch((error) => {
        res.status(200).json({
            status: 'error',
            error: error,
             message: 'Something went wrong!'
        })
    })
 }
 
 
 
 
 exports.verifyToken = async(req, res, next) => {
 
     const code = req.body.code;
     const phonenumber = req.body.phonenumber;
 
    
     client.verify.services("VAd9cf754966edfca3471746c788ee7812")
     .verificationChecks
     .create({
         
             to: "+91"+phonenumber,
             code: code
         
     }).then((success) => {
         res.status(200).json({success})
     }).catch((error) => {
         res.status(401).json({status:'error' ,error, message: 'Something went wrong!'})
     })
 }




exports.RegisterAdmin = async(req, res, next) =>{
    try {
        const name = req.body.name;
        const phonenumber = req.body.phonenumber;
        const availableBalance = req.body.balance;

        const user = await User.findOne({phonenumber: phonenumber});

        if(user){
            const user = new User({phonenumber: phonenumber,
                 
                name: name,
               });
            user.save().then((success) =>{
                res.status(200).json({status:'success', message: 'User successfully registered!', userId: success._id})
            })
        }
      

    } catch (error) {
        if(error){
            res.status(500).json({status: 'error', devError:error.message, message: 'Something went wrong...'})
        }
    }
}

exports.loginAdmin = async(req, res, next) =>{
    try {
        const phonenumber = req.body.phonenumber;

        let loadedUser;

        const user = await User.findOne({phonenumber: phonenumber});

        if(user){
        
            res.status(200).json({status:'success', message:'Login successfull!',  userId: user._id.toString()})
    }else{
            res.status(404).json(
                {
                    status:'error',
                    message: 'Problem Logging in...'
                }
            )
        }
    } catch (error) {
        if(error){
            res.status(500).json({status: 'error', devError:error, message: 'Something went wrong...'})
        }
    }
}

exports.getUsers = async(req, res, next) =>{
    try {
        const user = User.find({});

        if(user){
            res.status(200).json({
                status: true,
                user
            })

            io.getIO().emit('user:get', {user: user});
        }
    } catch (error) {
        if(error){
            res.status(500).json({status: 'error', devError:error, message: 'Something went wrong...'})
        }
    }
}


exports.getUserById = async(req, res, next) =>{
    try {

        const userId = req.params.userId;

        const user = await User.findById(userId);

        if(user){
            res.status(200).json({status: true, user})
            io.getIO().emit('user:get', {user: user});

        }
        
    } catch (error) {
        if(error){
            res.status(500).json({status: 'error', devError:error, message: 'Something went wrong...'})
        }
    }
}

exports.updateUser = async(req, res, next) =>{
    try {
        const id = req.params.userId;

        const amount = req.body.availableBalance / 100;
        User.findByIdAndUpdate(id, {
            $inc: {availableBalance: amount}
        }, {new: true},(err, user) =>{
            if(err){
                res.status(404).json({status: 'error', devError:err, messsage: 'Something went wrong!'})
                
            }
            
            res.status(201).json({status: true, user, message: 'Updated user successfully'});
            io.getIO().emit('user:get', {user: user});
        })
    } catch (error) {
        if(error){
            res.status(500).json({status: 'error', devError:error, message: 'Something went wrong...'})
        }
    }
}