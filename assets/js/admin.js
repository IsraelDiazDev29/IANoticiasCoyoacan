/**
 * Archivo de scripts para funcionalidades de la barra de administración.
 * Realiza un fetch asíncrono a la URL del post para escanear sus imágenes, 
 * siendo así compatible tanto si se invoca desde el mismo post como desde el dashboard general (/admin).
 */

async function obtenerDatosInyectados(rutaMD, urlPost, titulo, autor, cover, ogImage, image) {
  const imagenes = new Set();

  if (cover && cover.trim() !== "") imagenes.add(cover);
  if (ogImage && ogImage.trim() !== "") imagenes.add(ogImage);
  if (image && image.trim() !== "") imagenes.add(image);

  try {
    if (urlPost && urlPost.trim() !== "") {
      const response = await fetch(urlPost);
      const htmlText = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, "text/html");

      const nodosDeImagen = doc.querySelectorAll('article img, .prose img');
      nodosDeImagen.forEach(img => {
        const src = img.getAttribute('src');
        if (src && src.trim() !== "") {
          imagenes.add(src);
        }
      });
    }
  } catch (err) {
    console.error("Error extrayendo imágenes del post:", err);
  }

  // Quitar el punto inicial de la ruta si existe (de "./src/..." a "/src/...")
  const cleanRutaMD = rutaMD.startsWith('.') ? rutaMD.substring(1) : rutaMD;

  // Combinar MD limpio y las imágenes (asegurando queinicien con src/ si son assets)
  const rutasImagenes = Array.from(imagenes).map(imgRuta => {
    let rutaLimpia = imgRuta.startsWith('/') ? imgRuta.substring(1) : imgRuta;
    rutaLimpia = rutaLimpia.startsWith('./') ? rutaLimpia.substring(2) : rutaLimpia;

    if (rutaLimpia.startsWith('assets/')) {
      return `/src/${rutaLimpia}`;
    }
    return imgRuta;
  });
  const todasLasRutas = [cleanRutaMD, ...rutasImagenes];

  // Objeto con la estructura solicitada
  return {
    nombre_commit: `${titulo} - ${autor}`,
    rutas: todasLasRutas
  };
}

function mostrarNotificacion(mensaje, tipo = "success") {
  // Remover notificación anterior si existe
  const existente = document.getElementById("admin-notificacion");
  if (existente) existente.remove();

  const notificacion = document.createElement("div");
  notificacion.id = "admin-notificacion";
  notificacion.innerText = mensaje;
  
  // Estilos básicos para que sea bonito (toast)
  Object.assign(notificacion.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "15px 25px",
    backgroundColor: tipo === "success" ? "#4CAF50" : "#F44336",
    color: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    fontFamily: "system-ui, sans-serif",
    fontSize: "16px",
    fontWeight: "bold",
    zIndex: "9999",
    opacity: "0",
    transform: "translateY(-20px)",
    transition: "all 0.3s ease-in-out"
  });

  document.body.appendChild(notificacion);

  // Animación de entrada
  setTimeout(() => {
    notificacion.style.opacity = "1";
    notificacion.style.transform = "translateY(0)";
  }, 10);

  // Ocultar y remover después
  setTimeout(() => {
    notificacion.style.opacity = "0";
    notificacion.style.transform = "translateY(-20px)";
    setTimeout(() => notificacion.remove(), 300);
  }, 4000);
}

async function enviarAPI(datos) {
  try {
    const respuesta = await fetch("https://api-orquestador-noticias-786930904274.europe-west1.run.app/api/publish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datos)
    });

    if (respuesta.ok) {
      mostrarNotificacion("✅ Noticia enviada y publicada correctamente.", "success");
    } else {
      const error = await respuesta.text();
      console.error("Error de la API:", error);
      mostrarNotificacion("❌ Error al enviar la noticia a la API.", "error");
    }
  } catch (error) {
    console.error("Error de conexión:", error);
    mostrarNotificacion("⚠️ Ocurrió un error de red al intentar conectarse.", "error");
  }
}

async function enviarFacebook(urlPost, titulo) {
  const urlCompleta = `https://noticiascdmxsur.online${urlPost.startsWith('/') ? urlPost : '/' + urlPost}`;
  try {
    const respuesta = await fetch("https://api-orquestador-noticias-786930904274.europe-west1.run.app/api/facebook/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: urlCompleta, message: titulo })
    });

    const json = await respuesta.json();

    if (respuesta.ok && json.status === "success") {
      mostrarNotificacion(`✅ Publicado en Facebook. Post ID: ${json.postId}`, "success");
    } else {
      const detalle = json.details ? ` (${json.details})` : "";
      mostrarNotificacion(`❌ Error al publicar en Facebook: ${json.message}${detalle}`, "error");
    }
  } catch (error) {
    console.error("Error de red al publicar en Facebook:", error);
    mostrarNotificacion("⚠️ Error de red al intentar publicar en Facebook.", "error");
  }
}

window.manejarPublicacion = async function (rutaMD, urlPost, titulo, autor, cover, ogImage, image) {
  const boton = event.currentTarget || event.target;
  const textoOriginal = boton.innerText;
  boton.innerText = "...";
  boton.disabled = true;

  const datos = await obtenerDatosInyectados(rutaMD, urlPost, titulo, autor, cover, ogImage, image);

  console.log("=== DATOS PARA PUBLICAR ===");
  console.log(datos);

  await enviarAPI(datos);
  boton.innerText = textoOriginal;
  boton.disabled = false;
  return datos;
};

window.manejarPublicacionProd = async function (rutaMD, urlPost, titulo, autor, cover, ogImage, image) {
  const boton = event.currentTarget || event.target;
  const textoOriginal = boton.innerText;
  boton.innerText = "...";
  boton.disabled = true;

  const datos = await obtenerDatosInyectados(rutaMD, urlPost, titulo, autor, cover, ogImage, image);

  console.log("=== DATOS PARA PUBLICAR A PROD ===");
  console.log(datos);

  await enviarFacebook(urlPost, titulo);

  boton.innerText = textoOriginal;
  boton.disabled = false;
  return datos;
};

// ==========================================
// AUTENTICACIÓN FIREBASE (ADMINISTRACIÓN)
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBdB9pX33iCRwRgdQ_2nyBhVrLSbBttszY",
  authDomain: "noticiascdmxsuronline.firebaseapp.com",
  projectId: "noticiascdmxsuronline",
  storageBucket: "noticiascdmxsuronline.firebasestorage.app",
  messagingSenderId: "791218041376",
  appId: "1:791218041376:web:3a04297728db2116228245",
  measurementId: "G-K7FDF8QBG8"
};

try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  // Escuchar cambios en la sesión
  onAuthStateChanged(auth, (user) => {
    const adminBar = document.getElementById('news-admin-bar');
    if (user) {
      // Usuario logueado: Mostramos la barra
      if (adminBar) adminBar.style.display = 'flex';
      
      // Manejar la vista de login si estamos en ella
      const loginForm = document.getElementById('admin-login-form');
      if (loginForm) {
        document.getElementById('login-message').innerText = "✅ Sesión iniciada correctamente como " + user.email;
        document.getElementById('login-message').style.color = "green";
        loginForm.style.display = "none";
        document.getElementById('logout-btn-container').style.display = "block";
      }
    } else {
      // Usuario NO logueado: Ocultamos la barra
      if (adminBar) adminBar.style.display = 'none';
      
      // Manejar la vista de login si estamos en ella
      const loginForm = document.getElementById('admin-login-form');
      if (loginForm) {
        loginForm.style.display = "flex";
        document.getElementById('logout-btn-container').style.display = "none";
        document.getElementById('login-message').innerText = "";
      }
    }
  });

  window.iniciarSesionAdmin = async function(event) {
    event.preventDefault();
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    const msg = document.getElementById('login-message');
    
    msg.innerText = "Iniciando sesión...";
    msg.style.color = "var(--text-sec)";
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged se dispara automáticamente y muestra éxito
    } catch (error) {
      console.error("Error de login:", error);
      msg.innerText = "❌ Correo o contraseña incorrectos.";
      msg.style.color = "var(--magenta-500)";
    }
  };

  window.cerrarSesionAdmin = async function() {
    await signOut(auth);
    mostrarNotificacion("🔒 Sesión cerrada", "success");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };
} catch(e) {
  console.log("Firebase no configurado aún:", e);
}
