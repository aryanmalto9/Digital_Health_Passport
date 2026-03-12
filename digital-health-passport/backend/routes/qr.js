const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const crypto = require('crypto');
const HealthProfile = require('../models/HealthProfile');
const { protect, authorize } = require('../middleware/auth');

// @route  POST /api/qr/generate
router.post('/generate', protect, authorize('patient'), async (req, res) => {
  try {
    let profile = await HealthProfile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Health profile not found. Please complete your profile first.' });
    }

    // Generate a unique token for this profile
    const token = crypto.randomBytes(32).toString('hex');
    
    // The URL that the QR code will point to
    const qrUrl = `${process.env.CLIENT_URL}/emergency/${token}`;
    
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
      width: 300,
      margin: 2,
      color: { dark: '#1a1a2e', light: '#ffffff' }
    });
    
    // Save token to profile
    profile.qrCode = qrCodeDataUrl;
    profile.qrCodeToken = token;
    await profile.save();
    
    res.json({ success: true, qrCode: qrCodeDataUrl, qrUrl, token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  GET /api/qr/my-qr
router.get('/my-qr', protect, authorize('patient'), async (req, res) => {
  try {
    const profile = await HealthProfile.findOne({ user: req.user._id });
    if (!profile || !profile.qrCode) {
      return res.status(404).json({ success: false, message: 'No QR code generated yet.' });
    }
    res.json({ success: true, qrCode: profile.qrCode, qrCodeToken: profile.qrCodeToken });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
