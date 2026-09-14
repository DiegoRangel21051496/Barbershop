// ==============================
// SANTOS BARBER SHOP
// Interacciones, animaciones y chatbot
// ==============================

const header = document.querySelector(".topbar");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const cursorGlow = document.querySelector(".cursor-glow");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 30);
});

// Menú móvil
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("no-scroll", isOpen);
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  });
});

// Brillo que sigue al mouse
document.addEventListener("mousemove", (e) => {
  if (!cursorGlow) return;
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
});

// Animaciones al hacer scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// Testimonios
const testimonials = [...document.querySelectorAll(".testimonial")];
const prevBtn = document.querySelector(".slider-btn.prev");
const nextBtn = document.querySelector(".slider-btn.next");
let testimonialIndex = 0;

function showTestimonial(index) {
  testimonials.forEach((t, i) => {
    t.classList.toggle("active", i === index);
  });
}

prevBtn?.addEventListener("click", () => {
  testimonialIndex = (testimonialIndex - 1 + testimonials.length) % testimonials.length;
  showTestimonial(testimonialIndex);
});

nextBtn?.addEventListener("click", () => {
  testimonialIndex = (testimonialIndex + 1) % testimonials.length;
  showTestimonial(testimonialIndex);
});

setInterval(() => {
  testimonialIndex = (testimonialIndex + 1) % testimonials.length;
  showTestimonial(testimonialIndex);
}, 6500);

// Año automático
document.querySelector("#year").textContent = new Date().getFullYear();

// ==============================
// CHATBOT LOCAL
// No usa API externa ni genera costos.
// Puedes convertirlo luego a IA real conectando
// un backend seguro a una API.
// ==============================

const chatLauncher = document.querySelector("#chatLauncher");
const chatbot = document.querySelector("#chatbot");
const closeChat = document.querySelector("#closeChat");
const chatMessages = document.querySelector("#chatMessages");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const quickReplies = document.querySelector("#quickReplies");

chatLauncher.addEventListener("click", () => {
  chatbot.classList.add("open");
  setTimeout(() => chatInput.focus(), 250);
});

closeChat.addEventListener("click", () => {
  chatbot.classList.remove("open");
});

function addMessage(text, sender = "bot") {
  const wrapper = document.createElement("div");
  wrapper.className = `message ${sender}`;

  const p = document.createElement("p");
  p.textContent = text;

  const time = document.createElement("span");
  time.textContent = "Ahora";

  wrapper.appendChild(p);
  wrapper.appendChild(time);
  chatMessages.appendChild(wrapper);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getBotResponse(message) {
  const m = normalizeText(message);

  if (m.includes("precio") || m.includes("cuanto") || m.includes("costo")) {
    return "Nuestros precios de ejemplo son: corte clásico $180, fade premium $220, barba $150 y corte + barba $320. Puedes cambiar estos precios directamente en index.html.";
  }

  if (m.includes("horario") || m.includes("abren") || m.includes("cierran")) {
    return "Abrimos de lunes a sábado de 10:00 AM a 8:00 PM y domingo de 11:00 AM a 5:00 PM.";
  }

  if (m.includes("ubicacion") || m.includes("direccion") || m.includes("donde")) {
    return "Estamos en la zona de Colonia Oceanía. En la sección Contacto puedes colocar la dirección exacta y actualizar el mapa.";
  }

  if (m.includes("cita") || m.includes("agendar") || m.includes("reservar")) {
    return "¡Claro! Puedes reservar desde el botón “Abrir WhatsApp” de la página. Recuerda cambiar el número de ejemplo por el número real de la barbería.";
  }

  if (m.includes("barba")) {
    return "Sí, tenemos servicio de barba: perfilado, rebaje y acabado. El precio de ejemplo es $150.";
  }

  if (m.includes("fade") || m.includes("degradado")) {
    return "Sí. El Fade Premium incluye degradado limpio, diseño, terminación y styling. Precio de ejemplo: $220.";
  }

  if (m.includes("hola") || m.includes("buenas") || m.includes("que tal")) {
    return "¡Hola! 👋 Puedo ayudarte con precios, horarios, ubicación o para agendar una cita.";
  }

  if (m.includes("gracias")) {
    return "¡Con gusto! 💈 Aquí estamos para ayudarte. ¿Quieres consultar precios o agendar una cita?";
  }

  return "Puedo ayudarte con precios, horarios, ubicación y citas. Prueba escribiendo: “¿Cuánto cuesta un fade?” o “Quiero agendar una cita”.";
}

function handleUserMessage(rawMessage) {
  const message = rawMessage.trim();
  if (!message) return;

  addMessage(message, "user");
  chatInput.value = "";

  const typing = document.createElement("div");
  typing.className = "message bot";
  typing.innerHTML = "<p>Escribiendo...</p>";
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  setTimeout(() => {
    typing.remove();
    addMessage(getBotResponse(message), "bot");
  }, 650);
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  handleUserMessage(chatInput.value);
});

quickReplies.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const q = btn.dataset.question;

  const messages = {
    precios: "¿Cuáles son los precios?",
    horario: "¿Cuál es el horario?",
    ubicacion: "¿Dónde están ubicados?",
    cita: "Quiero agendar una cita"
  };

  handleUserMessage(messages[q]);
});
