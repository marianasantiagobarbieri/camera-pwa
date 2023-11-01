if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            let reg;
            reg = await navigator.serviceWorker.register('/sw.js', { type: "module"});

            console.log('Service worker registrada, ou seja subiu a Service Worker!', reg);
        } catch (err) {
            console.log('Service worker registro falhou :(, ñ subiu a Service Worker', err);
        }
    });
}

var modoCamera = "user"

var constraints = { video: { facingMode: {exact: modoCamera} }, audio: false};

const cameraView = document.querySelector('#camera--view'),
 cameraOutput = document.querySelector('#camera--output'),
 cameraSensor = document.querySelector('#camera--sensor'),
 cameraTrigger = document.querySelector('#camera--trigger'),
 cameraTraseira = document.querySelector('#camera--Traseira');


function cameraStart() {
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        let track = stream.getTracks[0];
        cameraView.srcObject = stream;
        
    })
    .catch(function (error) {
        console.error("Ocorreu um erro.", error);
    });
}

cameraTrigger.onclick = function () {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    cameraOutput.src = cameraSensor.toDataURL("image/webp");
    cameraOutput.classList.add("taken");
}


cameraTraseira.onclick = function () {
   modoCamera = "environment";
   constraints = { video: { facingMode:{exact:modoCamera} }, audio: false};

    cameraStart();
    
}

window.addEventListener("load", cameraStart, false);