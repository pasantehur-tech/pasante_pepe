document.addEventListener('DOMContentLoaded', function() {
    const patronDiv = document.getElementById('patronTexto');
    if (!patronDiv) return;

    const palabras = [
        'ubic', 'cubic', 'ugubic', 'umebubic', 'dubic', 
        'ticoubic', 'uevicubic', 'bunice', 'useful', 'Granda', 
        'Grandma', 'Commento', 'cumanoga', 'greenugogue'
    ];
    
    let resultado = '';
    
    for (let i = 0; i < 150; i++) {
        let linea = '';
        let repeticiones = Math.floor(Math.random() * 30) + 10;
        
        for (let j = 0; j < repeticiones; j++) {
            let palabraAleatoria = palabras[Math.floor(Math.random() * palabras.length)];
            linea += palabraAleatoria;
            if (Math.random() > 0.3) {
                linea += ' ';
            }
        }
        resultado += linea + '\n';
    }
    
    patronDiv.textContent = resultado;
});

// =======================================================================
// LÓGICA CON VISTA PREVIA EN VIVO Y REGULADOR DE TAMAÑO
// =======================================================================

document.addEventListener('DOMContentLoaded', function() {
    const btnGenerarPunto = document.getElementById('btnGenerarPunto');
    const txtIndicador = document.getElementById('txtIndicador');
    const colorIndicador = document.getElementById('colorIndicador');
    const tamanoIndicador = document.getElementById('tamanoIndicador');
    const previewCirculo = document.getElementById('previewCirculo');

    if (!btnGenerarPunto || !previewCirculo) return;

    // Cambiar color inmediato en vista previa
    colorIndicador.addEventListener('input', () => {
        previewCirculo.style.backgroundColor = colorIndicador.value;
    });

    // Cambiar tamaño inmediato en vista previa
    tamanoIndicador.addEventListener('input', () => {
        const diametro = `${tamanoIndicador.value}px`;
        previewCirculo.style.width = diametro;
        previewCirculo.style.height = diametro;
    });

    // Crear el pin en el plano al hacer click
    btnGenerarPunto.addEventListener('click', () => {
        const texto = txtIndicador.value.trim();
        const color = colorIndicador.value;
        const tamano = tamanoIndicador.value; 
        const imgPlano = document.getElementById('vista-plano');
        const targetImagen = document.getElementById('contenedor-pines-target');

        if (texto === "") {
            alert("Por favor, ingresa un texto identificador para el pin.");
            return;
        }

        if (!imgPlano || imgPlano.style.display === 'none' || imgPlano.src === "") {
            alert("Por favor, primero carga una imagen con el botón 'Agregar planos'.");
            return;
        }

        if (!targetImagen) {
            alert("Error: No se encontró el contenedor '#contenedor-pines-target' en tu HTML.");
            return;
        }

        // 1. Crear el envoltorio del Pin
        const marcador = document.createElement('div');
        marcador.classList.add('punto-marcador');
        marcador.style.left = "50%";
        marcador.style.top = "50%";

        // 2. Crear texto
        const divTexto = document.createElement('div');
        divTexto.classList.add('punto-texto');
        divTexto.innerText = texto;

        // 3. Crear la bolita
        const divCirculo = document.createElement('div');
        divCirculo.classList.add('punto-circulo');
        divCirculo.style.backgroundColor = color;
        divCirculo.style.width = `${tamano}px`;  
        divCirculo.style.height = `${tamano}px`; 

        marcador.appendChild(divTexto);
        marcador.appendChild(divCirculo);
        
        // 4. Insertar el marcador dentro de la caja de la imagen
        targetImagen.appendChild(marcador); 

        // 5. Activar arrastre limitado al tamaño de la imagen
        activarArrastrar(marcador, imgPlano);
    });
});

function activarArrastrar(elemento, componenteReferencia) {
    let moviendose = false;

    elemento.addEventListener('mousedown', (e) => {
        moviendose = true;
        elemento.style.zIndex = 1000; 
    });

    document.addEventListener('mousemove', (e) => {
        if (!moviendose) return; 

        const limitesContenedor = componenteReferencia.getBoundingClientRect();
        const limitesPadre = elemento.parentElement.getBoundingClientRect();

        let posX = e.clientX - limitesPadre.left;
        let posY = e.clientY - limitesPadre.top;

        let minX = limitesContenedor.left - limitesPadre.left;
        let maxX = minX + limitesContenedor.width;
        let minY = limitesContenedor.top - limitesPadre.top;
        let maxY = minY + limitesContenedor.height;

        if (posX < minX) posX = minX;
        if (posX > maxX) posX = maxX;
        if (posY < minY) posY = minY;
        if (posY > maxY) posY = maxY;

        elemento.style.left = `${posX}px`;
        elemento.style.top = `${posY}px`;
    });

    document.addEventListener('mouseup', () => {
        if (moviendose) {
            moviendose = false;
            elemento.style.zIndex = 100; 
        }
    });
}
// Variable global que guarda la posición de la foto visible. 0 es la primera, 1 la segunda, etc.
let indiceActual = 0; 

// Declaramos la función. 'direccion' recibirá un 1 (avanzar) o un -1 (retroceder) según el botón pulsado.
function cambiarFoto(direccion) {
    
    // Guardamos en una lista (Array) todas las imágenes que tengan la clase '.foto'
    const fotos = document.querySelectorAll('.foto');
    
    // Buscamos la foto que se ve actualmente (usando el índice) y le borramos la clase 'active' para ocultarla
    fotos[indiceActual].classList.remove('active');

    // Sumamos o restamos 1 al índice actual (por ejemplo, si estaba en 0 y sumamos 1, pasa a ser 1)
    indiceActual += direccion;

    // CONTROL 1: Si el usuario avanzó más allá de la última foto de la lista...
    if (indiceActual >= fotos.length) {
        indiceActual = 0; // ...lo reseteamos a 0 para que vuelva a mostrarse la primera foto.
        
    // CONTROL 2: Si el usuario retrocedió más atrás de la primera foto (índice menor a 0)...
    } else if (indiceActual < 0) {
        indiceActual = fotos.length - 1; // ...lo mandamos directamente a la posición de la última foto.
    }

    // Buscamos la nueva foto seleccionada en la lista y le agregamos la clase 'active' para que el CSS la muestre
    fotos[indiceActual].classList.add('active');
}
