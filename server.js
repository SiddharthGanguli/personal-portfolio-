const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const ImageKit = require("imagekit");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const admin = require("firebase-admin");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Initialize ImageKit
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Initialize Firestore
const db = getFirestore(); // Initialize Firestore here

// Upload Image Route (POST /upload)
app.post("/upload", async (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.files.file;
    const title = req.body.title || "Untitled Post"; // Title from form

    try {
        // Upload image to ImageKit
        const result = await imagekit.upload({
            file: file.data,
            fileName: file.name
        });

        // Store post details in Firestore
        const newPost = {
            title: title,
            imageUrl: result.url,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        };

        // Add post data to Firestore
        await db.collection("social_content").add(newPost);

        res.json({ url: result.url, message: "Image uploaded successfully!" });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ error: "Upload failed", details: error.message });
    }
});

// Webhook Route to Listen for ImageKit Updates (Optional, if using ImageKit webhook)
app.post("/imagekit-webhook", (req, res) => {
    // Handle the webhook notification from ImageKit
    const webhookPayload = req.body;
    console.log("ImageKit Webhook received:", webhookPayload);

    // You can process the data here
    // For example, store metadata in Firestore or handle updates

    res.status(200).send("Webhook received successfully.");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
