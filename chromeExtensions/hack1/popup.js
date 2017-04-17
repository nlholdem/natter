
// the following two functions are equivalent
async function getNutch(url) {

    try {
        const response = await fetch(url, {
            method: 'post',
            headers: new Headers({
                'Accept': 'application/json, text/plain, */*',
                "Content-Type": "application/json; charset=UTF-8"
            }),
            body: '{"name": "nutch","seedUrls":[{"seedList": null,"url": "http://nutch1.apache.org/"}]}'
        });
        console.log(await response.text());
    } catch (err) {
        console.log('fetch failed: ', err);
    }
}

function getNutchPromises(url) {
    return fetch(url, {
        method: 'post',
        headers: new Headers({
            'Accept': 'application/json, text/plain, */*',
            "Content-Type": "application/json; charset=UTF-8"
        }),
        body: '{"name": "nutch","seedUrls":[{"seedList": null,"url": "http://nutch1.apache.org/"}]}'
    })
            .then(response => response.text())
            .then(text => {
                console.log(text);
            })
            .catch(err => {
                console.error('fetch failed: ', err);
            });
}


document.addEventListener('DOMContentLoaded', function () {
    var checkPageButton = document.getElementById('checkPage');
    checkPageButton.addEventListener('click', function () {
        
        getNutch('http://localhost:8081/seed/create')
                .then(function(response) {
                    console.log('success!!');
                    document.getElementById("post").innerHTML = "responsePost: " + response.text();

        },
        function(error){
            ;
        });


    });
}, false);
