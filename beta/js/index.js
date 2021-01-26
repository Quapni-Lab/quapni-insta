async function init() {
  model = await tf.loadLayersModel('./models/model.json');
}

async function submit() {

  const selectedFile = document.getElementById('input').files[0];
  console.log(selectedFile)
  let reader = new FileReader();
  reader.onload = e => {
    // Fill the image & call predict.
    let img = document.createElement('img');
    img.src = e.target.result;
    img.width = 2268;
    img.height = 4032;
    img.onload = () => {
      // const showImage=document.getElementById('showImage');
      // showImage.innerHTML='';
      // showImage.appendChild(img);
      predict(img);
    }
  };
  // Read in the image file as a data URL.
  reader.readAsDataURL(selectedFile);
}


async function predict(imgElement) {
  console.log(imgElement)
  // 將 HTML <img> 轉換成轉換為矩陣 tensor
  const tfImg = tf.browser.fromPixels(imgElement);
  // 強制將圖片縮小到 28*28 像素
  const smalImg = tf.image.resizeBilinear(tfImg, [128, 128]);
  // 將 tensor 設為浮點型態，且將張量攤平至一為矩陣。此時 shape 為 [1,128,128,3]
  let tensor = smalImg.reshape([1, 128, 128, 3]);
  // 將所有數值除以255
  tensor = tensor.div(tf.scalar(255));
  // 預測 
  const pred = model.predict(tensor);
  let pred_mask = pred.arraySync()[0];
  let alpha = 0.3 // Mask 透明度
  let [H, W, C] = smalImg.shape;
  let img = smalImg.arraySync();
  // convert 0 1
  for (let i = 0; i < H; i++) {
    for (let j = 0; j < W; j++) {
      if (pred_mask[i][j] > 0.5)
        pred_mask[i][j] = 1;
      else
        pred_mask[i][j] = 0;
    }
  }
  for (let i = 0; i < H; i++)
    for (let j = 0; j < W; j++)
      if (pred_mask[i][j] >= 0.01) {
        img[i][j][2] = (1 - alpha) * img[i][j][2] + alpha * 255
      }
  // function flattenDeep(arr1) {
  //   return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
  // }
  // img=flattenDeep(smalImg.arraySync());
  // let base64String = btoa(String.fromCharCode(...new Uint8Array(img)));
  // document.getElementById('showImage').src=`data:image/jpeg;base64,${base64String}`;
  // console.log(base64String)
  const canvas = document.createElement('canvas');
  let mypred=pred.reshape([128, 128, 1])
  canvas.width = mypred.shape.width
  canvas.height = mypred.shape.height
  await tf.browser.toPixels(mypred, canvas);
  // document.body.innerHTML+=canvas;
  document.body.appendChild(canvas);
}