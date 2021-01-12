
const inputCapture = document.getElementById('inputCapture');

/**
 * File 轉 base64
 * @param {*} file 
 */
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = error => reject(error);
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
    console.log(base64Image)
    // document.getElementById('originImage').src = `data:image/jpeg;base64,${base64Image}`;
    axios.post(`https://5f6c24ba63db.ngrok.io/swap`, {
        image: base64Image
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