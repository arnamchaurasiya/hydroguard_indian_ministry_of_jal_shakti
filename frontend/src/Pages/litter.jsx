import { useEffect, useRef } from 'react';
import axios from 'axios';
import './litter.css'
const Litter = () => {
  const videoRef = useRef(null);
//   const [detection, setDetection] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing the camera:', error);
      }
    };

    startCamera();
  }, []);

  const captureFrame = async () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');

      try {
        const response = await axios.post('http://localhost:8080/detect', { image: imageData }, {
          responseType: 'blob', // Expecting a video blob from the backend
        });

        const videoBlob = new Blob([response.data], { type: 'video/mp4' });
        const videoURL = URL.createObjectURL(videoBlob);

        if (videoRef.current) {
          videoRef.current.srcObject = null; // Clear the current stream
          videoRef.current.src = videoURL;
          videoRef.current.play();
        }
      } catch (error) {
        console.error('Error sending image to backend or fetching video:', error);
      }
    }
  };

  return (
    <div className='full' style={{ paddingLeft: '23vw', paddingRight: '22vw', paddingTop: '2vw', minHeight: '100vh', boxSizing: 'border-box' }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: '100%', maxWidth: '700px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginTop: '20px' }}
      ></video>
       <button className="capture-button" onClick={captureFrame}>Capture and Detect</button>
    </div>
  );
};

export default Litter;
