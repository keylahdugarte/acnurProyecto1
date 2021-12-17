

const card = document.getElementById('card');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('template-card').content;
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();
const url = 'https://my-json-server.typicode.com/margaritasing/Json-Productos-financieros/response'
let carrito = {};

document.addEventListener('DOMContentLoaded', ()=>{
    fetchData()
})
card.addEventListener('click', e => {
    addCarrito(e)
})


const fetchData = async () => {
    try{
        const res = await fetch(url)
        const data = await res.json()
        pintarCards(data)
        console.log(data)
    }catch(error){
        console.log(error)
    }
}

const pintarCards = data => {
    data.forEach(producto => {        
        templateCard.querySelector('h5').textContent = producto.nombre
        templateCard.querySelector('p').textContent = producto.descripcion
        templateCard.querySelector('img').setAttribute("src", producto.imagen)
        templateCard.querySelector('h4').textContent = producto.tipo
        templateCard.querySelector('h6').textContent = producto.precio
        templateCard.querySelector('.boton').dataset.id = producto._id
        
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })

    card.appendChild(fragment)

}

const addCarrito = e => {
    if(e.target.classList.contains('boton')){
        setCarrito(e.target.parentElement)

    }
    e.stopPropagation()
}

const setCarrito = objeto => {

    const producto = {
        id: objeto.querySelector('.boton').dataset.id,
        nombre: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('h6').textContent,
        cantidad: 1

    }

    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto}
    pintarCarrito()

}

const pintarCarrito = () => {
    console.log(carrito)
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.nombre
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.boton-uno').dataset.id = producto.id
        templateCarrito.querySelector('.boton-dos').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)




}
        