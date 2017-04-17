
payloadEnums = {
    SEED : 0,
    JOB: 1
    
    
};

var seedDir = "/tmp/1492466045424-0";

function getPayload(x){
    switch(x) {
        case payloadEnums.SEED:
            var payLoad = '{"name": "nutch","seedUrls":[{"seedList": null,"url": "http://nutch1.apache.org/"}]}';
            break;
        case payloadEnums.JOB: 
            var payLoad = '{"args": {"seedDir": "' + seedDir + '"},"confId": "default","crawlId": "sample-crawl-01","type": "INJECT"}';
            break;
        default:
            var payLoad = '';
            break;
       
            
    }
    return payLoad;
}


// the following two functions are equivalent
async function getNutch(url) {

var response;
// run the queries in series, because we want each to finish before the next one starts
   try {
        response = await fetch(url+"seed/create", {
            method: 'post',
            headers: new Headers({
                'Accept': 'application/json, text/plain, */*',
                "Content-Type": "application/json; charset=UTF-8"
            }),
            body: getPayload(payloadEnums.SEED)
        });
        var hack = await response.text();
        console.log(hack);
//        seedDir = hack;
    } catch (err) {
        console.log('fetch failed: ', err);
    }

   try {
        response = await fetch(url+"job/create", {
            method: 'post',
            headers: new Headers({
                'Accept': 'application/json, text/plain, */*',
                "Content-Type": "application/json; charset=UTF-8"
            }),
            body: getPayload(payloadEnums.JOB)
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
        
        getNutch("http://localhost:8081/");

    });
}, false);