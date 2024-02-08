------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Bienvenidos a PeriFerals. Un proyecto de escaparate virtual sobre periféricos gaming.
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


Esta sencilla web es fácil e intuitiva, por lo que no resultará difícil navegar a través de ella.
Para empezar, tenemos el árbol de directorio en el que he dividido el contenido de la página por tipo y la carpeta Gant donde se ubica el archivo que contiene la planificación de este proyecto.
En CSS tendremos el archivo con todos los estilos de la página y sus animaciones.
En la carpeta JS se ubica el fichero del script, con el funcionamiento de cada ítem de la página.
La información de los periféricos y de los usuarios se encuentran en la carpeta JSON, ya que ambos son archivos de ese tipo.
En media tendremos el logo de la página, realizado por mi pareja y la canción de fondo que he sacado de https://pixabay.com/music/synthwave-loading-main-menu-145077/ y agradezco desde aquí poder usarla en este proyecto.
Por último, fuera de carpetas, se encuentra el archivo Home.html y, por tanto, mi página.

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
USO:
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Abriendo la carpeta desde VSCode o similares, inicializaremos con Live Server para que todo cargue correctamente. Siendo la primera vez que visitamos la página, nos saltará el modal que nos informa de las cookies. La única manera de continuar en la página es aceptando todas las cookies,
lo que creará una cookie sin función alguna. La política es un "easter egg" o "huevo de pascua" que nos lleva a un gif de Google. Si decidimos pulsar "Sácame de aquí", nos llevará a la página principal de Google, para mantenernos a salvo.
A continuación, nos solicitará permiso de notificaciones, que, si aceptamos, nos dará la bienvenida a la página.
Podremos echar un ojo a toda la web, ya que cualquier usuario visualiza el mismo contenido. Tendremos el nav con el logo y el nombre que, al clicar, nos mandará a esta misma página (Redirige a Home.html), la barra de búsqueda en vivo que, tanto si usas el reconocimiento de voz
(pulsando el icono de micrófono y aceptando los permisos) o si escribes normalmente, buscará por nombre o categoría en el archivo JSON y cargará el contenido acorde a lo que estamos buscando. He decidido omitir el icono de la lupa ya que la búsqueda se realiza al momento que escribes o terminas de dictar por voz y sería inútil.
Ejemplos de búsqueda: Razer, Logitech, monitor, ratón, teclado...
El icono de la casa tiene la misma función que el logo, redirigir a Home.html. El icono de usuario te abre un modal para que puedas tanto iniciar sesión como registrarte (Más adelante explicaré el funcionamiento) y el carrito de la compra que se mostrará vacío si no tiene ningún artículo.

Tenemos una especie de banner antes del carousel que nos indica que éste contiene ofertas y, sin botón, te anima a que uses la barra de búsqueda y pruebes el reconocimiento de voz o puedas buscarlo en las cards. Hay tres artículos en el carousel y son los únicos con descuento.
Las cards muestran el nombre, la descripción, el precio; todo esto sacado de Periféricos.json, y un botón para añadir al carrito que solo funciona si hay una sesión iniciada. En su defecto, mostrará un alert informándote al respecto.
En el footer están las redes sociales como forma de contacto, de nuevo, logo y nombre de la página y el contenido relacionado con la página, ya sea aviso legal, privacidad del sitio, etcétera, que redirigen a Home.html.
De fondo suena la pista de audio que he mencionado anteriormente y he decidido ocultar los controles de audio debido a que no compaginaba con la página. Está en autoplay y con volumen 0.5.

Los iconos del banner y las cards tienen una animación con eftecto de acercarse, exceptuando el icono del micrófono, que cambia de color cuando se pasa por encima, indicando una interacción especial.
La barra de búsqueda tiene un efecto luz, que aparece apagada hasta que la clicas y se ilumina, pero se vuelve a apagar cuando clicas en cualquier otro lado de la página.
El banner de ofertas tiene text shadow y un borde que cambia de color con keyframes.
El carousel es de bootstrap al que le he añadido manualmente los productos rebajados de mi JSON, tachando el precio anterior y marcándolo en rojo para darle más visibilidad, lo que es igual en las cards pero con el añadido de "¡OFERTA!" única y exclusivamente en los artículos que corresponde.

Los botones de las redes sociales en el footer tienen una animación de giro hacia delante y hacia atrás y abren una nueva ventana con la página principal de cada una de las redes.

Para continuar con las funcionalidades de la página, tendremos que iniciar sesión dándole al icono de usuario ubicado en el nav. Esto abre un modal en el que nos mostrará un par de inputs donde escribiremos el nombre de usuario y la contraseña. Si no coindice, saltará un error en forma
de alert, ya que el popover hacía conflicto con el modal y, según he visto, aún no se ha solucionado ese bug ni tocando el z-index.
Los usuarios son los siguientes:

Usuario 1:
Nombre: jorge
Contraseña: 1234

Usuario 2:
Nombre: nydeth
Contraseña: 2323

Usuario 3:
Nombre: susana
Contraseña: palomeras

También podemos registrarnos con un nuevo usuario que no se encuentre en el JSON, siempre y cuando no coincida el nombre con ninguno de los usuarios y se cumplan las condiciones de las expresiones regulares, que para el nombre de usuario asegura que el nombre de usuario consista en
caracteres alfanuméricos, guiones bajos y guiones, y que tenga una longitud mínima de 3 caracteres y máxima de 16 caracteres. Para la contraseña garantiza que la contraseña cumpla con los siguientes requisitos:
Al menos una letra minúscula.
Al menos una letra mayúscula.
Al menos un dígito.
Al menos 8 caracteres en total.

Esto no aplica nada más que para el registro de nuevos usuarios y que se haga menos tedioso a la hora de hacer pruebas en la página con los usuarios creados del JSON.

Si optamos por registrarnos con éxito, bastará con escribir en los mismos campos tu nombre de usuario y contraseña, como si fueras a iniciar sesión normalmente, pero dándole a registro en su lugar. Esto creará dos ítems en local storage con el nombre y la contraseña, guardando así los datos
por si quiere iniciar sesión en un futuro. También funciona con los artículos añadidos al carrito, ya que funciona por usuario y, al cerrar, se queda el carrito vacío pero se guarda la información. Al iniciar sesión, simplemente se queda registrado como que la sesión se ha iniciado y una 
notificación nos da la bienvenida con nuestro nombre de usuario y la ciudad en la que se ha conectado, gracias a la API de Maps de Google y la forma en la que, dando latitud y longitud, nos da la ciudad. En esta notificación también aparece el logo de la página.

Ahora podemos añadir al carrito los artículos que queramos, mostrando un popover confirmando que has añadido el producto y apareciendo una burbuja con un número en el icono del carrito que llevará la informacón de los artículos como la imagen, el nombre y la cantidad. Hay unos botones para añadir o restar unidades y también para eliminar directamente del carrito,
independientemente de la cantidad de artículos de ese producto. Sería fácil añadir un botón de comprar que llevara a la pasarela de pagos, pero he decidido dejarlo de esta forma.

Para cerrar sesión, bastará con volver a ubicarnos en el nav y, donde antes estaba el icono de usuario, ahora aparecerá el icono de ON, que cerrará nuestra sesión y refrescará la página.

Este es el funcionamiento básico de la página web PeriFerals.
