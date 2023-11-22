// import React, { useState} from "react";
// import {useNavigate} from "react-router-dom";
// import axios from "axios";

// export default function ML_model(){
//     const [respred,setrespred] = useState('');
//     const navigate = useNavigate();
//     const model_predict = () => {
//         axios.post('http://127.0.0.1:5000/app.py' ,{
//             respred: respred
//         })
//         .then(function (response) {
//             console.log(response);       
//             navigate("/")
//         })
//     }
//     return ( 
//     <div>
//         <h3> Result</h3>
//         <form>
//             <div> <input type="respred" value={respred} onChange={(e) => setrespred(e.target.value)}/></div>
//             <div>
//                 <button type="button" onClick={model_predict}>Predict</button>
//             </div>
//         </form>
//     </div>
//     );
// }
import React, { useEffect,useState } from 'react';
import './ML_model_css.css';

const App = () => {
  const [imageSrc, setImageSrc] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [fileDragClass, setFileDragClass] = useState('upload-box');

  const fileDragHover = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setFileDragClass(e.type === 'dragover' ? 'upload-box dragover' : 'upload-box');
  };

  const fileSelectHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.target.files || e.dataTransfer.files;
    fileDragHover(e);

    for (let i = 0, f; (f = files[i]); i++) {
      previewFile(f);
    }
  };

  const submitImage = () => {
    if (!imageSrc || !imageSrc.startsWith('data')) {
      window.alert('Please select an image before submit.');
      return;
    }

    setLoading(true);

    // call the predict function of the backend
    predictImage(imageSrc);
  };

  const clearImage = () => {
    // reset selected files
    // other clear logic...

    setImageSrc('');
    setResult('');
    setLoading(false);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImageSrc(URL.createObjectURL(file));
      setLoading(false);
    };
  };

  const predictImage = (image) => {
    // replace with your backend API endpoint
    fetch('/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image }),
    })
      .then((resp) => {
        if (resp.ok) resp.json().then((data) => displayResult(data));
      })
      .catch((err) => {
        console.log('An error occurred', err.message);
        window.alert('Oops! Something went wrong.');
      });
  };

  const displayResult = (data) => {
    setLoading(false);
    setResult(data.result);
  };

  
// const JS_component =() => {
//   useEffect(() => {
//     //========================================================================
//     // Drag and drop image handling
//     //========================================================================

//     var fileDrag = document.getElementById("file-drag");
//     var fileSelect = document.getElementById("file-upload");

//     // Add event listeners
//     fileDrag.addEventListener("dragover", fileDragHover, false);
//     fileDrag.addEventListener("dragleave", fileDragHover, false);
//     fileDrag.addEventListener("drop", fileSelectHandler, false);
//     fileSelect.addEventListener("change", fileSelectHandler, false);

//     function fileDragHover(e) {
//       // prevent default behaviour
//       e.preventDefault();
//       e.stopPropagation();

//       fileDrag.className = e.type === "dragover" ? "upload-box dragover" : "upload-box";
//     }

//     function fileSelectHandler(e) {
//       // handle file selecting
//       var files = e.target.files || e.dataTransfer.files;
//       fileDragHover(e);
//       for (var i = 0, f; (f = files[i]); i++) {
//         previewFile(f);
//       }
//     }

//     //========================================================================
//     // Web page elements for functions to use
//     //========================================================================

//     var imagePreview = document.getElementById("image-preview");
//     var imageDisplay = document.getElementById("image-display");
//     var uploadCaption = document.getElementById("upload-caption");
//     var predResult = document.getElementById("pred-result");
//     var loader = document.getElementById("loader");

//     //========================================================================
//     // Main button events
//     //========================================================================

//     function submitImage() {
//       // action for the submit button
//       console.log("submit");

//       if (!imageDisplay.src || !imageDisplay.src.startsWith("data")) {
//         window.alert("Please select an image before submit.");
//         return;
//       }

//       loader.classList.remove("hidden");
//       imageDisplay.classList.add("loading");

//       // call the predict function of the backend
//       predictImage(imageDisplay.src);
//     }

//     function clearImage() {
//       // reset selected files
//       fileSelect.value = "";

//       // remove image sources and hide them
//       imagePreview.src = "";
//       imageDisplay.src = "";
//       predResult.innerHTML = "";

//       hide(imagePreview);
//       hide(imageDisplay);
//       hide(loader);
//       hide(predResult);
//       show(uploadCaption);

//       imageDisplay.classList.remove("loading");
//     }

//     function previewFile(file) {
//       // show the preview of the image
//       console.log(file.name);
//       var fileName = encodeURI(file.name);

//       var reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onloadend = () => {
//         imagePreview.src = URL.createObjectURL(file);

//         show(imagePreview);
//         hide(uploadCaption);

//         // reset
//         predResult.innerHTML = "";
//         imageDisplay.classList.remove("loading");

//         displayImage(reader.result, "image-display");
//       };
//     }

//     //========================================================================
//     // Helper functions
//     //========================================================================

//     function predictImage(image) {
//       fetch("/predict", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(image)
//       })
//         .then(resp => {
//           if (resp.ok)
//             resp.json().then(data => {
//               displayResult(data);
//             });
//         })
//         .catch(err => {
//           console.log("An error occured", err.message);
//           window.alert("Oops! Something went wrong.");
//         });
//     }

//     function displayImage(image, id) {
//       // display image on given id <img> element
//       let display = document.getElementById(id);
//       display.src = image;
//       show(display);
//     }

//     function displayResult(data) {
//       // display the result
//       // imageDisplay.classList.remove("loading");
//       hide(loader);
//       predResult.innerHTML = data.result;
//       show(predResult);
//     }

//     function hide(el) {
//       // hide an element
//       el.classList.add("hidden");
//     }

//     function show(el) {
//       // show an element
//       el.classList.remove("hidden");
//     }
//   },[]);

return (
  <div className="main">
    <div className="title">
      <h3>Diabetic Retinopathy Detection</h3>
      {/* <p>
        <small>A web app demo</small>
      </p> */}
    </div>

    <div className="panel">
      <input
        id="file-upload"
        className="hidden"
        type="file"
        accept="image/x-png,image/gif,image/jpeg"
        onChange={(e) => fileSelectHandler(e)}
      />
      <label htmlFor="file-upload" id="file-drag" className={fileDragClass}>
        <div id="upload-caption">Drop image here or click to select</div>
        <img id="image-preview" className={imageSrc ? '' : 'hidden'} src={imageSrc} alt="Preview" />
      </label>
    </div>

    <div style={{ marginBottom: '2rem' }}>
      <input type="button" value="Submit" className="button" onClick={submitImage} />
      <input type="button" value="Clear" className="button" onClick={clearImage} />
    </div>

    <div id="image-box">
      <img id="image-display" src={imageSrc} alt="Display" />
      <div id="pred-result" className={result ? '' : 'hidden'}>{result}</div>
      <svg id="loader" className={loading ? '' : 'hidden'} viewBox="0 0 32 32" width="32" height="32">
        <circle id="spinner" cx="16" cy="16" r="14" fill="none"></circle>
      </svg>
    </div>
  </div>


//   <div class="main">
//   <div class="title">
//     <h3>Diabetic Retinopathy Detection</h3>
    
//   </div>

//   <div class="panel">
//     <input id="file-upload" class="hidden" type="file" accept="image/x-png,image/gif,image/jpeg" />
//     <label for="file-upload" id="file-drag" class="upload-box">
//       <div id="upload-caption">Drop image here or click to select</div>
//       <img id="image-preview" class="hidden" />
//     </label>
//   </div>

//   <div style={{ marginBottom: '2rem' }}>
//   {/* <div style="margin-bottom: 2rem;"> */}
//     <input type="button" value="Submit" class="button" onclick={submitImage()} />
//     <input type="button" value="Clear" class="button" onclick={clearImage()} />
//   </div>

//   <div id="image-box">
//     <img id="image-display" />
//     <div id="pred-result" class="hidden"></div>
//     <svg id="loader" class="hidden" viewBox="0 0 32 32" width="32" height="32">
//       <circle id="spinner" cx="16" cy="16" r="14" fill="none"></circle>
//     </svg>
//   </div>
// </div>
);
};

export default App;
// export default JS_component;



