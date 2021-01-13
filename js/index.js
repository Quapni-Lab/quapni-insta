
const inputCapture = document.getElementById('inputCapture');
let compressRatio = 0.8, // 圖片壓縮比例
    imgNewWidth = 1080, // 圖片新寬度
    canvas = document.createElement("canvas"),
    context = canvas.getContext("2d");
/**
 * File 轉 base64
 * @param {*} file 
 */
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});
/**
 * 取得圖片大小
 * @param {*} file 
 */
const getSize = (file) => new Promise((resolve, reject) => {
    var _URL = window.URL || window.webkitURL;
    var img = new Image();

    img.onload = () => resolve({ height: img.height, width: img.width });
    img.onerror = reject;

    img.src = _URL.createObjectURL(file);
    imgDom = img;
});
/**
 * 壓縮圖片並回傳壓縮後的base64與size
 * @param {*} file 
 * @param {*} sizeImage 
 * @param {*} imageUrl 
 */
const getCompressImage = (file, sizeImage, imageUrl) => new Promise((resolve, reject) => {
    var width = sizeImage.width, // 圖片原始寬度
        height = sizeImage.height, // 圖片原始高度
        imgNewHeight = imgNewWidth * height / width, // 圖片新高度
        html = "",
        newImg;

    console.log("檔案大小約 " + Math.round(file.size / 1000));

    // 使用 canvas 調整圖片寬高
    canvas.width = imgNewWidth;
    canvas.height = imgNewHeight;
    context.clearRect(0, 0, imgNewWidth, imgNewHeight);

    // 調整圖片尺寸
    context.drawImage(imgDom, 0, 0, imgNewWidth, imgNewHeight);

    // 顯示新圖片
    newImg = canvas.toDataURL("image/jpeg", compressRatio).split(",")[1];
    console.log("檔案大小約 " + Math.round(0.75 * newImg.length / 1000));
    resolve({ width, height, newImg, imgNewHeight, imgNewWidth });
});


function capture() {
    inputCapture.click();
}

function getPost(responseImg){
    let html=`
            <div class="post__header">
                <div class="post-header">
                    <div class="post-header-user">
                        <div><img src="https://i.imgur.com/B9bO1XF.jpg" class="post-header-user__image"></div>
                        <div>
                            <p class="post-header-user__name">QUAPNI Outdoor</p>
                            <p class="post-header-user__location">Taichung, TW</p>
                        </div>
                    </div>
                    <div class="post-header-settings"><svg width="24px" height="24px" viewBox="0 0 512 512"
                            class="svg svg--settings">
                            <use xlink:href="#ellipsis-v"></use>
                        </svg></div>
                </div>
            </div>
            <div class="post__image"><img src="data:image/jpeg;base64,${responseImg}">
            </div>
            <div class="post__content">
                <div class="post__interactions"><svg viewBox="0 0 512 512" class="svg svg--heart">
                        <use xlink:href="#heart"></use>
                    </svg> <svg viewBox="0 0 576 512" class="svg svg--comment">
                        <use xlink:href="#comment"></use>
                    </svg> <svg viewBox="0 0 512 512" class="svg svg--share">
                        <use xlink:href="#paper-plane"></use>
                    </svg> <svg viewBox="0 0 512 512" class="svg svg--save">
                        <use xlink:href="#download"></use>
                    </svg></div>
                <div class="post__likes">
                    <p>4300 likes</p>
                </div>
                <div class="post__name">Name 1</div>
                <div class="post__status">Example Status</div>
                <div class="post__comments">
                    <p><span class="post-comment__name">Name</span>
                        Comment
                    </p>
                </div>
                <div class="post__time">2 Days Ago</div>
            </div>`

            return html
}

const sendPic = async () => {
    var file = inputCapture.files[0];
    var t0 = performance.now()
    const base64Image = await toBase64(file);
    const sizeImage = await getSize(file);
    const base64ImageCompress = await getCompressImage(file, sizeImage, base64Image);
    console.log(base64ImageCompress)
    document.getElementById('originImage').src = `data:image/jpeg;base64,${base64ImageCompress.newImg}`;
    axios.post(`https://0bbbd82accf9.ngrok.io/predict`, {
        image: base64ImageCompress.newImg
        // image: base64Image.split(',')[1]
    })
        .then((response) => {
            var dataObject = response.data;
            // POST success
            const responseImg = dataObject.result.split("'")[1];
            // document.getElementById('resultImage').src = `data:image/jpeg;base64,${responseImg}`;
            var t1 = performance.now()
            console.log("Call to doSomething took " + (t1 - t0) / 1000 + " seconds.")

            // Render Result
            let html = getPost(responseImg)
            const postList = document.getElementById('postContainer');
            let postDom = document.createElement('div');
            postDom.className = ('post');
            postDom.innerHTML = html;
            postList.insertBefore(postDom, postList.childNodes[0]);


        },
            (error) => {
                var message = error.response.data.message;
            }
        );
}

inputCapture.addEventListener('change', sendPic, false);