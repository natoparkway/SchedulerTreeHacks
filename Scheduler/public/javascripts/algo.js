

/* ******************************************SCHEDULING ALGORITHM******************************************************/
exports.scheduleAllClasses = function(quarters, classes){
    formatClasses(classes);

    // order the classes in a way that prerequisites always come before other classes
    // (but still try to preserve original order)
    classes = orderClasses(classes);

    //reformatts the times field to an array (from string)
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



/* ****************************************SCHEMA CONSISTENCY***************************/
function formatClasses(classes){
    for(var i = 0; i < classes.length; i++){
        //formats the titleCode of the class
        classes[i].titleCode = classes[i].subject.concat(classes[i].code);

        //formats the terms
        var myTerms = [];
        for(var j = 0; j < classes[i].terms.length; j++){
            if(classes[i].terms[j] == "autumn") myTerms.push(0);
            if(classes[i].terms[j] == "winter") myTerms.push(1);
            if(classes[i].terms[j] == "spring") myTerms.push(2);
        }
        classes[i].terms = myTerms;

        //formats the units array
        classes[i].units = classes[i].units[classes[i].units.length - 1];

        //formats times to be just the first lecture times. TODO: do better
        classes[i].times = classes[i].times[0];

        //add preq field
        classes[i].preqs = [];
    }
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
        if(classes[i].titleCode == name) return i;
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
            for(var j = 0; j < classes[i].terms.length; j++){ //each terms
                //qIndex = index into quarters
                qIndex = 3 * y + classes[i].terms[j];

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
//checks the times too
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
            if(quarters[i].classes[j].titleCode == name) return true;
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

/******************************************* times ***********************************************************/

/* Turn the times field to an array in every class */
function reformatTime(classes){
    for(var i = 0; i < classes.length; i++){
        classes[i].times = reformat(classes[i].times);
    }
}

function reformat(times){
    //TODO: extend to look at all times, not just the first
    var arr = times.split(" "); //arr is in the form: [days startTime meridian endTime meridian]

    /* Calculate the start and end times as integers */
    var start = calcTime(arr[1], arr[2]);
    var end = calcTime(arr[3], arr[4]);

    return [arr[0], start, end]; //array in the form: [days startInt endInt]
}

function calcTime(times, meridian){
    /* Remove trailing zeroes and colons */
    var firstColonIndex = times.indexOf(":");
    var secondColonIndex = times.lastIndexOf(":");
    times = times.slice(0, firstColonIndex).concat(times.slice(firstColonIndex + 1, secondColonIndex));

    /* Turn the string into an integer */
    var result = parseInt(times);
    if(meridian == "PM" && result < 1200){
        result += 1200; //used to distinguish AM from PM
    }
    return result;
}

/* Checks whether two classes conflict in times or not */
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
/* Returns whether two classes are at the same times*/
function isSameTime(c1, c2){
    /* Checks days */
    if(!sameDays(c1.times[0], c2.times[0]))
        return false;


    /* Check times */
    /* Presort so c1 has the "smaller" start times */
    if(c1.times[1] > c2.times[1]){
        var temp = c2; //simple swapping of references
        c2 = c1;
        c1 = temp;
    }

    /* Check that c2's start times is not caught in c1's times frame */
    if(c2.times[1] >= c1.times[1] && c2.times[1] < c1.times[2])
        return true;

    /* If c1 has a wraparound times */
    if(c1.times[1] - c1.times[2] > 0 && c2.times[1] >= c1.times[1]) /* Right edge case */
        return true;

    /* If c2 has a wraparound times */
    if(c2.times[1] - c2.times[2] > 0 && c1.times[1] < c2.times[2]) /* Left edge case */
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