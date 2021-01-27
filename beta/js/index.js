async function init() {
  model = await tf.loadLayersModel('/beta/models/model.json');
  document.getElementById('statusText').innerText='load done!';
  console.log('load done.');
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
  // console.log(imgElement)
  // 將 HTML <img> 轉換成轉換為矩陣 tensor
  const tfImg = tf.browser.fromPixels(imgElement);
  // 強制將圖片縮小到 128*128 像素
  const smalImg = tf.image.resizeNearestNeighbor(tfImg, [128, 128]);
  // 將 tensor 設為浮點型態，且將張量攤平至一為矩陣。此時 shape 為 [1,128,128,3]
  let tensor = smalImg.reshape([1, 128, 128, 3]);
  // 將所有數值除以255
  tensor = tensor.div(tf.scalar(255));
  // 預測 
  start = new Date().getTime();
  const pred = model.predict(tensor);
  
  let pred_mask = pred.arraySync()[0];
  let alpha = 0.3 // Mask 透明度
  let [H, W, C] = tfImg.shape;
  W=Math.floor(W/5)
  H=Math.floor(H/5)
  // convert 0 1
  for (let i = 0; i < 128; i++) {
    for (let j = 0; j < 128; j++) {
      if (pred_mask[i][j] > 0.5)
        pred_mask[i][j] = 1;
      else
        pred_mask[i][j] = 0;
    }
  }
  
  pred_mask= tf.tensor(pred_mask)
  pred_mask= pred_mask.reshape([128, 128, 1]);
  pred_mask = tf.image.resizeBilinear(pred_mask, [H, W]);
  pred_mask=pred_mask.arraySync();
  origin_img_resize = tf.image.resizeBilinear(tfImg, [H, W]);
  let img = origin_img_resize.arraySync();
  for (let i = 0; i < H; i++)
    for (let j = 0; j < W; j++)
      if (pred_mask[i][j] >= 0.01) {
        img[i][j][0] = (1 - alpha) * img[i][j][0] + alpha * 255
      }

  // origin image with mask
  let tfResult = tf.tensor(img);
  tfResult = tf.cast(tfResult, 'int32');
  const canvas = document.createElement('canvas');
  canvas.width = 100
  canvas.height = 100
  
  await tf.browser.toPixels(tfResult, canvas);
  document.body.appendChild(canvas);

  end = new Date().getTime();
  console.log((end - start) / 1000 + "sec");

  // function flattenDeep(arr1) {
  //   return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
  // }
  // img=flattenDeep(smalImg.arraySync());
  // let base64String = btoa(String.fromCharCode(...new Uint8Array(img)));
  // document.getElementById('showImage').src=`data:image/jpeg;base64,${base64String}`;
  // console.log(base64String)

  // Show predict mask
  // const canvas = document.createElement('canvas');
  // let mypred=pred.reshape([128, 128, 1])
  // canvas.width = mypred.shape.width
  // canvas.height = mypred.shape.height
  // await tf.browser.toPixels(mypred, canvas);
  // document.body.appendChild(canvas);
}


/**
 * convert prediction tensor to an image from stackoverflow
 * https://stackoverflow.com/questions/64483632/convert-prediction-tensor-to-an-image
 */