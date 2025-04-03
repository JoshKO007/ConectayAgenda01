// Obtener el botón de cambio de tema y el body
const themeToggleButton = document.getElementById('theme-toggle');
const body = document.body;

// Cambiar entre tema claro y oscuro cuando se haga clic
themeToggleButton.addEventListener('click', () => {
    body.classList.toggle('light-theme'); // Alternar la clase para cambiar el tema
});
