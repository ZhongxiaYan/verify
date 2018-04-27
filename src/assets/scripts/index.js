import '../styles/index.scss';

import './masonry';
import './charts';
import './popover';
import './scrollbar';
import './search';
import './sidebar';
import './skycons';
import './vectorMaps';
import './chat';
import './datatable';
import './datepicker';
import './email';
import './fullcalendar';
import './googleMaps';
import './utils';

// $('.table').on('mouseover', function() {
//     $(this).dataTable().fnAddData( [
//           ".1",
//           ".2",
//           ".3",
//           ".4" ])
// });

// $("#login-button").click(function() {
//     var mapForm = $('<form id="mapform" action="/index.html" method="post"></form>');
//     var data = {
//         'email' : $("#login-email").val(),
//         'type' : $("#login-type").val(),
//     }
//     console.log(data)
//     mapForm.append(mapForm.append('<input type="hidden" name="' + key + '" id="' + key + '" value="' + data[key] + '" />'))
//     for (var key in data) {
//         if (data.hasOwnProperty(key)) {
//             mapForm.append('<input type="hidden" name="' + key + '" id="' + key + '" value="' + data[key] + '" />');
//         }
//     }
//     $('body').append(mapForm);
//     mapForm.submit();
// })
function getJsonFromUrl() {
  var query = location.search.substr(1);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

function countProperties(obj) {
    var count = 0;

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            ++count;
    }

    return count;
}

var global_data = getJsonFromUrl();
console.log(global_data)
$('#topbar-name').text(global_data['user_id']);
$('.changed-link').each(function() {
    var link = $(this).prop('href');
    link = link + '?user_id=' + global_data['user_id']
    $(this).prop('href', link)
})
var apps_table = $("#apps-table").DataTable();
var requests_table = $("#requests-table").DataTable();
var univ_table = $("#institution_table").DataTable();
var verified_table = $("#verified-table").DataTable();
var pending_table = $("#pending-table").DataTable();

var path = window.location.pathname;
if (path.includes("index.html")) {
    $.get('/get/user-data', global_data, function(data) {
        console.log(data)
        $("#app-screen-pending_apps").text(countProperties(data['requested_busi']))
        $("#app-screen-finished_apps").text(countProperties(data['completed_busi']))
        $("#app-screen-pending_requests").text(countProperties(data['pending_univ']))
        $("#app-screen-balance").text(data['balance'])
        var requests = data['pending_univ']
        for (var prop in requests) {
            if(requests.hasOwnProperty(prop)) {
                var request = requests[prop]
                requests_table.row.add([
                    request['request_id'],
                    request['univ_id'],
                    request['description'],
                    request['time']
                ]).draw(false)
            }
        }
        var apps = data['requested_busi']
        for (var prop in apps) {
            if (apps.hasOwnProperty(prop)) {
                var app = apps[prop]

                var id_base = app['request_id']

                var btn_grp = $(`<div class="btn-group mr-2" role="group" aria-label="First group">
                </div>`)
                var select_el = $(`<select class="form-control" id="${id_base + '_value'}"></select>`)
                for (var prop1 in data['received_univ']) {
                    if (data['received_univ'].hasOwnProperty(prop1)) {
                        var request = data['received_univ'][prop1]
                        console.log(request['request_id'])
                        select_el.append($(`<option value="${request['request_id']}">${request['description']}</option>`))                        
                    }
                }
                btn_grp.append(select_el)
                btn_grp.append($(`<button type="submit" class="btn btn-success" id="${id_base + '_submit'}">Submit</button>`))
                btn_grp.append($(`<button type="submit" class="btn cur-p btn-danger" id="${id_base + '_reject'}">Reject</button>`))
                apps_table.row.add([
                    app['request_id'],
                    app['busi_id'],
                    app['description'],
                    app['time'],
                    btn_grp.html()
                ]).draw(false)

                apps_table.on('click', "#" + id_base + '_submit', function() {
                    var id_base = $(this).attr('id').split('_')[0]
                    // 'file' : $('#' + id_base + '_file').prop('file')

                    console.log({
                        'user_id' : id_base.split('-')[0],
                        'univ_id' : global_data['user_id'],
                        'text' : $('#' + id_base + '_text').val(),
                        'accepted' : true
                    })
                    $.post('/post/user-respond-business', {
                        'busi_id' : id_base.split('-')[0],
                        'user_id' : global_data['user_id'],
                        'user_request_id' : $('#' + id_base + '_value').val(),
                        'accepted' : true
                    }, function(data) {
                        // console.log(data)
                        // apps_table.find('#' + data['request_id']).remove();
                    }, 'json');
                    console.log("clicked accept")
                    location.reload()
                })

                apps_table.on('click', "#" + id_base + '_reject', function() {
                    var id_base = $(this).attr('id').split('_')[0]

                    $.post('/post/user-respond-business', {
                        'busi_id' : id_base.split('-')[0],
                        'user_id' : global_data['user_id'],
                        'user_request_id' : $('#' + id_base + '_value').val(),
                        'accepted' : false
                    }, function(data) {
                        // console.log(data)
                        // univ_table.find('#' + data['request_id']).remove();
                    }, 'json');
                    console.log("clicked reject")
                    location.reload()
                })

            }
        }
    }, 'json');
} else if (path.includes("institution.html")) {
    $.get('/get/univ-data', global_data, function(data) {
        console.log(data)
        $("#institution-screen-pending_requests").text(countProperties(data['requested']))
        $("#institution-screen-completed_requests").text(countProperties(data['completed']))
        $("#institution-screen-balance").text(data['balance'])
        var requests = data['requested']
        for (var prop in requests) {
            if(requests.hasOwnProperty(prop)) {
                var request = requests[prop]
                var id_base = request['request_id']

                var btn_grp = $(`<div class="btn-group mr-2" role="group" aria-label="First group">
                    <input type="text" class="form-control" id="${id_base + '_text'}" placeholder="Enter Feedback">
                    <button type="submit" class="btn btn-success" id="${id_base + '_submit'}">Submit</button>
                    <button type="submit" class="btn cur-p btn-danger" id="${id_base + '_reject'}">Reject</button>
                </div>`)
                    // <input type="file" class="form-control" id="${id_base + '_file'}">

                univ_table.row.add([
                    request['request_id'],
                    request['user_id'],
                    request['description'],
                    request['time'],
                    btn_grp.html()
                ]).node().id = id_base
                univ_table.draw(false)

                univ_table.on('click', "#" + id_base + '_submit', function() {
                    var id_base = $(this).attr('id').split('_')[0]
                    // 'file' : $('#' + id_base + '_file').prop('file')

                    console.log({
                        'user_id' : id_base.split('-')[0],
                        'univ_id' : global_data['user_id'],
                        'text' : $('#' + id_base + '_text').val(),
                        'accepted' : true
                    })
                    $.post('/post/university-respond-user', {
                        'user_id' : id_base.split('-')[0],
                        'univ_id' : global_data['user_id'],
                        'text' : $('#' + id_base + '_text').val(),
                        'accepted' : true
                    }, function(data) {
                        // console.log(data)
                        // univ_table.find('#' + data['request_id']).remove();
                    }, 'json');
                    console.log("clicked accept")
                    location.reload()
                })

                univ_table.on('click', "#" + id_base + '_reject', function() {
                    var id_base = $(this).attr('id').split('_')[0]

                    $.post('/post/university-respond-user', {
                        'user_id' : id_base.split('-')[0],
                        'univ_id' : global_data['user_id'],
                        'text' : '',
                        'accepted' : false
                    }, function(data) {
                        // console.log(data)
                        // univ_table.find('#' + data['request_id']).remove();
                    }, 'json');
                    console.log("clicked reject")
                    location.reload()
                })

            }
        }
    }, 'json');
} else if (path.includes("business.html")) {
    $.get('/get/busi-data', global_data, function(data) {
        console.log(data)
        $("#business-num_pending").text(countProperties(data['pending']))
        $("#business-num_received").text(countProperties(data['received']))
        $("#business-balance").text(data['balance'])

        var pendings = data['pending']
        for (var prop in pendings) {
            if (pendings.hasOwnProperty(prop)) {
                var request = pendings[prop]
                pending_table.row.add([
                    request['request_id'],
                    request['user_id'],
                    request['description'],
                    request['time']
                ]).draw(false)
            }
        }
        var verifieds = data['received']
        for (var prop in verifieds) {
            if (verifieds.hasOwnProperty(prop)) {
                var app = verifieds[prop]
                verified_table.row.add([
                    app['request_id'],
                    app['user_id'],
                    app['description'],
                    app['time'],
                    app['verifier_id'],
                    app['text'],
                ]).draw(false)
            }
        }
    }, 'json');
}

$("#request-form-submit").click(function() {
    console.log(JSON.stringify({
        'user_id' : global_data['user_id'],
        'univ_id' : $('#verifierId').val(),
        'description' : $('#verifierDescription').val()
    }))
    $.post('/post/user-query-university', {
        'user_id' : global_data['user_id'],
        'univ_id' : $('#verifierId').val(),
        'description' : $('#verifierDescription').val()
    }, function(data) {
        // console.log(data)
        // requests_table.row.add([
        //     data['request_id'],
        //     data['univ_id'],
        //     data['description'],
        //     data['time']
        // ]).draw(false)
    }, 'json');
    location.reload()
})

$("#business-request-form-submit").click(function() {
    console.log(JSON.stringify({
        'user_id' : global_data['user_id'],
        'univ_id' : $('#verifierId').val(),
        'description' : $('#verifierDescription').val()
    }))
    $.post('/post/business-query-user', {
        'busi_id' : global_data['user_id'],
        'user_id' : $('#applicantId').val(),
        'description' : $('#applicationDescription').val()
    }, function(data) {
        // console.log(data)
        // verified_table.row.add([
        //     data['request_id'],
        //     data['univ_id'],
        //     data['description'],
        //     data['time']
        // ]).draw(false)
    }, 'json');
    location.reload()
})