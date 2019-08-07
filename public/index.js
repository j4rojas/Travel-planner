function formatDate(uglyDate){
    var monthShort = ["Jan", "Feb", "Mar","Apr","May", "Jun", "Jul", "Aug","Sep","Oct","Nov","Dec"];
    const date = new Date(uglyDate);
    return monthShort[date.getMonth()]+ " " +  date.getDate() + ", " + date.getFullYear()
}

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
            $('.locationInput').val('');
            $('.eventInput').val('');
            $('.startDate').val('');
            $('.startTime').val('');
            $('.endDate').val('');
            $('.endTime').val('');
            getSchedules();
        })
        .catch(error => console.error(error));
    })
}
addTravel();

function getSchedules() {
    ('get schedule');
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

//deletes a schedule
$(document).on('click','.deleteIcon',function (event){
    fetch('/schedule/one/' + event.currentTarget.value +'/'+localStorage.getItem('token'), { 
        headers: {
            'Content-Type': 'application/json',
        },
        method:'DELETE',
    }) 
    .then(function(myJson){
        if(myJson.error) {
            alert(myJson.message);
            return
        }
        window.location.pathname = "/" 
    })
    .catch(error => console.error (error));
})

$('#registerPage').hide();
$('#scheduleInfo').hide();
$('#addTravelPage').hide();
$('#createEventPage').hide();
$('#loginPage').hide(); 

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
