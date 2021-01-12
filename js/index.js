
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

    const base64Image = await toBase64(file);
    console.log(base64Image)

    axios.post(`http://127.0.0.1:5000/swap`, {
        image: base64Image
    })
        .then((response) => {
            var dataObject = response.data;
            // POST success
            const responseImg = dataObject.result.split("'")[1];
            // document.getElementById('image').src = `data:image/jpeg;base64,${responseImg}`;

        },
            (error) => {
                var message = error.response.data.message;
            }
        );
}

inputCapture.addEventListener('change', sendPic, false);