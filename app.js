const { guardarDB, leerDB } = require("./helpers/guardarArchivo");
const {
  inquirerMenu,
  pausa,
  leerInput,
  listadoTareasBorrar,
  confirmar,
  mostrarListadoChecklist,
} = require("./helpers/inquier");
const Tareas = require("./models/tareas");
require("colors");
//const { mostrarMenu, pausa } = require("./helpers/mensajes");

const main = async () => {
  let opt = "";
  const tareas = new Tareas();

  const tareasDB = leerDB();

  if (tareasDB) {
    // establecer las tareas
    tareas.cargarTareasFromArray(tareasDB);
  }

  do {
    // Imprimir el menu
    opt = await inquirerMenu();

    switch (opt) {
      case "1":
        const desc = await leerInput("descripción:");
        tareas.crearTarea(desc);
        break;

      case "2":
        tareas.listadoCompleto();
        break;

      case "3": // listas completadas
        tareas.listarPendientesCompletadas(true);
        break;

      case "4": // tareas pendientes
        tareas.listarPendientesCompletadas(false);
        break;

      case "5": // Completado o pendiente
        const ids = await mostrarListadoChecklist(tareas.listadoArr);
        tareas.toggleCompletadas(ids)
        
        break;
      case "6": // Borrar tareas
        const id = await listadoTareasBorrar(tareas.listadoArr);
        if (id !== "0") {
          const ok = await confirmar("¿Está seguro?");
          if (ok) {
            tareas.borrarTarea(id);
            console.log("Tarea borrada con éxito");
          }
        }
        break;
    }

    guardarDB(tareas.listadoArr);

    await pausa();
  } while (opt !== "0");
};

main();
