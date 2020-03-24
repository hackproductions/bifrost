// Select your input type file and store it in a variable
const input = document.getElementById('file-chooser');

// This will upload the file after having read it
const upload = (file) => {
    var search = location.search.substring(1);
    var object = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) })

    fetch('https://5vpsgz45ig.execute-api.eu-west-1.amazonaws.com/prod/upload?token=' + object['token'], { // Your POST endpoint
    method: 'GET',
    headers: {
      // Content-Type may need to be completely **omitted**
      // or you may need something
      "Content-Type": "application/json"
    }
  }).then(
    response => response.json() // if the response is a JSON object
  ).then(
    success => {
        console.log(success);
        document.getElementById("results").value = success + "<br />";

        const formData = new FormData();
        Object.entries(success['fields']).forEach(([k, v]) => {
            formData.append(k, v);
        });
        formData.append("file", file);

        fetch(success.url, { // Your POST endpoint
          method: 'POST',
          body: formData // This is your file object
        }).then(
          success => {
              console.log(success)
              document.getElementById("results").value = success + "<br />";
          }
        ).catch(
          error => {
              console.log(error)
              document.getElementById("results") += error + "<br />";
          }
        );
    }
  ).catch(
    error => console.log(error) // Handle the error response object
  );
};

// Event handler executed when a file is selected
const onSelectFile = () => {
    document.getElementById("file-label").firstChild.data = input.files[0].name;
    upload(input.files[0]);
};

// Add a listener on your input
// It will be triggered when a file will be selected
input.addEventListener('change', onSelectFile, false);
