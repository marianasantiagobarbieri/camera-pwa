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
document.addEventListener('DOMContentLoaded', function () {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const captureBtn = document.getElementById('captureBtn');    
  document.getElementById('btnCarregar').addEventListener('click', carregarDoBanco);


  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
    })
    .catch(function (error) {
      console.error('Erro ao acessar a câmera: ', error);
    });

  captureBtn.addEventListener('click', function () {
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/png');
    saveToIndexedDB(imageData);
  });

  function saveToIndexedDB(imageData) {
    const dbName = 'capturedPhotosDB';
    const dbVersion = 1;
    const storeName = 'capturedPhotos';

    const request = indexedDB.open(dbName, dbVersion);
    console.log("fghfhfhc")

    request.onerror = function (event) {
      console.error('Erro ao abrir o banco de dados: ', event.target.error);
    };

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      const store = db.createObjectStore(storeName, { autoIncrement: true, keyPath: 'id' });
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
  const equipamento = document.getElementById('equipamento').value;
  const laboratorio = document.getElementById('laboratorio').value;
  const instituto = document.getElementById('instituto').value;

      const photoData = { imageData: imageData, timestamp: new Date(), equipamento: equipamento, laboratorio: laboratorio, instituto: instituto};
      console.log(photoData)
      const addRequest = store.add(photoData);

      addRequest.onsuccess = function () {
        console.log('Foto capturada e armazenada no IndexedDB com sucesso!');
      };

      addRequest.onerror = function (error) {
        console.error('Erro ao armazenar a foto no IndexedDB: ', error);
      };
    };
  }

  function carregarDoBanco() {
    const dbName = 'capturedPhotosDB';
    const dbVersion = 1;
    const storeName = 'capturedPhotos';

    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = function (event) {
      console.error('Erro ao abrir o banco de dados: ', event.target.error);
    };

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      const store = db.createObjectStore(storeName, { autoIncrement: true, keyPath: 'id' });
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      
      const getAllRequest = store.getAll();
      getAllRequest.onsuccess = function () {
        let todos = buscar(getAllRequest.result);
       /* listagem(todos);
        console.log(todos)*/
      };

      getAllRequest.onerror = function (error) {
        console.error('Erro ao armazenar a foto no IndexedDB: ', error);
      };
    };
  }
});
 function buscar(inputs){
  
  console.log(inputs)
  if(inputs){
      const divLista = inputs.map(input => {
          return `<div>
          <p>Anotação</p>
          <p>${input.equipamento}</p>
          <p>${input.laboratorio}</p>
          <p>${input.instituto}</p>
          <img src="${input.imageData}"/>
                 </div>`;
      });
      listagem(divLista.join(''));
  }
}

function listagem(text){
  console.log(text);
  document.getElementById('resultados').innerHTML = text;
}
/*
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


cameraTraseira.onclick = async function () {
  pararStreams(cameraView.srcObject);
 modoCamera = (modoCamera == "user") ? "environment": "user";
 constraints = { video: { facingMode:{exact:modoCamera} }, audio: false};
 cameraStart();

}

function pararStreams(stream){
  stream.getTracks().forEach(track => {
      track.stop();
  });
}

window.addEventListener("load", cameraStart, false);*/