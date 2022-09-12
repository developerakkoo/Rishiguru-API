const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const io = require('.././../../socket');
const adminModel = require('../../../model/auth/admin/authModel');

exports.RegisterAdmin = async(req, res, next) =>{
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        const admin = await adminModel.findOne({username: username});

        if(admin){
            res.status(400).json({message:'Admin with username already exists. Please use different username.'})
        }
        else{

            
            const hashedPassword = await bcrypt.hash(password, 12);
            
            if(hashedPassword){
                const admin = new adminModel({username: username, email: email, password: hashedPassword});
                admin.save().then((success) =>{
                    res.status(200).json({status:'success', message: 'Admin successfully registered!', adminId: success._id})
                })
            }
            
            
        }

    } catch (error) {
        if(error){
            res.status(500).json({status: 'error', devError:error.message, message: 'Something went wrong...'})
        }
    }
}

exports.loginAdmin = async(req, res, next) =>{
    try {
        const username = req.body.username;
        const password = req.body.password;

        let loadedAdmin;

        const admin = await adminModel.findOne({username: username});

        if(admin){
        {
            loadedAdmin = admin;

            bcrypt.compare(password, admin.password)
            .then((doMatch) =>{
                if(doMatch){
                    const token = jwt.sign({username: username}, process.env.JWT_SECRET_KEY, {
                        expiresIn:'1h'
                    })

                    res.status(200).json({status:'success', message:'Login successfull!', token: token, adminId: loadedAdmin._id.toString()})
                }
            })
        
        }}else{
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



exports.getAdminById = async(req, res, next) =>{
    try {
        const adminId = req.params.id;

        const admin = await adminModel.findById(adminId);

        if(admin){
            res.status(200).json({status: 'success', message:"Admin Found!", admin})
        }else{
            res.status(404).json({status: 'error', message:"Admin Not Found!"})
        }
        
    } catch (error) {
        if(error){
            res.status(500).json({status: 'error', devError:error, message: 'Something went wrong...'})
        }
    }
}

exports.updateAdmin = async(req, res, next) =>{
    try {
        const adminId = req.params.id;

        const username = req.body.username;
        const email = req.body.email;



        const admin = await adminModel.findByIdAndUpdate(adminId, {
            email: email,
            username: username
        }, (err, result) =>{
            if(err){
                res.status(404).json({status: 'error', message:'Error updating admin!'})

            }
            res.status(200).json({status: 'success', message: 'Admin Updated successfully!', result})

        });

    } catch (error) {
        if(error){
            res.status(500).json({status: 'error', devError:error, message: 'Something went wrong...'})
        }
    }
}

exports.deleteAdmin = async(req, res, next) =>{
    try {
        const adminId = req.params.id;

        const admin = await adminModel.findByIdAndDelete(adminId);

        if(admin){
            res.status(200).json({status: 'success', message:"Deleted Admin Successfully!"})
        }
       
    } catch (error) {
        if(error){
            res.status(500).json({status: 'error', devError:error, message: 'Something went wrong...'})
        }
    }
}