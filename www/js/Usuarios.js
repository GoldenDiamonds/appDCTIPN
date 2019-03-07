//Test for browser compatibility
if (window.openDatabase) {
    //Create the database the parameters are 1. the database name 2.version number 3. a description 4. the size of the database (in bytes) 1024 x 1024 = 1MB
    var mydb = openDatabase("dctipn", "1.0", "Base de Datos DCTIPN", 3*1024*1024);

    //create the cars table using SQL for the database using a transaction
    mydb.transaction(function (t) {
        t.executeSql("CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY ASC, ficha TEXT, password TEXT, nombre TEXT, apellidos TEXT, correo TEXT)");
    });



} else {
    alert("¡Tu navegador web/browser no soporta WebSQL!");
}

//function to output the list of cars in the database

function actualizarUsuario(transaction, results) {
    //initialise the listitems variable
    var listitems = "";
    //get the car list holder ul
    var listholder = document.getElementById("lista_Usuarios");

    //clear cars list ul
    listholder.innerHTML = "";

    var i;
    //Iterate through the results
    for (i = 0; i < results.rows.length; i++) {
        //Get the current row
        var row = results.rows.item(i);

        listholder.innerHTML += "<li>" + row.usuario + " - " + row.password + " - " + row.nombre + " - " + row.apellidos + " - " +
         row.correo + " (<a href='javascript:void(0);' onclick='eliminarUsuario(" + row.id + ");'>Eliminar usuario</a>)";
    }

}

//function to get the list of cars from the database

function salidaUsuarios() {
    //check to ensure the mydb object has been created
    if (mydb) {
        //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
        mydb.transaction(function (t) {
            t.executeSql("SELECT * FROM usuarios", [], actualizarUsuario);
        });
    } else {
       // alert("¡Tú navegador web/browser no soporta WebSQL!");
    }
}

//function to add the car to the database

function addUsuario() {
    //check to ensure the mydb object has been created
    if (mydb) {
        //get the values of the make and model text inputs
        var ficha = document.getElementById("ficha").value;
        var password = document.getElementById("password").value;
        var nombre = document.getElementById("nombre").value;
        var apellidos = document.getElementById("apellidos").value;
        //var correo = document.getElementById("correo").value;

        //Test to ensure that the user has entered both a make and model
        if (ficha !== "" || password !== "" ||nombre !== "" || apellidos !== "") {
            //Insert the user entered details into the cars table, note the use of the ? placeholder, these will replaced by the data passed in as an array as the second parameter
            mydb.transaction(function (t) {
                t.executeSql("INSERT INTO usuarios (ficha, password, nombre, apellidos) VALUES (?, ?, ?, ?)", [ficha, password, nombre, apellidos]);
                salidaUsuarios();
            });
        } else {
            alert("Por favor, ingresa un usuario con todos los campos");
        }
    } else {
        alert("¡Tú navegador web/browser no soporta WebSQL!");
    }
}


//function to remove a car from the database, passed the row id as it's only parameter

function eliminarUsuario(id) {
    //check to ensure the mydb object has been created
    if (mydb) {
        //Get all the cars from the database with a select statement, set outputCarList as the callback function for the executeSql command
        mydb.transaction(function (t) {
            t.executeSql("DELETE FROM usuarios WHERE id=?", [id], salidaUsuarios);
        });
    } else {
        alert("¡Tú navegador web/browser no soporta WebSQL!");
    }
}

salidaUsuarios();
