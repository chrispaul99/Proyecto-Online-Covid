function cargarPagina() {
    window.location.href = 'verMedicos.ht';
}

function cargarDatos() {
    fetch("datos.json")
        .then(data => data.json())
        .then(data => {

            //load another html page
            //traverse the array
            for (var i = 0; i < data.length; i++) {
                //add arrow to table
                var fila = "<tr> <td> " + data[i]["nombre"] + "</td> <td> " + data[i]["especialidad"] + "</td> <td> " + data[i]["aniosExperiencia"] + "</td> <td> " + data[i]["area"] + "</td> <td> " + data[i]["telefono"] + "</td> <td> " + data[i]["ciudad"] + "</td> <td> " + data[i]["horas"] + "</td> <td> " + data[i]["dias"] + "</td> </tr>";
                $("#tblMedicos").append(fila);
            }

        })
}