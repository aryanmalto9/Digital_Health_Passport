const express = require('express');
const router = express.Router();
const MedicalRecord = require('../models/MedicalRecord');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// @route  GET /api/records
router.get('/', protect, async (req, res) => {
  try {
    const query = req.user.role === 'patient' 
      ? { patient: req.user._id } 
      : {};
    
    const { category, search } = req.query;
    if (category && category !== 'all') query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

    const records = await MedicalRecord.find(query)
      .populate('patient', 'name email')
      .populate('uploadedBy', 'name role')
      .sort({ recordDate: -1 });
    
    res.json({ success: true, count: records.length, records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  POST /api/records  (upload a new record)
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const { title, category, description, recordDate, doctorName, hospitalName, patientId } = req.body;
    
    // Doctors can upload for any patient; patients only for themselves
    const patient = req.user.role === 'doctor' && patientId ? patientId : req.user._id;

    const record = await MedicalRecord.create({
      patient,
      uploadedBy: req.user._id,
      title,
      category,
      description,
      recordDate: recordDate || Date.now(),
      doctorName,
      hospitalName,
      fileUrl: req.file.path,
      fileType: req.file.mimetype,
      publicId: req.file.filename
    });

    res.status(201).json({ success: true, record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  DELETE /api/records/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    
    if (record.patient.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    await record.deleteOne();
    res.json({ success: true, message: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/records/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patient', 'name email')
      .populate('uploadedBy', 'name role');
    
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    
    if (record.patient._id.toString() !== req.user._id.toString() && req.user.role === 'patient') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    res.json({ success: true, record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
