//Test for browser compatibility
if (window.openDatabase) {
    //Create the database the parameters are 1. the database name 2.version number 3. a description 4. the size of the database (in bytes) 1024 x 1024 = 1MB
    var mydb = openDatabase("dctipn", "1.0", "Base de datos de DCTIPN", 3*1024*1024);

    //create the Pases table using SQL for the database using a transaction
    mydb.transaction(function (t) {
        t.executeSql("CREATE TABLE IF NOT EXISTS pases (id INTEGER PRIMARY KEY ASC,fecha TINYTEXT, ficha INTEGER, actividad TEXT,"+
        " vehiculo INTEGER, destinos INTEGER, material TEXT, combustible TINYTEXT, kilometraje INTEGER, horaSalida TINYTEXT)");
    });

} else {
    alert("¡Tu navegador web/browser no soporta WebSQL!");
}

//function to output the list of Pases in the database
function actualizarPases(transaction, results) {
    //initialise the listitems variable
    var listitems = "";
    //get the pases list holder ul
    var listholder = document.getElementById("listaPasesHolder");

    //clear Pases list ul
    listholder.innerHTML = "";

    var i;
    //Iterate through the results
    for (i = 0; i < results.rows.length; i++) {
        //Get the current row
        var row = results.rows.item(i);

/*
        listholder.innerHTML += "<li>" + row.fecha + " - " + row.ficha + " - " + row.actividad + " - " + row.vehiculo
         + " - " + row.destinos + " - " + row.material + " - " + row.combustible + " - " + row.kilometraje + " - " + row.horaSalida
        + " (<a href='javascript:void(0);' onclick='eliminarPases(" + row.id + ");'>Eliminar</a>)</li>";
        */
         listholder.innerHTML += "<tr><th>" + row.fecha + "</th><td>" + row.ficha + "</td><td>" + row.actividad + "</td><td>" + row.vehiculo 
         + "</td><td>" + row.destinos + "</td><td>" + row.material + "</td><td>" + row.combustible + "</td><td>" + row.kilometraje + "</td><td>" + row.horaSalida 
        + "</td></tr>";
    }

}

//function to get the list of Pases from the database

function salidaPases() {
    //check to ensure the mydb object has been created
    if (mydb) {
        //Get all the Pases from the database with a select statement, set outputpasesList as the callback function for the executeSql command
        mydb.transaction(function (t) {
            t.executeSql("SELECT * FROM pases", [], actualizarPases);
        });
    } else {
       // alert("¡Tú navegador web/browser no soporta WebSQL!");
    }
}

//function to add the pases to the database

function addPase() {
    //check to ensure the mydb object has been created
    if (mydb) {
        //get the values of the make and model text inputs
        var fecha = document.getElementById("fecha").value;
        var ficha = document.getElementById("ficha").value;
        var actividad = document.getElementById("actividad").value;
        var vehiculo = document.getElementById("vehiculo").value;
        var destinos = document.getElementById("destinos").value;
        var material = document.getElementById("material").value;
        var combustible = document.getElementById("combustible").value;
        var kilometraje = document.getElementById("kilometraje").value;
        var horaSalida = document.getElementById("horaSalida").value;

        //Test to ensure that the user has entered both a make and model
        if (fecha !== "" || ficha !== "" ||actividad !== "" || vehiculo !== "" || destinos !== "" || material !== "" ||
            combustible !== "" || kilometraje !== "" || horaSalida !== "") {
            //Insert the user entered details into the Pases table, note the use of the ? placeholder, these will replaced by the data passed in as an array as the second parameter
            mydb.transaction(function (t) {
                t.executeSql("INSERT INTO pases (fecha, ficha, actividad, vehiculo, destinos, material, combustible, kilometraje, horaSalida)  VALUES " +
                    "(?, ?, ?, ?, ?, ?, ?, ?, ?)", [fecha, ficha, actividad, vehiculo, destinos, material, combustible, kilometraje, horaSalida]);
                salidaPases();
            });
        } else {
            alert("Por favor, rellena todos los campos");
        }
    } else {
        alert("¡Tú navegador web/browser no soporta WebSQL!");
    }
}


//function to remove a pases from the database, passed the row id as it's only parameter
function eliminarPases(id) {
    //check to ensure the mydb object has been created
    if (mydb) {
        //Get all the Pases from the database with a select statement, set outputpasesList as the callback function for the executeSql command
        mydb.transaction(function (t) {
            t.executeSql("DELETE FROM pases WHERE id=?", [id], salidaPases);
        });
    } else {
        alert("¡Tú navegador web/browser no soporta WebSQL!");
    }
}
salidaPases();