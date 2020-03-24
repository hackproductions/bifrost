// Select your input type file and store it in a variable
let input
let tokenData

document.addEventListener('DOMContentLoaded', () => {
    getEndpoint()

    // Add a listener on your input
    // It will be triggered when a file will be selected
    input = document.getElementById('file-chooser')

    input.addEventListener('change', () => {
        document.getElementById("file-label").firstChild.data = input.files[0].name
        upload(input.files[0])
    } , false)
})

function getEndpoint() {
    var search = location.search.substring(1);

    try {
        var object = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) })
    } catch (e) {
        showError("No upload token detected. Make sure you use the exact link sent by the bot!")
        return
    }

    fetch('https://5vpsgz45ig.execute-api.eu-west-1.amazonaws.com/prod/upload?token=' + object['token'], { // Your POST endpoint
        method: 'GET',
        headers: {
            // Content-Type may need to be completely **omitted**
            // or you may need something
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        tokenData = data
    })
    .catch(error => {
        showError("Invalid upload token. Make sure you use the exact link sent by the bot!")
        return
    });
}

// This will upload the file after having read it
function upload(file) {
    if (tokenData === null) {
        showError("Invalid upload token. Make sure you use the exact link sent by the bot!")
    } else {
        const formData = new FormData();
        Object.entries(tokenData['fields']).forEach(([k, v]) => {
            formData.append(k, v);
        });
        formData.append("file", file);

        showProgress()

        fetch(tokenData.url, { // Your POST endpoint
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                showSuccess("File successfully uploaded!")
            } else {
                throw new Error(`HTTP Error ${response.status}`)
            }
        })
        .catch(error => {
            console.error(error)
            showError(`The following error occured while trying to upload your file: ${error.message}`)
        });
    }
}

function showSuccess(message) {
  $("#message-title").text("Success")
  $("#message").text(message)
  $("#event-modal").modal("show")
}

function showProgress() {
  $("#message-title").text("Upload in progress...")
  $("#message").text("Please do not close this page. When the upload is complete, a success message will be shown.")
  $("#event-modal").modal("show")
}

function showError(message) {
  $("#message-title").text("Error")
  $("#message").text(message)
  $("#event-modal").modal("show")
}
