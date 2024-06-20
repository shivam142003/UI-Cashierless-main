import React, { useState, useRef,useEffect  } from 'react';
import axios from 'axios';
import './CounterComponent.css';
import defaultImage from './camera-solid.svg';
import './Style.css';
import { Modal } from '@mui/material';
import  Results  from './Results';



const CounterComponent = () => {
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [processedImageSrc, setProcessedImageSrc] = useState('');
    const [output, setOutput] = useState([]);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const processedImageRef = useRef(null);
    const captureBtnRef = useRef(null);
    const [isModal,setModel]=useState(false);
    

    useEffect(() => {
      // Set the default image source on component mount
      setProcessedImageSrc(defaultImage);
    }, []);

    const updateOutput = (data) => {
               console.log(data)
            setOutput(data);
    };
    const openCamera = () => { 
   navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }) 
     .then((stream) => { 
         processedImageRef.current.style.display = 'none'; 
         videoRef.current.style.display = 'block'; 
       videoRef.current.srcObject = stream; 
       videoRef.current.play(); 
       setIsCameraOpen(true); 
       captureBtnRef.current.textContent = 'Capture'; 
     }) 
     .catch((error) => { 
       console.error('Error accessing the rear camera: ', error); 
     }); 
};

    const captureImage = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
      
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      
        video.pause();
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
        const dataURL = canvas.toDataURL('image/jpeg');
      
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      
        axios
          .post('https://ivashlok.pythonanywhere.com/process-image', { image: dataURL })
          .then((response) => {
            const timestamp = Date.now();
            const processedImageUrl = `https://ivashlok.pythonanywhere.com/processed-image/processed_image.jpg?t=${timestamp}`;
            setProcessedImageSrc(processedImageUrl);
            processedImageRef.current.style.display = 'block';
            videoRef.current.style.display = 'none';

            captureBtnRef.current.textContent = 'Capture Image';
            captureBtnRef.current.disabled = false;
            updateOutput(response.data.output);
            setIsCameraOpen(false);
            setModel(true);
          })
          .catch((error) => {
            console.error('Error processing the image:', error);
          });
      };
  
    const toggleCapture = () => {
      if (!isCameraOpen) {
        setIsCameraOpen(true);
        captureBtnRef.current.textContent = 'Capture';
        openCamera();
      } else {
        captureBtnRef.current.disabled = true;
        captureBtnRef.current.textContent = 'Processing...';
        captureImage();
      }
    };
  
    return (
<div>
  <p className="moving-text">welcome to I mart!! you are logged in as Cashier</p>
  <section class="pimg2">
      <div class="ptext">
          <span class="textBg">Scroll down to Proceed towards billing</span>
      </div>
  </section>
  <section class="section section-dark" id="sectionp1">
    {/* <button class="icon-button">
      <i class="fa fa-user fa-4x" id='user'></i>
    </button> */}
    <button class="icon-button">
        Admin Access
    </button>
      {/* <p id="p1"><br/>Only Admin can access this portal</p> */}
  </section>
  <section class="pimg3">
      <div class="ptext">
          <span class="textBg">CASHIERLESS COUNTER</span>
      </div>
  </section>
  <section class="section section-dark">
      <h2 class="textBg">WE Ensure Barcode Free scan</h2>
      <p id="p2">Capture all Items in a one go</p>
  </section>
  <section class="pimg1">
      <div class="ptext">
          <span class="textBg">

          </span>
          
      </div>
      </section>
        <div className="center">
          <div id="video-container">
            <video id="video" width="640" height="480" style={{ height: '450px', width: '600px', borderRadius: '10%', boxShadow: '0 0 10px rgba(0.3, 0.3, 0.3, 0.7)', display: 'none' }} ref={videoRef}></video>
            <img id="processed-image" src={processedImageSrc} style={{ height: '450px', width: '600px', borderRadius: '10%', boxShadow: '0 0 10px rgba(0.3, 0.3, 0.3, 0.7)' }}ref={processedImageRef}></img>
          </div>
          <canvas id="canvas" style={{ display: 'none' }} ref={canvasRef}></canvas>
        </div>
        <div className="center">
          <button id="capture-btn" onClick={toggleCapture} ref={captureBtnRef}>Capture Image</button>
        </div>
        <div className='modaldiv'>

        <Modal 
        open={isModal}
        className={`modal ${isModal ? 'fade-in' : 'fade-out'}`}
        closeAfterTransition
       >
      <Results path={processedImageSrc} output={output} closeModel={setModel} processimage={setProcessedImageSrc} />
       
       
       </Modal>
        </div>
    </div>
       
    );
  };
  
  export default CounterComponent;
  