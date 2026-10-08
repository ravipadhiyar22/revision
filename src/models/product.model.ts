import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 150
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    sku: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5000,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    images: [
        {
            key: String,        // S3 object key
            alt: String,        // accessibility
            position: Number,   // display order
            width: Number,
            height: Number,
            mimeType: String
        }
    ],
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true,
    },
}, { timestamps: true });


export type productType = mongoose.InferSchemaType<typeof productSchema>;
export const Product = mongoose.model("Product", productSchema);