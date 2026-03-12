import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import './QRCardPage.css';

function QRCardPage() {
  const [qrCode, setQrCode] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    api.get('/qr/my-qr')
      .then(res => {
        setQrCode(res.data.qrCode);
        setQrUrl(`${window.location.origin}/emergency/${res.data.qrCodeToken}`);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const generate = async () => {
    setGenerating(true);
    try {
      const { data } = await api.post('/qr/generate');
      setQrCode(data.qrCode);
      setQrUrl(data.qrUrl);
      toast.success('QR Code generated! Save it to your phone.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    }
    setGenerating(false);
  };

  const downloadQR = () => {
    const a = document.createElement('a');
    a.href = qrCode;
    a.download = 'health-passport-qr.png';
    a.click();
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="spinner" style={{ width: 36, height: 36 }} /></div>;

  return (
    <div className="qr-page fade-in">
      <div className="page-header">
        <h1>Emergency QR Card</h1>
        <p>Share this QR code with first responders to instantly access your critical health info.</p>
      </div>

      <div className="qr-layout">
        <div className="qr-main card">
          {qrCode ? (
            <>
              <div className="qr-container">
                <img src={qrCode} alt="Health Passport QR Code" className="qr-image" />
              </div>
              <div className="qr-actions">
                <button className="btn btn-primary" onClick={downloadQR}>⬇ Download QR</button>
                <button className="btn btn-secondary" onClick={generate} disabled={generating}>
                  {generating ? <><span className="spinner" /> Regenerating...</> : '↻ Regenerate'}
                </button>
              </div>
              <div className="qr-url-box">
                <span className="qr-url-label">Emergency URL:</span>
                <a href={qrUrl} target="_blank" rel="noreferrer" className="qr-url">{qrUrl}</a>
              </div>
            </>
          ) : (
            <div className="qr-empty">
              <div className="qr-placeholder">⬡</div>
              <h3>No QR Code Yet</h3>
              <p>Generate your emergency QR card. Make sure your health profile is complete first.</p>
              <button className="btn btn-primary btn-lg" onClick={generate} disabled={generating}>
                {generating ? <><span className="spinner" /> Generating...</> : '⬡ Generate My QR Card'}
              </button>
            </div>
          )}
        </div>

        <div className="qr-info">
          <div className="info-card card">
            <h3>📱 How to Use</h3>
            <ol className="info-list">
              <li>Download the QR code image</li>
              <li>Set it as your phone's <strong>lock screen wallpaper</strong></li>
              <li>Or print it on a card to keep in your wallet</li>
              <li>Emergency responders scan it to instantly see your health info</li>
            </ol>
          </div>
          <div className="info-card card emergency-preview">
            <h3>🚑 What Responders See</h3>
            <div className="preview-items">
              <div className="preview-item">🩸 Blood Type</div>
              <div className="preview-item">⚠️ Allergies</div>
              <div className="preview-item">🩺 Medical Conditions</div>
              <div className="preview-item">💊 Current Medications</div>
              <div className="preview-item">📞 Emergency Contact</div>
            </div>
          </div>
          <div className="info-card card tip-card">
            <h3>💡 Pro Tips</h3>
            <ul className="info-list">
              <li>Regenerate if you update your health profile</li>
              <li>The link works without logging in — for emergencies</li>
              <li>Keep your allergies and blood type updated</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRCardPage;
