
import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({
  roles: [String],
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);

export default User;
