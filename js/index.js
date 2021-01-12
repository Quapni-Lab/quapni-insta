
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

const sendPic = async () => {
    var file = inputCapture.files[0];
    var t0 = performance.now()
    const base64Image = await toBase64(file);
    console.log(base64Image)
    document.getElementById('originImage').src = `data:image/jpeg;base64,${base64Image}`;
    axios.post(`https://8dcc32864a32.ngrok.io/swap`, {
        image: base64Image
    })
        .then((response) => {
            var dataObject = response.data;
            // POST success
            const responseImg = dataObject.result.split("'")[1];
            document.getElementById('resultImage').src = `data:image/jpeg;base64,${responseImg}`;
            var t1 = performance.now()
            console.log("Call to doSomething took " + (t1 - t0)/1000 + " seconds.")


        },
            (error) => {
                var message = error.response.data.message;
            }
        );
}

inputCapture.addEventListener('change', sendPic, false);