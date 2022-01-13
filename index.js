require('dotenv').config()
const { leerInput, inquireMenu, pausa, listadoLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async () => {
    let opt
   const busquedas = new Busquedas()
    do {
       
        opt = await inquireMenu()
    
        switch (opt) {
            case 1:
                //mostrar mensaje
                const termino = await leerInput('Ciudad: ')   
                //buscar los lugares           
                const lugares = await busquedas.ciudad(termino)
                //seleccionar el lugar
                const id      = await listadoLugares(lugares)
                if(id =='0') continue
                const lugarSel = lugares.find(lugar => lugar.id == id)
                //guardar DB
                busquedas.agregarHistorial(lugarSel.nombre)
               // climar lugar
                const {desc, min, max,temp} = await busquedas.climaLugar(lugarSel.lat,lugarSel.lng)
                //mostrar resultados
                console.log(`\n Informacion de la Ciudad \n`.green)
                console.log(`Ciudad: `,lugarSel.nombre)
                console.log(`Lat: `,lugarSel.lat)
                console.log(`Lng: `,lugarSel.lng)
                console.log(`Temperatura:`,temp)
                console.log(`Mínima: `,min)
                console.log(`Máxima: `,max)
                console.log(`Descripcion clima: `,desc)
                break;
            case 2:
            busquedas.historialCapitalizado.forEach((lugar, i)=>{
                const idx = `${i + 1}.`.green
                console.log(`${idx} ${lugar}`)
            })
                break;
            default:
                break;
        }
      if(opt !== 0) await pausa()
    } while (opt !== 0);
}
main()
//console.log('Hola mundo')