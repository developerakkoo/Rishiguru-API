 const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const adminModel = require('../../../model/auth/admin/authModel');
const astroModel = require('../../../model/auth/astrologer/astrologer');

const io = require('./../../../socket');



exports.getAllAstrologers = async(req, res, next) =>{
    try{
        const query = req.query || '';

        const astrologer = await astroModel.find(query);

        if(astrologer){
            res.status(200).json({
                status: 'success',
                astrologer,
                message: 'This are the results based on query.'
            })
        }else{
            res.status(404).json({
                status: 'error',
                message: 'No Search Results.'
            })
        }

    }

    catch(error){
        if(error){
            res.status(500).json({status: 'error', devError:error.message, message: 'Something went wrong...'})
        }
    }
}
exports.RegisterAstrologer = async(req, res, next) =>{
    try {
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const experience = req.body.experience;
        const mobilenumber = req.body.mobilenumber;
        const language = req.body.language;
        const rating = req.body.rating;
        const aboutme = req.body.aboutme;
        const verificationStatus = req.body.verificationStatus;
        const totalConsulations = req.body.totalConsulations;
        const charges = req.body.charges;
        const activeOnVideo = req.body.activeOnVideo;
        const activeOnChat = req.body.activeOnChat;
        const activeOnCall = req.body.activeOnCall;
        const type = req.body.type;
        const email = req.body.email;
        const password = req.body.password;

        let imageUrl = req.file.path;

        if(!imageUrl){
            res.status(404).json({status: 'error', message: 'Please upload profile picture.'})
        }

        const astrologer = await astroModel.findOne({email: email});

        if(astrologer){
            res.status(400).json({message:'astrologer with email already exists. Please use different email.'})
        }
        else{

            
            const hashedPassword = await bcrypt.hash(password, 12);
            
            if(hashedPassword){
                const astrologer = new astroModel({
                    firstname: firstname,
                    lastname: lastname,
                    experience: experience,
                    mobilenumber: mobilenumber,
                    language:language,
                    rating: rating,
                    verificationStatus: verificationStatus,
                    aboutme: aboutme,
                    type:type,
                    charges: charges,
                    totalConsulations: totalConsulations,
                    activeOnVideo: activeOnVideo,
                    activeOnChat:activeOnChat,
                    activeOnCall:activeOnCall,
                    email: email, 
                    password: hashedPassword,
                    imageUrl: req.protocol + '://' + req.hostname + ':' + process.env.PORT + '/' + imageUrl
                });
                astrologer.save().then((success) =>{
                    res.status(200)
                    .json({status:'success', message: 'astrologer successfully registered!', astrologerId: success._id})
                })
            }
            
            
        }

    } catch (error) {
        if(error){
            res.status(500).json({status: 'error', devError:error.message, message: 'Something went wrong...'})
        }
    }
}

exports.loginAstrologer = async(req, res, next) =>{
    try {
        const email = req.body.email;
        const password = req.body.password;

        let loadedAstrologer;

        const astrologer = await astroModel.findOne({email: email});

        if(astrologer){
        {
            loadedAstrologer = astrologer;

            bcrypt.compare(password, astrologer.password)
            .then((doMatch) =>{
                if(doMatch){
                    const token = jwt.sign({email: email}, process.env.JWT_SECRET_KEY, {
                        expiresIn:'1h'
                    })

                    res.status(200)
                    .json(
                        {
                            status:'success', 
                            message:'Login successfull!', 
                            token: token, 
                            astrologerId: loadedAstrologer._id.toString()
                        })
                }
            })
        
        }}

        else{
            res.status(404).json({status: false, message:"You need to Register to login!"})
        }
    } catch (error) {
       
            res.status(500).json({status: 'error', devError:error, message: 'Something went wrong...'})
        
    }
}



exports.getAstrologerById = async(req, res, next) =>{
    try {
        const astrologerId = req.params.id;

        const astrologer = await astroModel.findById(astrologerId);

        if(astrologer){
            res.status(200).json({status: 'success', message:"astrologer Found!", astrologer})
        }else{
            res.status(404).json({status: 'error', message:"astrologer Not Found!"})
        }
        
    } catch (error) {
        if(error){
            res.status(500).json({status: 'error', devError:error, message: 'Something went wrong...'})
        }
    }
}

exports.updateAstrologer = async(req, res, next) =>{
    try {
        const astrologerId = req.params.id;



        const astrologer = await astroModel.findByIdAndUpdate(astrologerId, req.body, (err, result) =>{
            if(err){
                res.status(404).json({status: 'error', message:'Error updating astrologer!'})

            }
            res.status(200).json({status: 'success', message: 'astrologer Updated successfully!', result})
            io.getIO().emit('astrologer:update', {state: result});

        });

    } catch (error) {
        if(error){
            res.status(500).json({status: 'error', devError:error, message: 'Something went wrong...'})
        }
    }
}

exports.deleteAstrologer = async(req, res, next) =>{
    try {
        const astrologerId = req.params.id;

        const astrologer = await astroModel.findByIdAndDelete(astrologerId);

        if(astrologer){
            res.status(200).json({status: 'success', message:"Deleted astrologer Successfully!"})
        }
       
    } catch (error) {
        if(error){
            res.status(500).json({status: 'error', devError:error, message: 'Something went wrong...'})
        }
    }
}

