function formatDate(uglyDate){
    var monthShort = ["Jan", "Feb", "Mar","Apr","May", "Jun", "Jul", "Aug","Sep","Oct","Nov","Dec"];
    const date = new Date(uglyDate);
    return monthShort[date.getMonth()]+ " " +  date.getDate() + ", " + date.getFullYear()
}
/*function formatTime(uglyTime) {
    const time = new Date(uglyTime);
    return time.getHours() + ":" + time.getMinutes()
} */

// function forgotPage(){
//     $('.pwd').click(function(){
//         $('#requestpwdPage').show();
//         $('#loginPage').hide();
//     });
// }
// forgotPage();

function registerPage(){
    $('.reg').click(function(){
        $('#registerPage').show();
        $('#loginPage').hide();
    });
}
registerPage();

function loginPage(){
    $('.lgnin').click(function(event){
        $('#registerPage').hide();
        $('#requestpwdPage').hide();
        $('#loginPage').show();
    });
}
loginPage(); 

function createSchedule() {
    $('.calendarIcon').click(function(){
       $('#addTravelPage').show();
       $('#scheduleInfo').hide();
    });
}
createSchedule();

// function createEvent() {
//     $('.eventIcon').click(function(){
//         $('#scheduleInfo').hide();
//         $('#createEventPage').show();
//     });
// }
// createEvent();

function verifyUser() {
    $('#sigbtn').click(function(event){
        event.preventDefault();
        const data ={
            userName: $('.username-login').val(),
            password: $('.password').val(),
        }
        fetch('/person/login', {
            headers: {
                'Content-Type': 'application/json',
            },
            method:'POST',
            body: JSON.stringify(data),
        })
        .then(function(response){
            return response.json();
        })
        .then(function(myJson){
            if (myJson.error) {
                alert(myJson.message);
                return
            }
            console.log(myJson.token);
            $('#loginPage').hide();
            localStorage.setItem('token', myJson.token);
            getSchedules();
            $('#scheduleInfo').show();
        })
        .catch(error => console.error(error));
    })
}
verifyUser();

//creates new user
function addUser() {
    $('#regbtn').click(function(event){
        event.preventDefault();
        const data = {
            firstName: $('.firstname').val(),
            lastName: $('.lastname').val(),
            userName: $('.regUsername').val(),
            password: $('.regPassword').val(),
            email: $('.email').val(),
            gender: $('input[name=gender]:checked').val(),
            status: $('input[name=status]:checked').val()
       }
        fetch('/person/new', {
            headers: {
                'Content-Type': 'application/json',
            },
            method:'POST',
            body: JSON.stringify(data),
        })
        .then(function(response){
            return response.json();
        })
        .then(function(myJson){
            if(myJson.error) {
                alert(myJson.message);
                return
            }
            $('#registerPage').hide();
            $('#loginPage').show();
            console.log(myJson);
        })
        .catch(error => console.error(error));
    })
}
addUser();

//adds schedule
function addTravel() {
    $('#travelbtn').click(function(event){
        event.preventDefault();
        $('#addTravelPage').hide();
        $('#scheduleInfo').show();
        const data = {
            location: $('.locationInput').val(),
            event: $('.eventInput').val(),
            startDate: $('.startDate').val(),
            startTime:$('.startTime').val(),
            endDate: $('.endDate').val(),
            endTime: $('.endTime').val()
       }
        fetch('/schedule/new/' + localStorage.getItem('token'), {
            headers: {
                'Content-Type': 'application/json',
            },
            method:'POST',
            body: JSON.stringify(data),
        })
        .then(function(response){
            return response.json();
        })
        .then(function(myJson){
            if(myJson.error) {
                alert(myJson.message);
                return
            }
            getSchedules();
            console.log(myJson);
        })
        .catch(error => console.error(error));
    })
}
addTravel();

function getSchedules() {
    console.log('get schedule');
    fetch('/schedule/all/'+ localStorage.getItem('token'), {
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'GET',
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson){
            if(myJson.error) {
                alert(myJson.message);
                return
            }
            console.log(myJson);
            $('.schList').empty();
            for(let i =0; i<myJson.length;i++) {
                let startDate = formatDate(myJson[i].startDate);
                let endDate = formatDate(myJson[i].endDate);
                $('.schList').append(`<details class="schitem">
                <summary class="sch summary">${startDate} - ${endDate}</summary>
                <input type="image" src="images/deleteIcon.png" class="deleteIcon" value="${myJson[i]._id}" alt="deleteIcon"/>
                <p class="sch event">Reason for Travel: ${myJson[i].event}</p>
                <p class="sch location">Location: ${myJson[i].location}</p>
                <p class="sch stDate">Start Date: ${startDate} </p> 
                <p class="sch stTime">Start Time: ${myJson[i].startTime}</p>
                <p class="sch edDate">End Date: ${endDate}</p> 
                <p class="sch edTime">End Time: ${myJson[i].endTime}</p>
                
                </details>
                `);
            }
        })
};
//line 189 <input type="image" src="images/editIcon.png" class="editIcon" value="${myJson[i]._id}" alt="editIcon"/>

//deletes a schedule
$(document).on('click','.deleteIcon',function (event){
    console.log('testing delete');
    fetch('/schedule/one/' + event.currentTarget.value +'/'+localStorage.getItem('token'), { 
        headers: {
            'Content-Type': 'application/json',
        },
        method:'DELETE',
    }) 
    .then(function(response){
    return response.json();
    })
    
    .then(function(myJson){
        if(myJson.error) {
            alert(myJson.message);
            return
        }
    })
    .catch(error => console.error (error));
})

//edit schedule/travel plan
// $(document).on('click','.editIcon',function (event){
//     event.preventDefault();
//     const htmlObj = $(this).parent();
//     const info = htmlObj.find('p');
//     let updateInfo = {};
//     let objKeys = ['location','startDate','startTime','endDate','endTime','event'];
//     for(let i=0; i < info.length; i++ ){
//         let key = objKeys[i];
//         updateInfo[key] = $(info[i]).text().split(':')[1].trim()
//     }
//     console.log('testing edit Travel');
//     $('#editForm').show();
//     $('#scheduleInfo').hide();
//     $('.locationInput2').val(updateInfo.location);
//     $('.eventInput2').val(updateInfo.event);
//     $('.startDate2').val(updateInfo.startDate);
//     $('.endDate2').val(updateInfo.endDate);
//     $('.endTime2').val(updateInfo.endTime);
//     $('#updateTravelbtn').val(event.currentTarget.value);
// })

// $(document).on('click','#updateTravelbtn',function (event){
//     event.preventDefault();
//     const data = {
//         location: $('.locationInput2').val(),
//         startDate: $('.startDate2').val(),
//         startTime: $('.startTime2').val(),
//         endDate: $('.endDate2').val(),
//         endTime: $('.endTime2').val(),
//         event: $('.eventInput2').val()
//     } 
//     const url = '/schedule/one/' + event.currentTarget.value +'/'+localStorage.getItem('token');
//     fetch(url, {
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         method:'PUT',
//         body: JSON.stringify(data),
//     })
//     .then(function(response){
//     return response.json();
//     })
//     .then(function(myJson){
//         if(myJson.error) {
//             alert(myJson.message);
//             return
//         }
//         console.log(myJson);
//     })
//     .catch(error => console.error(error));
// }) 

// function addEvent() {
//     $('#eventbtn').click(function(event){
//         event.preventDefault();
//         $('#createEventPage').hide();
//         $('#scheduleInfo').show();
//         const data = {
//             description: $('.descriptionInput').val(),
//             startDate: $('.startDate').val(),
//             endDate: $('.endDate').val(),
//         }
//         fetch('/event/new' + localStorage.getItem('token'), {
//             headers: {
//                 'Content-Type':'application/json',
//             },
//             method:'POST',
//             body: Json.stringify(data),
//         })
//         .then(function(response){
//             return response.json();
//         })
//         .then(function(myJson){
//             if(myJson.error) {
//                 alert(myJson.message);
//                 return
//             }
//             getSchedules();
//             console.log(myJson);
//         })
//         .catch(error => console.error(error));
//     })
// }
// addEvent();

// //search for available users 
// function watchForm () {
//     $('#searchBtn').click(function(event){
//         event.preventDefault();
//         let userSearch = $('.searchPpl').val();
//         $('.results').empty();
//         assignPeople(userSearch);
//     })
// }

// function assignPeople(){
//     $('#eventbtn').click(function(event){
//         event.preventDefault();
//         $('#assignPage').show();
//         $('#createEventPage').hide();
//         fetch('person/people/', {
//            headers: {
//                'Content-Type': 'application/json',
//            },
//            method: 'GET',
//         })
//         .then(function(response){
//             return response.json();
//         })
//         .then(function(myJson){
//             if(myJson.error) {
//                 alert(myJson.message);
//                 return
//             }
//             renderPeople(myJson);
//             console.log(myJson);
//         })
//         .catch(error => console.error(error));
//     })
// }
// assignPeople();

/*
function renderPeople(myJson) {
    let myLength=0;

    for(let i=0; i<i<myLength; i++) {
        if(!myJson.startDate[i] & !myJson.endDate[i]) {
            firstName = myJson.firstName[i];
            lastName = myJson.lastName[i];
        }
        $('.results').append(`
        <div class="assign results">
            <p> ${firstName}<p>
            <p>${lastName}</p>
        </div>
        `);
    }
}

*/
$('#registerPage').hide();
//$('#requestpwdPage').hide();
$('#scheduleInfo').hide();
$('#addTravelPage').hide();
//$('#editForm').hide();
//$('#createEventPage').hide();
//$('#assignPage').hide();
$('#loginPage').hide(); //does loginPage need to be hidden @ beginning?

if(localStorage.getItem('token')) {
    getSchedules();
    $('#scheduleInfo').show();
}
else {
    $('#loginPage').show();
    $('#scheduleInfo').hide();
}

function logOut(){
    $('#signOut').click(function(event){
        event.preventDefault();
        localStorage.removeItem('token');
        $('#loginPage').show();
        $('#scheduleInfo').hide();
    });
}
logOut();

function logOut2(){
    $('#signOut2').click(function(event){
        event.preventDefault();
        localStorage.removeItem('token');
        $('#loginPage').show();
        $('#scheduleInfo').hide();
    });
}
logOut2();
