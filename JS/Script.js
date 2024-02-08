// Declaración de variables y constantes:

const url = 'JSON/Perifericos.json';
let productos;
var logueado = false;
var modal = document.getElementById('formLogin');
var cookiePassword;

// Funciones de inicialización:

document.addEventListener('DOMContentLoaded', function() {
  iniciar();

  const username = sessionStorage.getItem('username');

  Notification.requestPermission();
  if (Notification.permission == 'granted') {
    obtenerUbicacion();
  }
  if (username) {
    cambiarBotonCerrarSesion();
  }

  var cards = document.querySelectorAll('.producto-card');

  cards.forEach(function(card) {
    card.addEventListener('mouseover', function() {
      card.classList.add('hovered');
    });

    card.addEventListener('mouseout', function() {
      card.classList.remove('hovered');
    });
  });

  buscarProductos();

  document.getElementById('cart-link').addEventListener('click', function() {
    mostrarContenidoCarrito();
  });
});

async function obtenerDatos() {
  try {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      throw new Error('Error al obtener los datos');
    }

    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error('Hubo un error:', error.message);
  }
}

async function iniciar() {
  try {
    productos = await obtenerDatos();
    cargarCarousel(productos);
    cargarCards(productos);
    var audio = document.getElementById("musicaBG");
    
    audio.volume = 0.5;

    if (hayCookies()) {
      ocultarCookies();
    }
    mostrarContenidoCarrito();
  } catch (error) {
    console.error('Hubo un error al iniciar:', error.message);
  }
}

// Funciones relacionadas con la generación de las cards:

function cargarCards(productos) {
  var cards = document.getElementById("cards");
  cards.innerHTML = '';

  productos.forEach(function(datos) {
    var precioSubido;
    var linea = "";
    if (datos.id == "3") {
      precioSubido = datos.precio + 20;
      linea = `<span id="precioTachado"> ${precioSubido} €<span class="badge">¡OFERTA!</span>
`;
    } else if (datos.id === "17") {
      precioSubido = datos.precio + 50;
      linea = `<span id="precioTachado"> ${precioSubido} €<span class="badge">¡OFERTA!</span>
`;
    } else if (datos.id == "30") {
      precioSubido = datos.precio + 10;
      linea = `<span id="precioTachado"> ${precioSubido} €<span class="badge">¡OFERTA!</span>
`;
    } else {
    precioSubido = datos.precio;
    }
    var cardHTML = `
      <div class="col">
        <div class="card mb-3 h-100 producto-card">
          <img src="${datos.imagen}" class="card-img-top img-fluid rounded mx-auto  object-fit-cover" alt="${datos.nombre}">
          <div class="card-body">
            <h5 class="card-title">${datos.nombre}</h5>
            <p class="card-text">${datos.descripcion}</p>
            <p class="card-text precioCard">${datos.precio} € ${linea}</p>
          </div>
          <button id="btnAdd${datos.id}" class="btn btn-success mb-3 add" onclick="ponerEnCarrito(${datos.id}, 1)" data-bs-toggle="popover" data-bs-placement="top" data-bs-content="Producto añadido al carrito">Añadir</button>
          </div>
      </div>
    `;

    cards.innerHTML += cardHTML;
  });
}

// Función de generación del carousel:

async function cargarCarousel(productos) {
  var carouselInner = document.querySelector('.carousel-inner');  
  var producto3 = productos.find(datos => datos.id === "3");
  var producto17 = productos.find(datos => datos.id === "17");
  var producto30 = productos.find(datos => datos.id === "20");

  var precioSubido3 = producto3.precio + 20;
  var precioSubido17 = producto17.precio + 50;
  var precioSubido30 = producto30.precio + 10;

  if (!producto3 || !producto30 || !producto17) {
    console.warn('No se encontraron productos con los IDs especificados.');
    return;
  }

  var slidesHTML = `
    <div class="carousel-item active">
      <img src="${producto3.imagen}" class="d-block w-100" alt="${producto3.nombre}">
      <div class="carousel-caption d-none d-md-block">
        <h5>${producto3.nombre}</h5>
        <p>${producto3.precio} € <span id="precioTachado">${precioSubido3} €</span></p>
      </div>
    </div>
    <div class="carousel-item">
      <img src="${producto30.imagen}" class="d-block w-100" alt="${producto30.nombre}">
      <div class="carousel-caption d-none d-md-block">
        <h5>${producto30.nombre}</h5>
        <p>${producto30.precio} € <span id="precioTachado"> ${precioSubido30} €</span></p>
      </div>
    </div>
    <div class="carousel-item">
      <img src="${producto17.imagen}" class="d-block w-100" alt="${producto17.nombre}">
      <div class="carousel-caption d-none d-md-block">
        <h5>${producto17.nombre}</h5>
        <p>${producto17.precio} € <span id="precioTachado">${precioSubido17 }€</span></p>
      </div>
    </div>
  `;

  carouselInner.innerHTML = slidesHTML;
}

function cerrarVentana() {
  window.location.href = "http://www.google.es";
}

function goHome() {
  window.location.href = "/Home.html";
}

// Funciones relacionadas con la búsqueda de productos:

function buscarProductos() {
  const input = document.getElementById('example-search-input2');
  const query = quitarAcentos(input.value.toLowerCase());

  const productosFiltrados = productos.filter(producto => {
      const titulo = quitarAcentos(producto.nombre.toLowerCase());
      const categoria = quitarAcentos(producto.categoria.toLowerCase());

      return titulo.includes(query) || categoria.includes(query);
  });

  const cards = document.getElementById('cards');
  const carousel = document.getElementById('carouselExampleCaptions');

  cards.innerHTML = '';

  if (productosFiltrados.length === 0) {
      cards.innerHTML = '<p>Su búsqueda no coincide con ninguno de nuestros artículos.</p>';
  } else {
      cargarCards(productosFiltrados);
      carousel.style.display = 'none';
  }

  if (query  === "") {
    carousel.style.display = 'block';
  }
}

function activarReconocimientoVoz() {
  const rec = new webkitSpeechRecognition() || new SpeechRecognition();
  
  rec.lang = 'es-ES';

  rec.onresult = function (event) {
      const transcript = event.results[0][0].transcript;
      var nuevotext = limpiarTexto(transcript);
      document.getElementById('example-search-input2').value = nuevotext;
      buscarProductos();
  };

  rec.onerror = function (event) {
      console.error('Error en el reconocimiento de voz:', event.error);
  };

  rec.start();
}

function limpiarTexto(texto) {
  return texto.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\[\]\\]/g, "").trim();
}

function quitarAcentos(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
// Funciones relacionadas con los usuarios:

const usuariosURL = 'JSON/Usuarios.json';

async function cargarUsuarios() {
  const res = await fetch(usuariosURL);
  const usuarios = await res.json();
  return usuarios;
}

async function usuarioExiste(username) {
  const usuarios = await cargarUsuarios();
  return usuarios.some(user => user.nombre === username);
}

// Funciones relacionadas con las cookies:

function ocultarCookies() {
  document.getElementById('simple-cookie-consent').style.display = 'none';
}

function permitirCookies() {
  establecerCookie('cookie', 'permitido', 30);
  ocultarCookies();
}

function hayCookies() {
  return document.cookie.indexOf('cookie=permitido') !== -1;
}

function establecerCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

function crearCookie(nombre, valor) {
  document.cookie = `${nombre}=${valor}; path=/`;
}

function obtenerCookie(nombre) {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [cookieNombre, cookieValor] = cookie.split('=');
    if (cookieNombre === nombre) {
      return cookieValor;
    }
  }
  return null;
}

function eliminarCookie(nombre) {
  document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// Funciones relacionadas con el inicio de sesión y registro:

async function iniciarSesion() {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  const usuarios = await cargarUsuarios();

  const usuarioEncontrado = usuarios.find(user => user.nombre === username && user.password === password);

  if (usuarioEncontrado) {
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('loggedIn', 'true');
    cerrarModal();
    cambiarBotonCerrarSesion();
    notificacionLogueo(username);
    logueado = true;
    mostrarContenidoCarrito();
    return;
  }

  const storedUsername = localStorage.getItem('usernameR');
  const storedPassword = localStorage.getItem('passwordR');

  if (storedUsername === username && storedPassword === password) {
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('loggedIn', 'true');
    cerrarModal();
    cambiarBotonCerrarSesion();
    notificacionLogueo(username);
    logueado = true;
  } else {
    alert("Usuario y/o contraseña incorrectos");
  }
}

function cerrarSesion() {
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('loggedIn');
  if (obtenerCookie(cookiePassword)) {
    eliminarCookie(cookiePassword);
  }
  cambiarBotonIniciarSesion();
  logueado = false;
  localStorage.removeItem('notificacionMostrada');
  location.reload()
  mostrarContenidoCarrito();
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function cerrarModal() {
  document.getElementById('formLogin').style.display = 'none';
}

function visualizacionPassword() {
  var password = document.getElementById('loginPassword');
  var iconos = document.getElementById('visualizacionPassword');

  if (password.type === 'password') {
    password.type = 'text';
    iconos.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">
    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
    <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
  </svg>`;
  } else {
    password.type = 'password';
    iconos.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
  </svg>`;
  }
}

function guardarPasswordCookie(password) {
  cookiePassword = password;
  return cookiePassword;
}

function cambiarBotonIniciarSesion() {
  const userBtn = document.getElementById('userBtn');
  userBtn.setAttribute('onclick', "document.getElementById('formLogin').style.display='block'");
  userBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person" id="userBtn" viewBox="0 0 16 16">
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
      </svg>`;
}


function logueo() {
  const formLogin = document.getElementById('formLogin');
  const isLoggedIn = sessionStorage.getItem('loggedIn');

  if (formLogin.style.display === 'block' || isLoggedIn === 'true') {
      cerrarSesion();
  } else {
      formLogin.style.display = 'block';
  }
}

function cambiarBotonCerrarSesion() {
  const userBtn = document.getElementById('userBtn');
  userBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-power" viewBox="0 0 16 16" onclick="cerrarSesion()">
      <path d="M7.5 1v7h1V1z"/>
      <path d="M3 8.812a5 5 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812"/>
    </svg>`;
}

async function registro() {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

  if (!usernameRegex.test(username)) {
    alert("El nombre de usuario debe tener entre 3 y 16 caracteres y solo puede contener letras, números, guiones bajos y guiones medios.");
    return;
  }

  if (!passwordRegex.test(password)) {
    alert("La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra mayúscula, una letra minúscula y un dígito.");
    return;
  }

  const usuarios = await cargarUsuarios();
  const usuarioEncontrado = usuarios.find(user => user.nombre === username);

  if (usuarioEncontrado) {
    alert("Ya hay un usuario con ese nombre, por favor, elija otro.");
    return;
  }

  let totalUsuarios = parseInt(localStorage.getItem('totalUsuarios') || '2');
  totalUsuarios++;
  localStorage.setItem('totalUsuarios', totalUsuarios);

  localStorage.setItem(`username_${totalUsuarios}`, username);
  localStorage.setItem(`password_${totalUsuarios}`, password);

  guardarPasswordCookie(password);
  sessionStorage.setItem('loggedIn', 'true');
  cerrarModal();
  cambiarBotonCerrarSesion();
  notificacionLogueo(username);
  logueado = true;
  mostrarContenidoCarrito();
}

// Funciones relacionadas a la ubicación y notificaciones:

function obtenerUbicacion() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(mostrarUbicacion, errorUbicacion);
  } else {
    console.error("La geolocalización no está disponible en este navegador.");
  }
}

function mostrarUbicacion(posicion) {
  const latitud = posicion.coords.latitude;
  const longitud = posicion.coords.longitude;

  obtenerCiudad(latitud, longitud);
}

function errorUbicacion(error) {
  console.error("Error al obtener la ubicación:", error.message);
}

function notificacionLogueo(username, city) {
  const isLoggedIn = sessionStorage.getItem('loggedIn');
  const notificacionMostrada = localStorage.getItem('notificacionMostrada');

  if (isLoggedIn === 'true' && Notification.permission == 'granted' && !notificacionMostrada) {
    notificacion = new Notification('PeriFerals', {
      icon: 'Media/Logo.png',
      body: `¡Bienvenid@, ${username}! Estás accediendo desde ${city}`
    });

    localStorage.setItem('notificacionMostrada', 'true');
  }
}

function obtenerCiudad(latitud, longitud) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitud},${longitud}&key=AIzaSyBePCjiSsvPjjDb8yv8LoumCeyLtxd5VfY`;

  fetch(url)
    .then(res => res.json())
    .then(datos => {
      if (datos.status === 'OK' && datos.results.length > 0) {
        const direccion = datos.results[0].address_components;
        const ciudad = direccion.find(component => component.types.includes('locality'));
        const city = ciudad ? ciudad.long_name : 'No se pudo obtener la ciudad';

        mostrarNotificacion(city, sessionStorage.getItem('username'));
      } else {
        console.error('No se pudieron obtener datos de ubicación.');
      }
    })
    .catch(error => {
      console.error('Error al obtener datos de ubicación:', error);
    });
}

function mostrarNotificacion(city, username) {
  if (!obtenerCookie('cookie') && Notification.permission === 'granted') {
    notificacion = new Notification('PeriFerals', {
      icon: 'Media/Logo.png',
      body: `¡Bienvenid@ a nuestra web! Estás accediendo desde ${city}`
    });
    notificacionLogueo(username, city);
  }
}

// Funciones relacionadas con el carrito:

function guardarCarrito(carrito) {
  const username = sessionStorage.getItem('username');
  localStorage.setItem(`${username}_carrito`, JSON.stringify(carrito));
}

function obtenerCarrito() {
  const username = sessionStorage.getItem('username');
  const carrito = localStorage.getItem(`${username}_carrito`);
  return carrito ? JSON.parse(carrito) : [];
}

function agregarAlCarrito(producto) {
  const carrito = obtenerCarrito();
  carrito.push(producto);
  guardarCarrito(carrito);
  mostrarContenidoCarrito();
  console.log('Producto añadido al carrito:', producto);

  const btn = document.getElementById(`btnAdd${producto.id}`);
  $(btn).popover({
    trigger: 'manual',
    content: 'Producto añadido al carrito',
    placement: 'top'
  });
  $(btn).popover('show');

  setTimeout(() => {
    $(btn).popover('hide');
  }, 2000);
}


function ponerEnCarrito(idProducto, cantidadProducto) {
  if (logueado) {
    const producto = productos.find(producto => producto.id === idProducto.toString());
    if (producto) {
      agregarAlCarrito({ id: producto.id, cantidad: cantidadProducto });
      console.log('Producto añadido al carrito:', producto);
    } else {
      console.error('Producto no encontrado');
    }
  } else {
    alert('Para añadir artículos al carrito, necesitas iniciar sesión.');
  }
}

function mostrarCarrito() {
  const carrito = obtenerCarrito();
  console.log('Carrito de compras:', carrito);
}

document.getElementById('cart-link').addEventListener('click', function() {
  var myModal = new bootstrap.Modal(document.querySelector('.bd-example-modal-lg'));
  myModal.show();
});

function mostrarContenidoCarrito() {
  const carrito = obtenerCarrito();
  const modalBody = document.querySelector('.modal-body.modalCarrito');
  const contador = document.querySelector('.badge-success');

  if (carrito.length === 0) {
    modalBody.innerHTML = '<p>El carrito de la compra está vacío.</p>';
  } else {
    let contenidoHTML = '<ul class="list-group">';
    let totalArticulos = 0;
    let precioTotal = 0;
    let carritoProductos = {};

    carrito.forEach(item => {
      const producto = productos.find(producto => producto.id === item.id);

      if (carritoProductos[item.id]) {
        carritoProductos[item.id].cantidad += item.cantidad;
        carritoProductos[item.id].precioTotal += item.cantidad * producto.precio;
      } else {
        carritoProductos[item.id] = {
          producto: producto,
          cantidad: item.cantidad,
          precioTotal: item.cantidad * producto.precio
        };
      }

      totalArticulos += item.cantidad;
      precioTotal += item.cantidad * producto.precio;
    });

    for (const itemId in carritoProductos) {
      if (carritoProductos.hasOwnProperty(itemId)) {
        const item = carritoProductos[itemId];
        contenidoHTML += `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
              <img src="${item.producto.imagen}" alt="${item.producto.nombre}" class="me-3" style="max-width: 80px;">
              <div>
                <h6 class="mb-0">${item.producto.nombre}</h6>
              </div>
            </div>
            <span class="mb-0 me-2">${item.cantidad}</span>
            <div class="d-flex align-items-center"><button class="btn btn-outline-secondary btn-sm me-2" onclick="disminuirCantidad(${item.producto.id})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
          </svg></button>
              <span class="me-2">${item.precioTotal.toFixed(2)} €</span>
              <button class="btn btn-outline-info btn-sm me-2" onclick="aumentarCantidad(${item.producto.id})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
            </svg></button>
              
              <button class="btn btn-outline-danger" onclick="eliminarDelCarrito(${item.producto.id})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
            </svg></button>
            </div>
          </li>`;
      }
    }

    contenidoHTML += '</ul>';

    contenidoHTML += `<div class="mt-3">Precio Total: ${precioTotal.toFixed(2)} €</div>`;

    modalBody.innerHTML = contenidoHTML;

    contador.textContent = totalArticulos;
  }
}

function aumentarCantidad(idProducto) {
  const carrito = obtenerCarrito();
  const index = carrito.findIndex(item => item.id === idProducto.toString());
  if (index !== -1) {
    carrito[index].cantidad++;
    guardarCarrito(carrito);
    mostrarContenidoCarrito();
  }
}

function disminuirCantidad(idProducto) {
  const carrito = obtenerCarrito();
  const index = carrito.findIndex(item => item.id === idProducto.toString());
  if (index !== -1) {
    carrito[index].cantidad--;
    if (carrito[index].cantidad <= 0) {
      carrito.splice(index, 1);
    }
    guardarCarrito(carrito);
    mostrarContenidoCarrito();
  }
}

function agregarAlCarrito(producto) {
  const carrito = obtenerCarrito();
  carrito.push(producto);
  guardarCarrito(carrito);
  mostrarContenidoCarrito();
  console.log('Producto añadido al carrito:', producto);
  mostrarContenidoCarrito();
}

function eliminarDelCarrito(idProducto) {
  const carrito = obtenerCarrito();
  const nuevoCarrito = carrito.filter(item => item.id !== idProducto.toString());
  guardarCarrito(nuevoCarrito);
  mostrarContenidoCarrito();
}

document.getElementById('cart-link').addEventListener('click', function() {
  mostrarContenidoCarrito();
});