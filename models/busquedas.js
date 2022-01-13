const fs = require('fs')
const axios = require('axios')
class Busquedas {
    historial = []
    dbPath = './db/database.json'
    constructor() {
        this.leerDB()
    }
    get getparamsMapBox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }
    get getparamsOpenWeather() {
        return {
            'appid': process.env.OPEN_WEATHER,
            'units': 'metric',
            'lang': 'es'
        }
    }
    get historialCapitalizado() {
       return this.historial.map(lugar => {
           let  palabra = lugar.split(' ')
           palabra = palabra.map(p =>p[0].toUpperCase() + p.substring(1))
           return palabra.join(' ')
        })
        
    }
    async ciudad(lugar = '') {
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.getparamsMapBox
            })
            const resp = await instance.get()
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }))

        } catch (error) {
            return []
        }

    }
    async climaLugar(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`,
                params: this.getparamsOpenWeather
            })
            const { data } = await instance.get()
            return {
                desc: data.weather[0].description,
                min: data.main.temp_min,
                max: data.main.temp_max,
                temp: data.main.temp
            }
        } catch (error) {
            console.log('dd', error)
        }
    }
    agregarHistorial(lugar = '') {
        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return
        }
        this.historial = this.historial.splice(0,5)
        this.historial.unshift(lugar.toLocaleLowerCase())
        //guardar en DB
        this.guardarDB()
    }
    guardarDB() {
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }
    leerDB() {
        if (!fs.existsSync(this.dbPath)) return
        
        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' })

        const data = JSON.parse(info)
        this.historial = data.historial
        console.log(info)


    }
}
module.exports = Busquedas