var quarterArr = [];
//freshman
quarterArr[0] =  {maxUnits: 20, availableUnits: 20, classes: new Array()};
quarterArr[1] =  {maxUnits: 20, availableUnits: 20, classes: new Array()};
quarterArr[2] =  {maxUnits: 20, availableUnits: 20, classes: new Array()};

//sophomore
/*
quarterArr[3] =  {maxUnits: 20, availableUnits: 20, classes: new Array()};
quarterArr[4] =  {maxUnits: 20, availableUnits: 20, classes: new Array()};
quarterArr[5] =  {maxUnits: 20, availableUnits: 20, classes: new Array()};

//junior
quarterArr[6] =  {maxUnits: 20, availableUnits: 20, classes: new Array()};
quarterArr[7] =  {maxUnits: 20, availableUnits: 20, classes: new Array()};
quarterArr[8] =  {maxUnits: 20, availableUnits: 20, classes: new Array()};*/

var classArr = [];

classArr[0] = {title: "cs106b", term: [0], units: 6, preqs: [], time: "MWF 11:00:00 AM 2:00:00 PM"};
classArr[1] = {title: "cs106a", term: [0], units: 5, preqs: [], time: "MWF 3:30:00 PM 5:50:00 PM"};
classArr[2] = {title: "cs107", term: [0], units: 5, preqs: [], time: "TR 1:00:00 PM 3:00:00 PM"};
/*
classArr[3] = {title: "math53", term: [1,2], units: 3, preqs: ["math51", "math52"]};
classArr[4] = {title: "math52", term: [1], units: 5, preqs: ["math51"]};
classArr[5] = {title: "math51", term: [0,1,2], units: 5, preqs: ["math41", "math42"]};

classArr[6] = {title: "math41", term: [1], units: 5, preqs: []};
classArr[7] = {title: "math42", term: [0,1,2], units: 5, preqs: ["math41"]};

classArr[8] = {title: "physics43", term: [1,2], units: 3, preqs: ["physics41"]};
classArr[9] = {title: "physics41", term: [1], units: 5, preqs: []};
classArr[10] = {title: "physics45", term: [0,1,2], units: 5, preqs: ["physics41", "physics43"]};

classArr[11] = {title: "cs109", term: [0,2], units: 3, preqs: ["cs103"]};
classArr[12] = {title: "cs103", term: [0,1,2], units: 5, preqs: []};
classArr[13] = {title: "cs161", term: [0,2], units: 5, preqs: ["cs103", "cs109"]};

classArr[14] = {title: "cs140", term: [1], units: 3, preqs: ["cs110"]};
classArr[15] = {title: "cs143", term: [2], units: 5, preqs: ["cs103"]};
classArr[16] = {title: "cs110", term: [1,2], units: 5, preqs: ["cs107"]};
*/
           
var winnerArr = scheduleAllClasses(quarterArr, classArr);
console.log("--------------------------------------------");
if(winnerArr.length == 0)
    console.log("Impossible to schedule all classes");

// for each array of quarters in winnerArr
for(var w = 0; w < winnerArr.length; w++){

    //for each quarter in the array
    for(var i = 0; i < winnerArr[w].length; i++){
        //for each class in each quarter
        for(var j = 0; j < winnerArr[w][i].classes.length; j++){
            winnerArr[w][i].classes[j] = winnerArr[w][i].classes[j].title;
        }
    }

    console.log(winnerArr[w]);
    console.log();
}


function printClasses(classes){
    for(var i = 0; i < classes.length; i++){
        console.log(classes[i].title);
    }
}


/* ******************************************SCHEDULING ALGORITHM******************************************************/
function scheduleAllClasses(quarters, classes){
    // order the classes in a way that prerequisites always come before other classes
    // (but still try to preserve original order)
    classes = orderClasses(classes);

    //reformatts the time field to an array (from string)
    reformatTime(classes);

    var schedules = []; // the first ten schedules we find probably the best, 
                        // since the user preordered classes in a general way

    scheduleClasses(quarters, classes, schedules);

    //arrange the schedules in terms of score
    schedules.sort(function(a, b){
        return score(a) - score(b); //TODO: factor in their initial positions into the score
    });

    return schedules;
}

/* *************************************PREPROCESSING STEP (ORDERING OF PREQS)*********************/
/* Orders classes so that all prequisites come before any particular class*/
function orderClasses(classes){
    if(classes.length == 0) return [];

    var results = [];
    var failures = []; //classes that came before their prequisites
    for(var i = 0; i < classes.length; i++){
        if(hasValidPreqs(classes, i))
            results.push(classes[i]);
        else
            failures.push(classes[i]);
    }

    /* Orders failures themselves */
    failures = orderClasses(failures);

    /* Inserts failures into the classes */
    for(var i = 0; i < failures.length; i++){
    
        /* Gets the index to insert the failure in */
        var insertionIndex = -1;
        for(var p = 0; p < failures[i].preqs.length; p++){
            var pIndex = findIndexOfClass(results, failures[i].preqs[p])
            if(pIndex > insertionIndex)
                insertionIndex = pIndex;
        }

        /* Inserts the failure into the correct place in results*/
        results.splice(insertionIndex + 1, 0, failures[i]); 
    }

    return results;
}

/* Checks that preqs for the class at i come before in the array */
function hasValidPreqs(classes, i){
    for(var p = 0; p < classes[i].preqs.length; p++){
        if(findIndexOfClass(classes, classes[i].preqs[p]) > i) 
            return false;
    }
    return true;
}

/* Finds a class in an array by name */
function findIndexOfClass(classes, name){
    for(var i = 0; i < classes.length; i++){
        if(classes[i].title == name) return i;
    }
    return -1;
}

/******************************************** SCHEDULING ****************************************************************** */ 
function scheduleClasses(quarters, classes, schedules) {
    //TODO: allow user to pick the number of schedules they want generated
    if(schedules.length == 5){ 
        return;
    }

    //found a valid schedule that uses all classes
    if(classes.length == 0){
        schedules.push(quarters);
        return;
    }
    
    //recursive step: try out every possible class in every possible slot (with checking)
    for(var i = 0; i < classes.length; i++){

        // stop if prequisites haven't even been scheduled
        if(!findPreq(classes[i], quarters, quarters.length - 1)) return;

        for(var y = 0; y < quarters.length / 3; y++){ // each year
            for(var j = 0; j < classes[i].term.length; j++){ //each term
                //qIndex = index into quarters
                qIndex = 3 * y + classes[i].term[j];

                if(canBeScheduled(classes[i], quarters, qIndex) && findPreq(classes[i], quarters, qIndex)){
                    var quartersCopy = copyQuarters(quarters); //makes a deep copy
                    scheduleOneClass(classes[i], quartersCopy, qIndex); //schedules the class
                
                    var newClasses = classes.slice(0, i).concat(classes.slice(i+1)); //remove classes[i]
                    scheduleClasses(quartersCopy, newClasses, schedules);  
                }
            }
        }
    }
}

//checks whether a particular class is able to be scheduled at a particular index
//checks the time too
function canBeScheduled(myclass, quarters, index){
    //check whether there are enough units
    if(quarters[index].availableUnits < myclass.units) 
        return false;

    //check whether the times conflict
    if(timesConflict(quarters[index].classes, myclass))
        return false;
    return true;
}

//checks whether all the prequisites for a class have been satisfied
function findPreq(myclass, quarters, index){
    for(var i = 0; i < myclass.preqs.length; i++){
        if (!checkOnePreq(myclass.preqs[i], quarters, index)) return false;
    }
    return true;
}

//checks for a specific prequisite in the quarters range: 0 to index-1
function checkOnePreq(name, quarters, index){
    for(var i = 0; i < index; i++){
        /* Loops over every class in each previous quarter*/
        for(var j = 0; j < quarters[i].classes.length; j++){
            if(quarters[i].classes[j].title == name) return true;
        }
    }
    return false;
}

// schedules one class in a a particular quarter
function scheduleOneClass (myclass, quarters, index){
    quarters[index].classes.push(myclass);
    quarters[index].availableUnits -= myclass.units;
}

// makes a deep copy of an array of quarters
function copyQuarters (quarters){
    var cp = [];
    for(var i = 0; i < quarters.length; i++){
        var obj = {
            maxUnits: quarters[i].maxUnits,
            availableUnits: quarters[i].availableUnits,
            classes: [].concat(quarters[i].classes)
        };
        cp.push(obj);
    }
    return cp;
}

//assigns a score to the schedule
function score(quarters){
    var min = 20;
    var max = 0; // max and min are extreme bounds
    var score = 0;
    for(var i = 0; i < quarters.length; i++){
        var units = quarters[i].maxUnits - quarters[i].availableUnits;
        score += units - 15; //center around 15 units per quarter   
        if(units > max) max = units;
        if(units < min) min = units;
    }
    //score is "worsened" by adding the difference between the heaviest and lightest quarter
    score += max - min;
    return score; //the smaller the score the better
}

/******************************************* TIME ***********************************************************/

/* Turn the time field to an array in every class */
function reformatTime(classes){
    for(var i = 0; i < classes.length; i++){
        classes[i].time = reformat(classes[i].time);
    }
}

function reformat(time){
    //TODO: extend to look at all times, not just the first
    var arr = time[0].split(" "); //arr is in the form: [days startTime meridian endTime meridian]

    /* Calculate the start and end times as integers */
    var start = calcTime(arr[1], arr[2]);
    var end = calcTime(arr[3], arr[4]);

    return [arr[0], start, end]; //array in the form: [days startInt endInt]
}

function calcTime(time, meridian){
    /* Remove trailing zeroes and colons */
    var firstColonIndex = time.indexOf(":");
    var secondColonIndex = time.lastIndexOf(":");
    time = time.slice(0, firstColonIndex).concat(time.slice(firstColonIndex + 1, secondColonIndex));

    /* Turn the string into an integer */
    var result = parseInt(time);
    if(meridian == "PM" && result < 1200){
        result += 1200; //used to distinguish AM from PM
    }
    return result;
}

/* Checks whether two classes conflict in time or not */
function timesConflict(classes, myclass){
    for(var i = 0; i < classes.length; i++){
        if(isSameTime(classes[i], myclass))
            return true;
    }
    return false;
}

/* 
    Example:
        c1: |-------|
        c2:       |-------|
*/
/* Returns whether two classes are at the same time*/
function isSameTime(c1, c2){
    /* Checks days */
    if(!sameDays(c1.time[0], c2.time[0]))
        return false;


    /* Check times */
    /* Presort so c1 has the "smaller" start time */
    if(c1.time[1] > c2.time[1]){
        var temp = c2; //simple swapping of references
        c2 = c1;
        c1 = temp;
    }

    /* Check that c2's start time is not caught in c1's time frame */
    if(c2.time[1] >= c1.time[1] && c2.time[1] < c1.time[2])
        return true;

    /* If c1 has a wraparound time */
    if(c1.time[1] - c1.time[2] > 0 && c2.time[1] >= c1.time[1]) /* Right edge case */
        return true;

    /* If c2 has a wraparound time */
    if(c2.time[1] - c2.time[2] > 0 && c1.time[1] < c2.time[2]) /* Left edge case */
        return true;

    /* If you pass all the checks, you do not conflict */
    return false;
}

function sameDays(days1, days2){
    /* Double for-loop literally compares every day to every day in the other string */
    for(var i = 0; i < days1.length; i++){
        for(var j = 0; j < days2.length; j++){
            if(days1.charAt(i) == days2.charAt(j))
                return true;
        }        
    }
    return false;
}