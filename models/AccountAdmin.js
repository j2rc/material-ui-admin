import { Schema } from "mongoose"

const accountAdminSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        maxlength: [20, "Title must be less than 20 characters"]
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: [20, "Title must be less than 20 characters"]
    },
    customized: {
        select: String,
        input: String
    },
    superAdmin: { type: Boolean, default: false },
    permissions: {
        read: [String],
        write: [String],
    },

})

export default accountAdminSchema