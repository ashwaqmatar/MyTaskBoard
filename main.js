
/*--------------Go Through all the on validate options of Dates --------------- */
function validationDate(date) {
    const currentDate = new Date();
    const currentDateObject = {
        year: parseInt(currentDate.getFullYear()),
        month: parseInt(currentDate.getMonth() + 1),
        day: parseInt(currentDate.getDate())
    }
    const ArrDate = date.split("-");
    const dateObject = {
        year: parseInt(ArrDate[0]),
        month: parseInt(ArrDate[1]),
        day: parseInt(ArrDate[2])
    }

    if (dateObject.year < currentDateObject.year) {
        return false;
    }
    else if (dateObject.year === currentDateObject.year) {
        if (dateObject.month < currentDateObject.month) {
            return false;
        }
        else if (dateObject.month === currentDateObject.month) {
            if (dateObject.day < currentDateObject.day) {

                return false;
            }
        }
    }
    return true;
}


/*--------------Go Through all the on validate options of Times --------------- */
function validationTime(time) {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();

    const [hour, minutes] = time.split(":");
    const timeObject = {
        Hour: parseInt(hour),
         minutes: parseInt(minutes)
    };

    if (currentHour > timeObject.Hour) {
        return false;
    }
    else if (currentHour === timeObject.Hour) {
        if (currentMinutes > timeObject.minutes) {
            return false;
        }
    }
    return true;
}


/*--------------check if it is today --------------- */
function isItToday(iDate) {
    const currentDate = new Date();
    const dateObject = new Date(iDate);
    return dateObject.setHours(0, 0, 0, 0) === currentDate.setHours(0, 0, 0, 0);
}

 
/*--------------when we delete the note then delete the data from the storage --------------- */
function deleteNote(NewNote) {
     
    RemoveTheData(NewNote.id);
    NewNote.style.animation = "Fade-Out";
    setTimeout(() => {
        NewNote.remove()
    }, 100);
}


/*--------------remove data from local storage --------------- */
function RemoveTheData(id) {
    const jsonArray = localStorage.getItem("notes");
    if (!jsonArray) return;
    const notes = JSON.parse(jsonArray);

    for (const note of notes) {
        if (note.INote === id) {
            const index = notes.indexOf(note);
            if (index > -1) {
                notes.splice(index, 1);
            }
        }
    }
    localStorage.removeItem("notes");
    localStorage.setItem("notes", JSON.stringify(notes));
}




function createId() {

    const words = String.fromCharCode(97 + Math.floor(Math.random() * 26)); 
    
    console.log();
    return words + Math.random().toString(36).substr(2); 

}


/*-------------- save all the inforamtion in local storage --------------- */
function Saving(iText, iDate, iTime) {

    const noteId = createId();

    const note = {
        INote: noteId,
        CONTENT: iText,
        date: iDate,
        time: iTime
    }

    let notes = [];
    const jsonArray = localStorage.getItem("notes");
    if (jsonArray) {
        notes = JSON.parse(jsonArray);
    }

    notes.push(note);
    localStorage.setItem("notes", JSON.stringify(notes));
    return note;

}




/*--------------when we can add the data on storage  --------------- */

function Add() {
   
    let iText = document.getElementById("content-text").value;
    const iDate = document.getElementById("DateNow").value;
    const iTime = document.getElementById("TimeNow").value;

    if (!iText.replace(/\s/g, "").length) {
        iText = "";
    }
    if (iText === "" || iText ==null || iText.trim()=="") {
        alert("Check Your Task Note");
        return;
    }
    if (iDate === "") {
        alert("choose the right Date !");
        return;
    }

    if (!validationDate(iDate)) {
        alert("Date Note Valid");
        return;
    }

    if(!validationTime(iTime)){
        alert("Time Not Valid!");
        return;
    }
    if (isItToday(iDate) && !validationTime(iTime)) {
        alert("Not The Same time.");
        return;
    }

    const note = Saving(iText, iDate , iTime);
    show(note);
    Clear();

}
/*--------------after saving new note appear it on the board --------------- */
function show(note) {
    
    const NewNote = document.createElement("Div");
    NewNote.className = "note";
    NewNote.id = note.INote;

    
    const glyphIcon = document.createElement("i");
    glyphIcon.classList.add("fa", "fa-times");
    glyphIcon.setAttribute("onclick", `deleteNote(${note.INote})`)
    NewNote.appendChild(glyphIcon);

    
    const noteContent = document.createElement("Div");
    noteContent.className = ("menu");
    note.CONTENT = note.CONTENT.replaceAll("\n", "<br>");
    noteContent.innerHTML = note.CONTENT;
    NewNote.appendChild(noteContent);

    
    const whichdate = document.createElement("Div");
    whichdate.classList.add("footer");
    const NewDate = (date) => {
        const [year, month, day] = date.split('-');
        return day + "/" + month + "/" + year;
    }
    whichdate.innerHTML = `${NewDate(note.date)}<br>${note.time}`;
    NewNote.appendChild(whichdate);

    const OnBoard = document.getElementById("OnBoard");
    OnBoard.appendChild(NewNote);
}

/*--------------clear the data from textarea/date/time --------------- */
function Clear() {
    document.getElementById("content-text").value = "";
    document.getElementById("DateNow").value = "";
    document.getElementById("TimeNow").value = "";
}

 onload = () => {

    const jsonArray = localStorage.getItem("notes");
    if (!jsonArray) return;

    const notes = JSON.parse(jsonArray);

    for (const note of notes) {
        if (!validateDate(note.date)) {
            RemoveTheData(note.INote);
            continue;
        }
        if (isItToday(note.date) && !validationTime(note.time)) {
            RemoveTheData(note.INote);
            continue;
        }
        show(note);
    }
}