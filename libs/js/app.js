let nuevoId
let db = openDatabase("itemDB", "1.0", "itemDB", 65535)

function limpiar() {
    document.querySelector('#item').value = ' '
    document.querySelector('#precio').value = ' '
}

//FUNCIONALIDAD DE LOS BOTONES

//Funcion para eliminar registro ( eliminar uno)
function eliminarRegistro() {
    $(document).one('click', 'button[type="button"]', function(event) {
        let id = this.id
        let lista = []
        $('#listaProductos').each(function() {
            let celdas = $(this).find('tr.Reg_' + id)
            celdas.each(function() {
                let registro = $(this).find('span.mid')
                registro.each(function() {
                    lista.push($(this).html())
                })
            })
        })
        nuevoId = lista[0].substr(1)
        db.transaction(function(transaction) {
            let sql = "DELETE FROM productos WHERE id=" + nuevoId + ";"
            transaction.executeSql(sql, undefined, function() {
                alert('Registro borrado satisfactoriamente, por favor actualice la tabla')
            }, function(transaction, err) {
                alert(err.message)
            })
        })

    })
}


//Editar registro
function editar() {
    $(document).one('click', 'button[type="button"]', function(event) {
        let id = this.id
        let lista = []
        $('#listaProductos').each(function() {
            let celdas = $(this).find('tr.Reg_' + id)
            celdas.each(function() {
                let registro = $(this).find('span')
                registro.each(function() {
                    lista.push($(this).html())
                })
            })
        })
        document.querySelector('#item').value = lista[1]
        document.querySelector('#precio').value = lista[2].slice(1) //PAra verificar
        nuevoId = lista[0].substr(1)

    })

}


//creamos una funcion usando jQuery $(function){....} para el boton "Crear"
$(function() {
    $('#crear').click(function() {
        db.transaction(function(transaction) {
            const sql = "CREATE TABLE productos " + "(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " + "item VARCHAR(100) NOT NULL, " + "precio DECIMAL(5,2) NOT NULL)"
            transaction.executeSql(sql, undefined, function() {
                alert('Tabla creada satisfactoriamente')
            }, function(transaction, err) {
                alert(err.message)
            })
        });
    });


    //Usando jQuery creamos la funcion para el boton "Mostrar/Actualizar" que tiene id="listar"
    $('#listar').click(function() {
        cargarDatos()
    })

    //Funcion para cargar datos y mostrarlos(renderizarlos) en el navegador
    function cargarDatos() {
        $('#listaProductos').children().remove()
        db.transaction(function(transaction) {
            const sql = 'SELECT * FROM productos ORDER BY item DESC'
            transaction.executeSql(sql, undefined, function(transaction, result) { //REVISAR SI ESTA CORRECTO EL PARENTESIS Y LAS LLAVES "orde"
                if (result.rows.length) {
                    $('#listaProductos').append('<tr><th>Código</th><th>Producto</th><th>Precio</th><th></th><th></th></tr>')
                    for (let i = 0; i < result.rows.length; i++) {
                        let row = result.rows.item(i)
                        let item = row.item
                        let id = row.id
                        let precio = row.precio
                            //Renderizamos (mostramos) en el navegador el resultado de la tabla
                        $('#listaProductos').append('<tr id="fila' + id + '" class="Reg_A' + id + '"><td><span class="mid">A' + id + '</span></td><td><span>' + item + '</span></td><td><span>$' + precio + '</span></td><td><button type="button" id="A' + id + '"  class="btn btn-success" onclick="editar()" ><img src="libs/img/edit2.png" /></button></td><td><button type="button" id="A' + id + '" class="btn btn-danger" onclick="eliminarRegistro()"><img src="libs/img/delete.png" /></button></td></tr>')

                    }
                } else {
                    $('#listaProductos').append('<tr><td colspan="5" align="center">No hay registros</td></tr>')
                }
            }, function(transaction, err) {
                alert(err.message)
            })
        })
    }

    //Insertar registros
    $('#insertar').click(function() {
        let item = $('#item').val()
        let precio = $('#precio').val()
        db.transaction(function(transaction) {
            let sql = "INSERT INTO productos(item,precio) VALUES(?,?)"
            transaction.executeSql(sql, [item, precio], function() {

            }, function(transaction, err) {
                alert(err.message)
            })
        })
        limpiar()
        cargarDatos()
    })


    //Modificar un registro
    $('#modificar').click(function() {
        let nprod = $('#item').val()
        let nprecio = $('#precio').val()

        db.transaction(function(transaction) {
            let sql = "UPDATE productos SET item='" + nprod + "', precio='" + nprecio + "' WHERE id=" + nuevoId + ";"
            transaction.executeSql(sql, undefined, function() {
                cargarDatos()
                limpiar()
            }, function(transaction, err) {
                alert(err.message)
            })
        })
    })


    //Programamos la funcion del boton "ELIMINAR TODO"
    $('#borrarTodo').click(function() {
        if (!confirm("Estas seguro que deseas eliminar todo? \nLos datos no se podran recuperar despues de esta accion.", " "))
            return
        db.transaction(function(transaction) {
            let sql = "DROP TABLE productos"
            transaction.executeSql(sql, undefined, function() {
                alert('Tabla borrada satisfactoriamente, por favor actualice la página')
            }, function(transaction, err) {
                alert(err.message)
            })
        })

        {

        }
    })







})