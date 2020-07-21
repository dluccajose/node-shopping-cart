// Funcion constructora de objeto
module.exports = function Cart(oldCart) {

    this.items = oldCart.items
    this.totalQty = oldCart.totalQty || 0
    this.totalPrice = oldCart.totalPrice || 0

    // Eliminar un producto
    this.removeOne = function (id) {
        this.totalQty--
        this.items[id].price -= this.items[id].item.price
        this.totalPrice = this.totalPrice - this.items[id].item.price
        // Verificamos si la cantidad es uno
        if (this.items[id].qty === 1) {
            delete this.items[id]
        } else {
            this.items[id].qty--
        }
    }

    // Agregar producto al carro
    this.add = function(item, id) {
        var storeItems = this.items[id]
        // Verificamos si el producto ya esta en el carrito
        // Al utilizar un string como identificador, estamos creando un objeto y no un array
        if(!storeItems) {
            // Si no existe, lo creamos 
            storeItems = this.items[id] = { item: item, qty: 0, price: 0}
        }
        storeItems.qty++
        storeItems.price = storeItems.qty * storeItems.item.price
        this.totalQty++
        this.totalPrice += storeItems.item.price
    }

    // Generamos un array con todos los productos
    this.generateArray = function() {
        var arr = []
        for( var id in this.items) {
            arr.push(this.items[id])
        }
        return arr
    }
}