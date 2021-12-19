const card = document.getElementById('card');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('template-card').content;
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();
const url = 'https://my-json-server.typicode.com/margaritasing/productosJson/response'
let carrito = {};

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})
card.addEventListener('click', e => {
    addCarrito(e)
})

items.addEventListener('click', e => {
    btnAccion(e)
})


const fetchData = async() => {
    try {
        const res = await fetch(url)
        const data = await res.json()
        pintarCards(data)
        console.log(data)
    } catch (error) {
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
    if (e.target.classList.contains('boton')) {
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

    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto }
    pintarCarrito()

    /* let arrayIgual = JSON.parse(localStorage.getItem('productos'));

    arrayIgual.filter(item => {
        arrayIgual.id != '5f205432bf2ede0017e48508'
    })

    console.log(arrayIgual) */


}

const pintarCarrito = () => {
    console.log(carrito)
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.nombre
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.boton-uno').dataset.id = producto.id
        templateCarrito.querySelector('.boton-dos').dataset.id = producto.id
        console.log(templateCarrito.querySelector('.boton-dos').dataset.id = producto.id)
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio


        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })

    items.appendChild(fragment)

    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarFooter = () => {
    footer.innerHTML = ''
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }

    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })
}

const btnAccion = e => {
    //Accion de aumentar el numero de productos en el carrito
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
            carrito[e.target.dataset.id] = {...producto }
        pintarCarrito()
    }


    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
            if (producto.cantidad === 0) {
                delete carrito[e.target.dataset.id]
            }
        pintarCarrito()


    }



    e.stopPropagation()
}