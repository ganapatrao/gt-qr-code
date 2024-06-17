import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Define the QR Generator Schema
const qrGeneratorSchema = new mongoose.Schema({
  sessionId: { type: String, default: uuidv4 },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
  validUntil: { type: Date, required: true },
  isExpired: { type: Boolean, default: false },
  hostname: { type: String, required: true },
});

// Middleware to update the updatedAt field on save
qrGeneratorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create the QR Generator Model
export const QrGeneratorModel = mongoose.model('QrGenerator', qrGeneratorSchema);