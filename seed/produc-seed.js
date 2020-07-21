const Product = require('../models/product')

const mongoose = require('mongoose')

// Mongoose configuration
mongoose.connect("mongodb://localhost:27017/shopCart", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})


var products = [
    new Product({
        imagePath: 'https://joserragaming.com/wp-content/uploads/2018/04/bak-500x500.jpg',
        title: 'Batman Arktham',
        description: 'Batman Arktham',
        price: 20
        }),
    new Product({
        imagePath: 'https://media.playstation.com/is/image/SCEA/fifa-20-champions-edition-01-ps4-us-05sep19?$native_nt$',
        title: 'FIFA 20',
        description: 'La ultima version del juego de futbol mas popular',
        price: 20
        }),
    new Product({
        imagePath: 'https://vignette.wikia.nocookie.net/godofwar/images/9/9f/God_of_War_III_%28Soundtrack%29.jpg/revision/latest?cb=20120513144402&path-prefix=es',
        title: 'God of War III',
        description: 'God of War III',
        price: 20
        }),
    new Product({
        imagePath: 'https://vignette.wikia.nocookie.net/doblaje/images/1/1f/SpyroPoster.jpg/revision/latest?cb=20200408192730&path-prefix=es',
        title: 'Spyro Remake',
        description: 'Spyro Remake',
        price: 20
        }),
    new Product({
        imagePath: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTbW36urv_XbvFNI49cfGl-CXgdVMt60ucongFGryHz1Qs9qz58',
        title: 'Prototype',
        description: 'Prototype',
        price: 20
        })]

products.forEach(item => {
    item.save( (err, doc) => {
        if (err) {
            console.error('Error al guardar en base de datos', err)
        } else {
            console.log('Producto guardado', doc)
        }
    })
})

