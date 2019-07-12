$('#registerPage').hide();
$('#requestpwdPage').hide();
$('#scheduleInfo').hide();
$('#addTravelPage').hide();
$('#testing').hide();
$('#createEventPage').hide();
$('#assignPage').hide();


//check at the beginning if you have the token
////if/else
//implement testing
//add update (same as delete)
function forgotPage(){
    $('.pwd').click(function(){
        $('#requestpwdPage').show();
        $('#loginPage').hide();
    });
}
forgotPage();

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
            endDate: $('.endDate').val()
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
            for(let i =0; i<myJson.length;i++) {
                $('.schList').append(`<details class="schitem">
                <summary class="sch summary">${myJson[i].startDate}</summary>
                <input type="image" src="images/deleteIcon.png" class="deleteIcon" value="${myJson[i]._id}" alt="deleteIcon"/>
                <p class="sch location">Location: ${myJson[i].location}</p>
                <p class="sch stDate">Start Date: ${myJson[i].startDate} </p>
                <p class="sch edDate">End Date: ${myJson[i].endDate}</p> 
                <p class="sch event">Reason for Travel: ${myJson[i].event}</p>
                <input type="image" src="images/editIcon.png" class="editIcon" value="${myJson[i]._id}" alt="editIcon"/>
                </details>`);
            }
        })
};

function createSchedule() {
    $('.calendarIcon').click(function(){
       $('#addTravelPage').show();
       $('#scheduleInfo').hide();
    });
}
createSchedule();

function createEvent() {
    $('.eventIcon').click(function(){
        $('#scheduleInfo').hide();
        $('#createEventPage').show();
    });
}
createEvent();

function addUser() {
    $('#regbtn').click(function(event){
        event.preventDefault();
        $('#registerPage').hide();
        $('#scheduleInfo').show();
        const data = {
            firstName: $('.firstname').val(),
            lastName: $('.lastname').val(),
            userName: $('.regUsername').val(),
            password: $('.regPassword').val(),
            email: $('.email').val(),
            //gender: $('input[name='gender']:checked').val(),
            //status: $('input[name='status']:checked').val()
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
            console.log(myJson);
        })
        .catch(error => console.error(error));
    })
}
addUser();


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
    .catch(error => console.error(error));
})

//updates schedule 
$(document).on('click','.editIcon',function (event){
    console.log('testing edit Travel');
    const data = {
        location: $('.location').val(),
        startDate: $('.startDate').val(),
        startTime: $('.startTime').val(),
        endDate: $('.endDate').val(),
        endTime: $('.endTime').val(),
        event: $('.event').val()
    } //get id and put in front end + token
    fetch('/one/', event.currentTarget.value+'/'+localStorage.getItem('token'), {
        headers: {
            'Content-Type': 'application/json',
        },
        method:'PUT',
        body: JSON.stringify($('.schitem')),
    })
    .then(function(response){
    return response.json();
    })
    .then(function(myJson){
        if(myJson.error) {
            alert(myJson.message);
            return
        }
        console.log(myJson);
    })
    .catch(error => console.error(error));
}) 


function assignPeople(){
    $('#eventbtn').click(function(event){
        event.preventDefault();
        $('#assignPage').show();
        $('#createEventPage').hide();
    });
}
assignPeople();



//add feedback
//verify token on routes (delete, new, etc)
//add error on back end calls 
//save userID on schedules & set on the route 