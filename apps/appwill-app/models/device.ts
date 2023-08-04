import mongoose from 'mongoose'
import {Step} from "./step";

export interface Device {
    deviceName: string;
    model: string;
    phoneNumber: string;
    key: string;
    _id: string;
    generateQrCode: boolean;
    steps?: Step[]
}

const DeviceSchema = new mongoose.Schema({
    deviceName: {
    type: String,
    required: [true, 'Please provide a device name for this device.'],
    maxlength: [60, 'Device name cannot be more than 60 characters'],
  },
  model: {
    type: String,
    required: [true, 'Please provide a model for this device.'],
    maxlength: [60, 'Model cannot be more than 60 characters'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide a phone number for this device.'],
    maxlength: [60, 'Phone number cannot be more than 60 characters'],
  },
  key: {
    type: String,
    required: [true, 'Please provide a key for this device.'],
    maxlength: [60, 'Key cannot be more than 60 characters'],
  },
  generateQrCode: {
    type: Boolean,
    required: [true, 'Please provide a check if qr code should be generated for this device.'],
  },
  steps: {
    type: Array,
  },
})

export default mongoose.models.Device || mongoose.model('Device', DeviceSchema)
