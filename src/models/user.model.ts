import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'is invalid']
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
    methods: {
        async comparePassword(password: string) {
            return bcrypt.compare(password, this.password);
        },
        async generateAccessToken() {
            return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET as string, { expiresIn: "5d" });
        }
    },
});


userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
})

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = async function (): Promise<string> {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET as string, { expiresIn: "5d" })
}
export type IUser = mongoose.InferSchemaType<typeof userSchema>;
export const User = mongoose.model("User", userSchema);