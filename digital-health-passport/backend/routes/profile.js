const express = require('express');
const router = express.Router();
const HealthProfile = require('../models/HealthProfile');
const { protect, authorize } = require('../middleware/auth');

// @route  GET /api/profile
router.get('/', protect, authorize('patient'), async (req, res) => {
  try {
    let profile = await HealthProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = await HealthProfile.create({ user: req.user._id });
    }
    res.json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  PUT /api/profile
router.put('/', protect, authorize('patient'), async (req, res) => {
  try {
    const { dateOfBirth, gender, phone, address, bloodType, allergies, medicalConditions, currentMedications, emergencyContact } = req.body;
    
    const profile = await HealthProfile.findOneAndUpdate(
      { user: req.user._id },
      { dateOfBirth, gender, phone, address, bloodType, allergies, medicalConditions, currentMedications, emergencyContact },
      { new: true, upsert: true, runValidators: true }
    );
    
    res.json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  GET /api/profile/public/:token  (for QR code access - no auth needed)
router.get('/public/:token', async (req, res) => {
  try {
    const profile = await HealthProfile.findOne({ qrCodeToken: req.params.token }).populate('user', 'name email');
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found or QR code is invalid' });
    }
    
    // Return only emergency-critical info
    res.json({
      success: true,
      emergency: {
        name: profile.user.name,
        bloodType: profile.bloodType,
        allergies: profile.allergies,
        medicalConditions: profile.medicalConditions,
        currentMedications: profile.currentMedications,
        emergencyContact: profile.emergencyContact
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
