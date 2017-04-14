// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Search the bookmarks when entering the search keyword.

var bgPage = chrome.extension.getBackgroundPage();
 

function myLog(message) {
    console.log(message);
    bgPage.log(message);
}


function UserAction() {
    document.getElementById("demo").innerHTML = "demo";

    /*
     var xhttp = new XMLHttpRequest();
     xhttp.open("GET", "http://localhost:8081/admin", false);
     xhttp.setRequestHeader("Content-type", "application/json");
     xhttp.send();
     var response = JSON.parse(xhttp.responseText);
     */
}

$(function () {

    /*
     fetch(url, {  
     method: 'post',  
     headers: {  
     "Content-type": "application/json; charset=UTF-8"  
     },  
     body: '{"name": "nutch","seedUrls":[{"seedList": null,"url": "http://nutch.apache.org/"}]}'  
     })
     .then(json)  
     .then(function (data) {  
     console.log('Request succeeded with JSON response', data);  
     document.getElementById("post").innerHTML = "responsePost: " + data;
     })  
     .catch(function (error) {  
     console.log('Request failed', error);  
     });
     */
    var url = 'http://localhost:8081/admin';

    $('#search').change(function () {
        $('#bookmarks').empty();
        dumpBookmarks($('#search').val());

//Handle GET request

        fetch('http://localhost:8081/admin')
                .then(
                        function (response) {
                            if (response.status !== 200) {
                                console.log('Looks like there was a problem. Status Code: ' +
                                        response.status);
                                return;
                            }

                            // Examine the text in the response  
                            response.json().then(function (data) {
//                                console.log(data);
                                console.log("The GET request succeeded, so it did!");
//				chrome.extension.getBackgroundPage().console.log("hi");
                                document.getElementById("get").innerHTML = "responseGet: " + data.configuration;

                            });
                        }
                )
                .catch(function (err) {
                    console.log('Fetch Error :-S', err);
                });

//		alert("success");

        var url = 'http://localhost:8081/seed/create';

        //Handle POST request

        fetch('http://localhost:8081/seed/create', {
            method: 'post',
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8"
            }),
            body: '{"name": "nutch","seedUrls":[{"seedList": null,"url": "http://nutch1.apache.org/"}]}'
        })
                .then(JSON)
/*                .catch(function (error) {
                    console.log('non-JSON response detected', error);
                });*/
                .then(function (data) {
                    console.log('POST Request succeeded with JSON response');
                    console.log(JSON.parse(data));
                    console.log(data);
                    document.getElementById("post").innerHTML = "responsePost: " + "success!! ";// + data;
//		myLog("success");
                })
                .catch(function (error) {
                    console.log('Request failed', error);
                });

    });



    /*
     
     
     $('#search').change(function() {
     $('#bookmarks').empty();
     dumpBookmarks($('#search').val());
     
     var xhttp = new XMLHttpRequest();
     xhttp.open("GET", "http://localhost:8081/admin", false);
     xhttp.setRequestHeader("Content-type", "application/json");
     xhttp.send();
     var response = JSON.parse(xhttp.responseText);
     document.getElementById("get").innerHTML = "responseGet: " + response.configuration;
     
     var payloadStr = '{"name": "nutch","seedUrls":[{"seedList": null,"url": "http://nutch.apache.org/"}]}';
     
     var payloadObj = JSON.parse(payloadStr);
     
     xhttp.open("POST", "http://localhost:8081/seed/create", false);
     
     xhttp.setRequestHeader("Content-type", "application/json");
     xhttp.send(payloadStr);
     var response1 = xhttp.responseText;
     document.getElementById("post").innerHTML = "responsePost: " + response1;
     
     
     });
     
     */
});
// Traverse the bookmark tree, and print the folder and nodes.
function dumpBookmarks(query) {
    var bookmarkTreeNodes = chrome.bookmarks.getTree(
            function (bookmarkTreeNodes) {
                $('#bookmarks').append(dumpTreeNodes(bookmarkTreeNodes, query));
            });
}
function dumpTreeNodes(bookmarkNodes, query) {
    var list = $('<ul>');
    var i;
    for (i = 0; i < bookmarkNodes.length; i++) {
        list.append(dumpNode(bookmarkNodes[i], query));
    }
    return list;
}
function dumpNode(bookmarkNode, query) {
    if (bookmarkNode.title) {
        if (query && !bookmarkNode.children) {
            if (String(bookmarkNode.title).indexOf(query) == -1) {
                return $('<span></span>');
            }
        }
        var anchor = $('<a>');
        anchor.attr('href', bookmarkNode.url);
        anchor.text(bookmarkNode.title);
        /*
         * When clicking on a bookmark in the extension, a new tab is fired with
         * the bookmark url.
         */
        anchor.click(function () {
            chrome.tabs.create({url: bookmarkNode.url});
        });
        var span = $('<span>');
        var options = bookmarkNode.children ?
                $('<span>[<a href="#" id="addlink">Add</a>]</span>') :
                $('<span>[<a id="editlink" href="#">Edit</a> <a id="deletelink" ' +
                        'href="#">Delete</a>]</span>');
        var edit = bookmarkNode.children ? $('<table><tr><td>Name</td><td>' +
                '<input id="title"></td></tr><tr><td>URL</td><td><input id="url">' +
                '</td></tr></table>') : $('<input>');
        // Show add and edit links when hover over.
        span.hover(function () {
            span.append(options);
            $('#deletelink').click(function () {
                $('#deletedialog').empty().dialog({
                    autoOpen: false,
                    title: 'Confirm Deletion',
                    resizable: false,
                    height: 140,
                    modal: true,
                    overlay: {
                        backgroundColor: '#000',
                        opacity: 0.5
                    },
                    buttons: {
                        'Yes, Delete It!': function () {
                            chrome.bookmarks.remove(String(bookmarkNode.id));
                            span.parent().remove();
                            $(this).dialog('destroy');
                        },
                        Cancel: function () {
                            $(this).dialog('destroy');
                        }
                    }
                }).dialog('open');
            });
            $('#addlink').click(function () {
                $('#adddialog').empty().append(edit).dialog({autoOpen: false,
                    closeOnEscape: true, title: 'Add New Bookmark', modal: true,
                    buttons: {
                        'Add': function () {
                            chrome.bookmarks.create({parentId: bookmarkNode.id,
                                title: $('#title').val(), url: $('#url').val()});
                            $('#bookmarks').empty();
                            $(this).dialog('destroy');
                            window.dumpBookmarks();
                        },
                        'Cancel': function () {
                            $(this).dialog('destroy');
                        }
                    }}).dialog('open');
            });
            $('#editlink').click(function () {
                edit.val(anchor.text());
                $('#editdialog').empty().append(edit).dialog({autoOpen: false,
                    closeOnEscape: true, title: 'Edit Title', modal: true,
                    show: 'slide', buttons: {
                        'Save': function () {
                            chrome.bookmarks.update(String(bookmarkNode.id), {
                                title: edit.val()
                            });
                            anchor.text(edit.val());
                            options.show();
                            $(this).dialog('destroy');
                        },
                        'Cancel': function () {
                            $(this).dialog('destroy');
                        }
                    }}).dialog('open');
            });
            options.fadeIn();
        },
                // unhover
                        function () {
                            options.remove();
                        }).append(anchor);
            }
    var li = $(bookmarkNode.title ? '<li>' : '<div>').append(span);
    if (bookmarkNode.children && bookmarkNode.children.length > 0) {
        li.append(dumpTreeNodes(bookmarkNode.children, query));
    }
    return li;
}

document.addEventListener('DOMContentLoaded', function () {
    dumpBookmarks();
});
