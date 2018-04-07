var userSchema = {
    TableName : "Users",
    KeySchema: [
        { AttributeName: "username", KeyType: "HASH"},
    ],


    /// change below
    username: {
        type: String, required: true, unique: true
    },
    password: {
        type: String, requried: true
    },
    email: {type: String, default: ""},
    bio: {type: String, default: ""},
    online: {
        type: Boolean, required: true, default: 0
    },
    friends: [String]
}
