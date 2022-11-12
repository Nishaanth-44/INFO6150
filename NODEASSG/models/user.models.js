const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const userSchema= new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
        validate: {
            validator: validation => {
                const val = /^[A-Za-z0-9]{7,14}$/i;
                return validation.match(val)
            },
            message : out => `Username should have atleast 7 and a max of 14 characters of Numeric alphabets only`
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate: {
            validator: validation => {
                const val = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$/i;
                return validation.match(val)
            },
            message : out => `The mailid ${out.value} is not valid`
        }
    },
    password:{
        type:String,
        required:true,
        validate: {
            validator : validation => {
                const val = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                return validation.match(val);
            },
            message: out => `Password must contain atleast 8 characters with a number,special character ,one uppercase letter and one lowercase letter`
        }
    }
});
userSchema.pre('save', async function(next){
    try{
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(this.password,salt);
        this.password = hashPass;
        next();
    }catch(err){
        next(err);
    }
});
module.exports = mongoose.model('User_Collection', userSchema);