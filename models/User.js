const mongoose=require("mongoose")

const UserSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    password:String,
    createdAt:{
        type:Date,
        immutable:true,
        default: ()=>Date.now(),
    },
    username:String,
    GToken:String,
    type:String,
    chats:[Object],
})

module.exports=mongoose.model("nidaan",UserSchema)