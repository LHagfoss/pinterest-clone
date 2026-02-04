"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateBlurhashes = exports.processPinImage = void 0;
const storage_1 = require("firebase-functions/v2/storage");
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const sharp_1 = __importDefault(require("sharp"));
const storage_2 = require("firebase-admin/storage");
const blurhash_1 = require("blurhash");
admin.initializeApp();
/**
 * Triggered when a file is uploaded to the Storage bucket.
 * We listen for uploads in the "pins/" directory.
 */
exports.processPinImage = (0, storage_1.onObjectFinalized)({
    cpu: 2, // Allocate more CPU for image processing
    memory: "1GiB",
}, async (event) => {
    const fileBucket = event.data.bucket;
    const filePath = event.data.name;
    // 1. Validation: Ensure it's a file in the 'pins/' folder
    if (!filePath || !filePath.startsWith("pins/")) {
        return;
    }
    // Expected path: pins/{pinId}/{filename}
    const parts = filePath.split("/");
    if (parts.length < 3) {
        console.log("File path structure invalid for pin processing.");
        return;
    }
    const pinId = parts[1];
    console.log(`Processing image for Pin ID: ${pinId}`);
    try {
        // 2. Download the file into memory
        const bucket = (0, storage_2.getStorage)().bucket(fileBucket);
        const [buffer] = await bucket.file(filePath).download();
        // 3. Process with Sharp
        const image = (0, sharp_1.default)(buffer);
        const metadata = await image.metadata();
        const stats = await image.stats();
        // Calculate "Average" color as Dominant Color
        // stats.channels[0] is Red, [1] is Green, [2] is Blue
        const r = Math.round(stats.channels[0].mean);
        const g = Math.round(stats.channels[1].mean);
        const b = Math.round(stats.channels[2].mean);
        // Convert RGB to Hex
        const dominantColor = `#${((1 << 24) + (r << 16) + (g << 8) + b)
            .toString(16)
            .slice(1)}`;
        const width = metadata.width || 0;
        const height = metadata.height || 0;
        const ratio = height > 0 ? width / height : 1;
        // Generate Blurhash
        // Resize to small generic size for blurhash calculation
        const { data: rawData, info: rawInfo } = await image
            .clone()
            .resize(32, 32, { fit: "inside" })
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });
        const blurhash = (0, blurhash_1.encode)(new Uint8ClampedArray(rawData), rawInfo.width, rawInfo.height, 4, 3);
        console.log(`Analyzed: ${width}x${height} (${ratio.toFixed(2)}), Color: ${dominantColor}, Blurhash: ${blurhash}`);
        // 4. Update Firestore Document
        // Note: We use { merge: true } style update implicitly by calling .update()
        await admin.firestore().collection("pins").doc(pinId).update({
            width,
            height,
            ratio,
            dominantColor,
            blurhash,
        });
        console.log("Firestore updated successfully.");
    }
    catch (error) {
        console.error("Error processing pin image:", error);
    }
});
exports.migrateBlurhashes = (0, https_1.onRequest)({ timeoutSeconds: 540, memory: "1GiB" }, async (req, res) => {
    try {
        const pinsSnapshot = await admin
            .firestore()
            .collection("pins")
            .get();
        let updatedCount = 0;
        const updates = [];
        for (const doc of pinsSnapshot.docs) {
            const pin = doc.data();
            if (pin.blurhash)
                continue;
            if (!pin.imageUrl)
                continue;
            const updatePromise = (async () => {
                try {
                    console.log(`Migrating pin: ${doc.id}`);
                    const response = await fetch(pin.imageUrl);
                    const arrayBuffer = await response.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    // Resize for blurhash (32x32 is plenty for blurhash)
                    const { data, info } = await (0, sharp_1.default)(buffer)
                        .resize(32, 32, { fit: "inside" })
                        .ensureAlpha()
                        .raw()
                        .toBuffer({ resolveWithObject: true });
                    const hash = (0, blurhash_1.encode)(new Uint8ClampedArray(data), info.width, info.height, 4, 3);
                    await doc.ref.update({ blurhash: hash });
                    return true;
                }
                catch (e) {
                    console.error(`Failed to migrate pin ${doc.id}:`, e);
                    return false;
                }
            })();
            updates.push(updatePromise);
        }
        const results = await Promise.all(updates);
        updatedCount = results.filter(Boolean).length;
        res.status(200).send({ message: `Migrated ${updatedCount} pins.` });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ error: "Migration failed" });
    }
});
//# sourceMappingURL=index.js.map