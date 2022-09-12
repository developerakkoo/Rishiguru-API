const Recharge = require('../../model/recharge/recharge');

const io = require("../../socket");


exports.getAllRecharge = async(req, res, next) =>{
    try {
        let query = req.query;

        const recharge = await Recharge.find(query);

        if(recharge){
            res.status(200).json({
                status: 'error',
                message:'All Recharge Fetched!',
                recharge
            })
        }
    } catch (error) {
        if (error) {
            res
              .status(500)
              .json({ status: "error", devError: error.message, message: "Something went wrong..." });
          }
    }
}


exports.getStats = async(req, res, next) =>{
    try{

        const stats = await Recharge.aggregate([{
            $group:{
               
                _id:{
                    $dayOfYear: "$createdAt"
                },

                totalAmount: {
                   $sum: '$amount'
                },

                totalRecharge:{
                    $sum: 1
                }


            }
        }])


        if(stats){

            res.status(200).json({
                status:'success',
                data: {
                    stats
                }
            })
        }else{
            res.status(404).json({
                status: 'error',
                message: 'Nothing to'
            })
        }




    }catch(error){
        if (error) {
            res
              .status(500)
              .json({ status: "error", devError: error.message, message: "Something went wrong..." });
          }
    }
}

exports.addRecharge = async(req, res, next) =>{
    try{

        const userId = req.body.userId;
        const status = req.body.status;
        const amount = req.body.amount;

        const recharge = await Recharge.create(req.body, (err, result) =>{
            if(err){
                res.status(404).json({
                    status: 'error',
                    message: err
                })
            }
            else{
                res.status(201).json({
                    status: 'success',
                    message: 'Added a Recharge',
                    result
                })
            }
        });

    }catch(error){
        if (error) {
            res
              .status(500)
              .json({ status: "error", devError: error.message, message: "Something went wrong..." });
          }
    }
}


exports.getRechargeById = async(req, res, next) =>{
    try{

    }catch(error){
        if (error) {
            res
              .status(500)
              .json({ status: "error", devError: error.message, message: "Something went wrong..." });
          }
    }
}


exports.deleteRecharge = async(req, res, next) =>{
    try{

    }catch(error){
        if (error) {
            res
              .status(500)
              .json({ status: "error", devError: error.message, message: "Something went wrong..." });
          }
    }
}



exports.updateRecharge = async(req, res, next) =>{
    try{

    }catch(error){
        if (error) {
            res
              .status(500)
              .json({ status: "error", devError: error.message, message: "Something went wrong..." });
          }
    }
}