const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Record title is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['lab_report', 'prescription', 'xray', 'scan', 'vaccination', 'discharge_summary', 'other'],
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    default: ''
  },
  publicId: {
    type: String,
    default: ''
  },
  recordDate: {
    type: Date,
    default: Date.now
  },
  doctorName: {
    type: String,
    default: ''
  },
  hospitalName: {
    type: String,
    default: ''
  },
  tags: [{ type: String }],
  isShared: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
