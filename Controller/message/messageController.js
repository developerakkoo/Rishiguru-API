const io = require('./../../socket');

const MessageModal = require('../../model/message/message');
const Room = require('./../../model/room/room');


exports.createMessage = async(req, res, next) =>{

   

     const message = new MessageModal({
         room: req.body.room,
         user: req.body.user,
         Type: req.body.type,
         msg: req.body.msg
     })
    
     message.save().then(async (s) =>{
         console.log("MSg "+ s._id);
         const room = await Room.findOneAndUpdate({name: req.body.room}, {
             $addToSet:{
                 messages: s._id
             }
         },function (err, doc){
             if(err){

                 res.status(400).json({
                     status: false,
                     message: err
                    })
                }else{
                    res.status(200).json({
                        status: true,
                        doc
                    })
                }
         })
     }).catch(err =>{
         console.log(err);
     })
 
}


exports.getMessageByRoomId = async(req, res, next) =>
{
    try {
        const roomId = req.params.id;

        const room = await Room.findOne({name: roomId}).populate('messages');

        if(room){
            console.log("Room Found Fr Mesg " + room.name);
            res.status(200).json({
                status: true,
                roomId: room._id,
                messages: room.messages
            })

            io.getIO().emit('msg:get', {action: 'getmsg', msg: room.messages});
        }

    } catch (error) {
        res.status(500).json({
            status: false,
            messsage: error.messsage
        })
    }
}


exports.getAllMessages = async(req, res, next) =>{
    try {
        const roomId = req.params.id;

        const msg = await Message.find({room: roomId});


        if(msg){
            res.status(200).json({
                status: true,
                message: 'Retrived all messages.',
                msg
            })

            io.getIO().emit('msg:get', {action: 'getmsg', msg: msg});

        }

    } catch (error) {
        res.status(500).json({
            status: false,
            messsage: error.messsage
        })
    }
}
exports.deleteMessageByRoomId = async(req, res, next) => {
    try{
        const roomId = req.params.roomId;
        console.log("Room in deleteMessageByRoomId");

        const room = await Room.find({name:roomId});
        if(room){
            console.log("Room Found in deleteMessageByRoomId");
            const msg = await MessageModal.deleteMany({room: roomId});

            if(msg){
                console.log("Message Found in deleteMessageByRoomId "+ msg);
                res.status(200).json({msg, message: "msg Deleted in deleteMessageByRoomId", id: msg._id})
            }
        }

    }catch (error) {
        res.status(500).json({
            status: false,
            messsage: error.messsage
        })
    }
}
exports.deleteMessageByUserId = async(req, res, next) =>{
    try {
        const userId = req.params.userId;

        const msg = await Message.findByIdAndDelete(userId);

        if(msg){
            res.status(200).json({
                status: true,
                msg
            })
        }

    } catch (error) {
        res.status(500).json({
            status: false,
            messsage: error.messsage
        })
    }
}


