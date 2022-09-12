const Room = require('./../../model/room/room');
const User = require('./../../model/auth/astrologer/astrologer');
const io = require('./../../socket');



exports.createRoom = async(req, res, next) => {
    try {

        const room = await Room.create(req.body);

        if(room){
            res.status(200).json({
                status: 'success',
                room
            })

            io.getIO().emit('room:create', {action:'create', room: room});
        }

    } catch (error) {
        res.status(500).json({
            error,
            message: error.message
        })
    }
}


exports.getRoomById = async(req, res, next) => {
    try {

        const id = req.params.id;
        const room = await Room.findById(id).populate("users messages");

        if(room){
            res.status(200).json({
                status: 'success',
                room
            })

            io.getIO().emit('room:all', {action:'getall', room: room})
        }
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}



exports.getRoom = async(req, res, next) => {
    try {

        const room = await Room.find({}).populate("users");

        if(room){
            res.status(200).json({
                status: 'success',
                room
            })

            io.getIO().emit('room:all', {action:'get', room: room})
        }
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}


exports.deleteRoom = async(req, res, next) => {
    try {
        const roomId = req.params.id;

        const room = await Room.findByIdAndDelete(roomId);

        if(room){
            res.status(200).json({
                status: 'success',
            })

            io.getIO().emit('room:delete', {action:'delete', room: room})
        }
    } catch (error) {
        res.status(500).json({
            error
        })
    }
}

exports.addUserToRoom = async(req, res, next) =>{
    try {
        const userId = req.params.userId;
        const roomId = req.params.roomId;

        const user = await User.findById(userId);

        if(user){
            Room.findByIdAndUpdate(roomId, {
                $addToSet:{users: userId}
            })
        }else{
            res.status(404).json({
                status: false,
                message: "User with ID not Found"
            })
        }
    } catch (error) {
        res.status(500).json({
            error
        })
    }
}


exports.getRoomByTopic = async(req, res, next) =>{
    try {
        const topic = req.params.topic;

        const room = await Room.find({topic: topic});

        if(room){
            res.status(200).json({
                status: 'success',
                room
            })

            io.getIO().emit('room:topic', {action:'getbytopic', room: room})

        }   
    } catch (error) {
        res.status(500).json({
            error
        })
    }
}



