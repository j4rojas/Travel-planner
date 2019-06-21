$('#registerPage').hide();
$('#requestpwdPage').hide();
$('#scheduleInfo').hide();
$('#addTravelPage').hide();
$('#testing').hide();

function forgotPage(){
    $('.pwd').click(function(event){
        $('#requestpwdPage').show();
        $('#loginPage').hide();
    });
}
forgotPage();

function registerPage(){
    $('.reg').click(function(event){
        $('#registerPage').show();
        $('#loginPage').hide();
    });
}
registerPage();

function getSchedules() {
    console.log('get schedule');
    fetch('/schedule/all')
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson){
            console.log(myJson);
            for(let i =0; i<myJson.length;i++) {
                $('.schList').append(`<details class="schitem">
                <summary class="sch summary">${myJson[i].startDate} - ${myJson[i].endDate}</summary> 
                <p class="sch location">Location: ${myJson[i].location}</p>
                <p class="sch stDate">Start Date: ${myJson[i].startDate} </p>
                <p class="sch edDate">End Date: ${myJson[i].endDate}</p> 
                <p class="sch event">Reason for Travel: ${myJson[i].event}</p>
                </details>`);
            }
        })
};

function createSchedule() {
    $('.calendarIcon').click(function(event){
       $('#addTravelPage').show();
       $('#scheduleInfo').hide();
       
    });
}
createSchedule();

function addTravel() {
    $('#travelbtn').click(function(event){
        event.preventDefault();
        const data = {
            location: $('.locationInput').val(),
            event: $('.eventInput').val(),
            startDate: $('.startDate').val(),
            endDate: $('.endDate').val()
       }
        fetch('/schedule/new', {
            method:'POST',
            body: JSON.stringify(data),
        })
        .then(function(response){
            return response.json();
        })
        .then(function(myJson){
            console.log(myJson);
        })
        .catch(error=>console.error(error));
    })
}
addTravel();


function schedulePage(){
    $('.sch').click(function(event){
        $('#scheduleInfo').show();
        $('#loginPage').hide();
        getSchedules();
    });
}
schedulePage();


function loginPage(){
    $('.lgnin').click(function(event){
        $('#registerPage').hide();
        $('#requestpwdPage').hide();
        $('#loginPage').show();
    });
}
loginPage(); 

//create page (section) w/ form, get click event, 
//value of the form & create new schedule

//create a form to add create events and assign ppl in html
//form to create an event for my own schedule

//view other ppl's event 
