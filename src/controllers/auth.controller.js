import Trial  from '../models/trial.model.js'; //importo el modelo de la base de datos

export const home = (req,res) => {
    res.send("Hello World from my controller of express"); //envio un mensaje de bienvenida
}

export const about = (req,res) => {
    res.send("Hello this is about us page from my express controller!!! "); //envio un mensaje de bienvenida
}

export const mongoTest = async (req, res) => {
    try {

        const newTrial = new Trial({ name: 'Prueba de escritura en MongoDB!' }); //creo un nuevo objeto de la clase Trial

        const saveTrial = await newTrial.save(); //guardo el objeto en la base de datos

        return res.status(200).json(saveTrial); //devuelvo el objeto guardado en la base de datos
        
    } catch (error) {
        console.log("Error in mongoTest: ", error); //si hay un error lo muestro por consola        
    }
}


