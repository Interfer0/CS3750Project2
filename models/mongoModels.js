module.exports = function(mongoose) {

    var UserSchema = new mongoose.Schema({
        username: String,
        firstname: String,
        lastname: String,
        password: String,
        email: String,
        messages: []

    });

    var User = mongoose.model('users', UserSchema);
    return User;
}