const menuItems = document.querySelectorAll('.menu-items li');
const hamburguesa = document.querySelector('.menu-hamburguesa');
const menuDesplegable = document.querySelector('.menu-desplegable');
const iconoUsuario = document.querySelector('.user-icon');  // Añadido

function ajustarMenu() {
    menuItems.forEach(li => li.classList.remove('oculto'));
    menuDesplegable.innerHTML = ''; // Limpiar el menú desplegable
    hamburguesa.style.display = 'none'; // Ocultar hamburguesa al principio

    const anchoMenu = document.querySelector('.menu').offsetWidth;
    const anchoHamburguesa = hamburguesa.offsetWidth + 20;
    const anchoIconoUsuario = iconoUsuario.offsetWidth + 20; // Calculamos el ancho del icono de usuario
    let anchoDisponible = anchoMenu - anchoHamburguesa - anchoIconoUsuario - 60; // Restamos el ancho del icono de usuario

    let usados = 0;
    let ocultos = [];

    menuItems.forEach(li => {
        usados += li.offsetWidth + 20;

        // Si el espacio usado excede el disponible, ocultamos el item
        if (usados > anchoDisponible) {
            ocultos.push(li);
            li.classList.add('oculto');
        }
    });

    // Si hay elementos ocultos, mostramos la hamburguesa
    if (ocultos.length > 0) {
        hamburguesa.style.display = 'flex';
        ocultos.forEach(li => {
            const clon = li.cloneNode(true);
            clon.classList.remove('oculto');
            menuDesplegable.appendChild(clon); // Agregar al menú desplegable
        });
    }
}

// Ajustar el menú al cargar la página o cambiar el tamaño de la ventana
window.addEventListener('resize', ajustarMenu);
window.addEventListener('DOMContentLoaded', ajustarMenu);

// Toggle para mostrar/ocultar el menú desplegable con el clic en el icono hamburguesa
hamburguesa.addEventListener('click', (event) => {
    event.stopPropagation(); // Evitar que el clic en la hamburguesa cierre el menú
    menuDesplegable.classList.toggle('activo');
});

// Cerrar el menú si se hace clic en cualquier parte de la pantalla
document.addEventListener('click', (event) => {
    if (menuDesplegable.classList.contains('activo') && !hamburguesa.contains(event.target) && !menuDesplegable.contains(event.target)) {
        menuDesplegable.classList.remove('activo');
    }
});