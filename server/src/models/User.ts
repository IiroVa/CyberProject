import mongoose, {Document, Schema} from "mongoose";

interface IUser extends Document {
    
    username: string
    password: string
    

}

const UserSchema: Schema = new Schema({
    
    username: {type: String, required: false, unique: true},
    password: {type: String, required: true},
    
    
})

const User: mongoose.Model<IUser> = mongoose.model<IUser>("User", UserSchema)

export {User, IUser}