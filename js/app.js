//Variables
const cursos = document.getElementById('lista-cursos');
const listaCarrito = document.querySelector('#lista-carrito tbody');
const carrito = document.querySelector('#carrito');
const vaciar_carrito = document.querySelector('#vaciar-carrito');

class Operations {
    constructor(items){
        this.items = items;
    }
    add(item){}
    delete(item){}
    readAll(){return this.items;}
    deleteAll(){
        this.items = []; 
        return this.items
    }
}

class CursoDOMOperations extends Operations{
    constructor(listaCarrito){
        super(listaCarrito);
    }

    add(item){
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${item.imagen}">
            </td>
            <td>
                ${item.titulo}
            </td>
            <td>
                ${item.precio}
            </td>
            <td>
                <a href="#" class="borrar-curso" data-id="${item.id}">X</a>
            </td>
        `;
        this.items.appendChild(row);
    }

    delete(item){
        item.remove();
    }

    deleteAll(){
        while(this.items.firstChild){
            this.items.firstChild.remove();
        }
    }
}

class CursoLocalStorageOperations extends Operations{
    constructor(listaCarrito){
        super(listaCarrito);
    }

    add(item){
        const cursos = this.readAll();
        cursos.push(item);
        localStorage.setItem('cursos', JSON.stringify(cursos));
    }

    delete(curso){
        const id = curso.querySelector('a').getAttribute('data-id');
        const cursos = this.readAll();
        const newCursos = cursos.filter(curso => curso.id != id);
        localStorage.setItem('cursos', JSON.stringify(newCursos));
    }

    readAll(){
        this.items = [];

        if (localStorage.getItem('cursos') === null) {
            this.items = [];
        } else {
            this.items = JSON.parse(localStorage.getItem('cursos'))
        }

        return this.items;
    }

    deleteAll(){
        let cursos = this.readAll();
        cursos = [];
        localStorage.setItem('cursos', JSON.stringify(cursos));
    }
}

class CRUD{

    getWriters(){}

    add(item){
        this.writers = this.getWriters();
        for (const writer of this.writers) {
            writer.add(item);
        }
    }
    delete(item){
        this.writers = this.getWriters();
        for (const writer of this.writers) {
            writer.delete(item);
        }
    }
    deleteAll(){
        this.writers = this.getWriters();
        for (const writer of this.writers) {
            writer.deleteAll();
        }
    }
}

class LocalStorageAndDOM extends CRUD{
    getWriters(){
        return [
            new CursoDOMOperations(listaCarrito),
            new CursoLocalStorageOperations(obtenerLocalStorage())
        ]
    }
}

const cursoDOMOperations = new CursoDOMOperations(listaCarrito);
// const cursoLocalStorageOperations = new CursoLocalStorageOperations(obtenerLocalStorage());
const writerLocalStorageAndDOM = new LocalStorageAndDOM();


//Listeners
cargarListeners();

function cargarListeners(){
    cursos.addEventListener('click', comprarCurso);
    carrito.addEventListener('click', eliminarCurso);
    vaciar_carrito.addEventListener('click', vaciarCarrito);
    document.addEventListener('DOMContentLoaded', cargarCursosLocalStorage);
}

//Funciones

function comprarCurso(e){
    e.preventDefault();

    if(e.target.classList.contains('agregar-carrito')){
        curso = e.target.parentElement.parentElement;
        leerDatosCurso(curso);
    }
}

function leerDatosCurso(curso) {
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').innerText,
        id: curso.querySelector('a').getAttribute('data-id')
    }    

    insertarCarrito(infoCurso);
}

function insertarCarrito(curso) {
    // cursoDOMOperations.add(curso);
    // cursoLocalStorageOperations.add(curso);
    writerLocalStorageAndDOM.add(curso);
}

function eliminarCurso(e){
    e.preventDefault();

    if(e.target.classList.contains('borrar-curso')){
        const curso  = e.target.parentElement.parentElement;
        // cursoDOMOperations.delete(curso);
        // cursoLocalStorageOperations.delete(curso);

        writerLocalStorageAndDOM.delete(curso);
    }

}

function vaciarCarrito(e){
    e.preventDefault();
    // cursoDOMOperations.deleteAll();
    // cursoLocalStorageOperations.deleteAll();

    writerLocalStorageAndDOM.deleteAll(curso);
}

function cargarCursosLocalStorage() {
    const cursos = obtenerLocalStorage();
    for (const curso of cursos) {
        cursoDOMOperations.add(curso);
    }
}

function obtenerLocalStorage(){
    let cursos = [];

    if (localStorage.getItem('cursos') === null) {
        cursos = [];
    } else {
        cursos = JSON.parse(localStorage.getItem('cursos'))
    }

    return cursos;
}












