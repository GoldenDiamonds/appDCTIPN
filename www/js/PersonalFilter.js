//Test for browser compatibility
if (window.openDatabase) {
    //Create the database the parameters are 1. the database name 2.version number 3. a description 4. the size of the database (in bytes) 1024 x 1024 = 1MB
    var mydb = openDatabase("dctipn", "1.0", "Base de datos de DCTIPN", 3*1024*1024);

    //create the personal table using SQL for the database using a transaction
    mydb.transaction(function (t) {
        t.executeSql("CREATE TABLE IF NOT EXISTS personal (id INTEGER PRIMARY KEY ASC,ficha INTEGER, Nombre TINYTEXT, Categoria TINYTEXT, Nivel INTEGER)");
    });

} else {
    alert("¡Tu navegador web/browser no soporta WebSQL!");
}

//function to output the list of personal in the database

function actualizarPersonal(transaction, results) {
    //initialise the listitems variable
    var listitems = "";
    //get the pesonal list holder ul
    var listholder = document.getElementById("listaPersonal");

    //clear personal list ul
    listholder.innerHTML = "";


    //Iterate through the results
    for (var i = 0; i < results.rows.length; i++) {
        //Get the current row
        var row = results.rows.item(i);


        listholder.innerHTML += "<tr><th>" + row.ficha + "</th><td>" + row.Nombre + "</td><td>" + row.Categoria + "</td><td>" + row.Nivel 
        + "</td></tr>";
//        + " (<a href='javascript:void(0);' onclick='eliminarPersonal(" + row.id + ");'>Eliminar</a>)</li>";
    }

}

//function to get the list of personal from the database

function salidaPersonal() {
    //check to ensure the mydb object has been created
    if (mydb) {
        //Get all the personal from the database with a select statement, set outputPersonalList as the callback function for the executeSql command
        mydb.transaction(function (t) {
            t.executeSql("SELECT * FROM personal", [], actualizarPersonal);
        });
    } else {
       // alert("¡Tú navegador web/browser no soporta WebSQL!");
    }
}

//function to add the car to the database

function addPersonal() {
    //check to ensure the mydb object has been created
    if (mydb) {
        //get the values of the make and model text inputs
        var ficha = document.getElementById("ficha").value;
        var nombre = document.getElementById("nombre").value;
        var categoria = document.getElementById("categoria").value;
        var nivel = document.getElementById("nivel").value;
        //Test to ensure that the user has entered both a make and model
        if (ficha !== "" || nombre !== "" ||categoria !== "" || nivel !== "") {
            //Insert the user entered details into the cars table, note the use of the ? placeholder, these will replaced by the data passed in as an array as the second parameter
            mydb.transaction(function (t) {
                t.executeSql("INSERT INTO personal (ficha, Nombre, Categoria, Nivel) VALUES (?, ?, ?, ?)", [ficha, nombre, categoria, nivel]);
                salidaPersonal();
            });
        } else {
            alert("Por favor, rellena todos los campos");
        }
    } else {
        alert("¡Tú navegador web/browser no soporta WebSQL!");
    }
}


//function to remove a personal from the database, passed the row id as it's only parameter
function eliminarPersonal(id) {
    //check to ensure the mydb object has been created
    if (mydb) {
        //Get all the personal from the database with a select statement, set outputPersonalList as the callback function for the executeSql command
        mydb.transaction(function (t) {
            t.executeSql("DELETE FROM personal WHERE id=?", [id], salidaPersonal);
        });
    } else {
        alert("¡Tú navegador web/browser no soporta WebSQL!");
    }
}

salidaPersonal();
