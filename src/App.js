
import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import './App.css';

function App() {
  const videoRef = useRef(null);
  const [expression, setExpression] = useState('neutral');

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      startVideo();
    };

    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error('Camera error:', err));
    };

    loadModels();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!videoRef.current) return;

      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections.length > 0 && detections[0].expressions) {
        const sorted = Object.entries(detections[0].expressions).sort((a, b) => b[1] - a[1]);
        setExpression(sorted[0][0]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <h1>Ayna Ruh: Duygusal Yansıma</h1>
      <p className="quote">
        "Tek gerçek dost aynadaki sensin. Neden mi? Sen ağlarken o da ağlar, gülerken o da güler."
      </p>
      <video ref={videoRef} autoPlay muted width="320" height="240" />
      <div className="status">Duygusal Durum: <strong>{expression}</strong></div>
    </div>
  );
}

export default App;
