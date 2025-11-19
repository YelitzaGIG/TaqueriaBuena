// ===================================
// VARIABLES GLOBALES
// ===================================
const tabs = document.querySelectorAll('.tab');
const menuItems = document.querySelectorAll('.menu-item');

const cartBtn = document.getElementById('cart-btn');
const cartPanel = document.getElementById('cart-panel');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

const customizationOverlay = document.getElementById('customization-overlay');
const closeCustomization = document.getElementById('close-customization');
const customImg = document.getElementById('custom-img');
const customName = document.getElementById('custom-name');
const customDesc = document.getElementById('custom-desc');
const customInstructions = document.getElementById('custom-instructions');
const customQty = document.getElementById('custom-qty');
const addToCartBtn = document.getElementById('add-to-cart');
const customOptionsContainer = document.querySelector('.custom-options');

let cart = [];
let currentProduct = null;

// ===================================
// OPCIONES POR CATEGORÍA
// ===================================
const categoryOptions = {
    tacos: ["Cebolla", "Cilantro", "Limón", "Salsas"],

    antojitos: {
        "Quesadillas": ["Queso", "Salsa roja", "Salsa verde"],
        "Sopes": ["Queso", "Crema", "Lechuga", "Salsa roja", "Salsa verde"],
        "Tlacoyos": ["Queso fresco", "Salsa roja", "Salsa verde"],
        "Gorditas": ["Queso", "Crema", "Guacamole", "Salsa picante"],
        "Tamales": ["Verde", "Rojo", "Rajas", "Dulce"],
        "Enchiladas": ["Salsa roja", "Salsa verde", "Queso", "Crema"],
        "Empanadas": ["Carne", "Queso", "Verduras"],
        "Pambazos": ["Lechuga", "Crema", "Queso"],
        "Chilaquiles": ["Salsa roja", "Salsa verde", "Pollo", "Huevo"]
    }
};

// ===================================
// PESTAÑAS
// ===================================
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.target;
        menuItems.forEach(item => {
            item.style.display = (item.dataset.category === target) ? "flex" : "none";
        });
    });
});
// Mostrar solo tacos al inicio
menuItems.forEach(item => {
    if (item.dataset.category !== "tacos") item.style.display = "none";
});

// ===================================
// ABRIR / CERRAR CARRITO (solo manualmente)
// ===================================
cartBtn.addEventListener('click', () => cartPanel.classList.toggle('open'));
closeCart.addEventListener('click', () => cartPanel.classList.remove('open'));

// ===================================
// ABRIR CUADRO DE PERSONALIZACIÓN
// ===================================
document.querySelectorAll('.plus-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const menuItem = btn.closest('.menu-item');
        const category = menuItem.dataset.category;

        currentProduct = {
            name: btn.dataset.name,
            price: parseFloat(btn.dataset.price),
            img: menuItem.querySelector('img').src,
            desc: menuItem.querySelector('.description').innerText,
            category: category,
            options: [],
            instructions: '',
            qty: 1
        };

        // Rellenar cuadro
        customImg.src = currentProduct.img;
        if (category === 'bebidas') {
            customName.textContent = currentProduct.name + " (600ml)";
        } else {
            customName.textContent = currentProduct.name;
        }
        customDesc.textContent = currentProduct.desc;
        customInstructions.value = '';
        customOptionsContainer.innerHTML = '';

        // Mostrar opciones según categoría
        if (category === 'bebidas') {
            customQty.value = 1;
            customQty.disabled = false;
            customInstructions.placeholder = "Tamaño fijo 600ml. Puedes agregar instrucciones especiales.";
        } else {
            customQty.value = 1;
            customQty.disabled = false;
            customInstructions.placeholder = "Agregar instrucciones especiales";

            let options = [];
            if (category === 'antojitos' && categoryOptions.antojitos[currentProduct.name]) {
                options = categoryOptions.antojitos[currentProduct.name];
            } else if (category === 'tacos') {
                options = categoryOptions.tacos;
            }

            options.forEach(opt => {
                const label = document.createElement('label');
                label.innerHTML = `<input type="checkbox" value="${opt}"> ${opt}`;
                customOptionsContainer.appendChild(label);
            });

            if (options.length > 0) {
                const note = document.createElement('p');
                note.classList.add('options-note');
                note.textContent = "Selecciona los ingredientes o agregados que deseas incluir:";
                customOptionsContainer.prepend(note);
            }
        }

        customizationOverlay.classList.add('active');
    });
});

// ===================================
// CERRAR CUADRO DE PERSONALIZACIÓN
// ===================================
function closeCustomizationBox() {
    const box = document.querySelector('.customization-box');
    box.style.transform = 'scale(0.8)';
    box.style.opacity = '0';
    setTimeout(() => {
        customizationOverlay.classList.remove('active');
        box.style.transform = '';
        box.style.opacity = '';
    }, 300);
}

closeCustomization.addEventListener('click', closeCustomizationBox);

customizationOverlay.addEventListener('click', (e) => {
    if (e.target === customizationOverlay) {
        closeCustomizationBox();
    }
});

// ===================================
// AGREGAR AL CARRITO
// ===================================
addToCartBtn.addEventListener('click', () => {
    currentProduct.qty = parseInt(customQty.value);
    currentProduct.instructions = customInstructions.value;

    if (currentProduct.category !== 'bebidas') {
        currentProduct.options = Array.from(customOptionsContainer.querySelectorAll('input[type="checkbox"]:checked'))
            .map(i => i.value);
    } else {
        currentProduct.options = [];
    }

    // Verificar si ya existe en carrito (mismo nombre y opciones)
    const existing = cart.find(item => item.name === currentProduct.name &&
        JSON.stringify(item.options) === JSON.stringify(currentProduct.options));

    if (existing) {
        existing.qty += currentProduct.qty;
    } else {
        cart.push({ ...currentProduct });
    }

    updateCartUI();
    closeCustomizationBox();
    // Esta línea abría el carrito automáticamente
    // cartPanel.classList.add('open');
});

// ===================================
// FUNCIÓN PARA ACTUALIZAR EL CARRITO
// ===================================
function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, idx) => {
        total += item.price * item.qty;
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <span class="name">${item.name} ${item.options.length ? '(' + item.options.join(', ') + ')' : ''}</span>
            <div class="qty-controls">
                <button class="minus">-</button>
                <span>${item.qty}</span>
                <button class="plus">+</button>
            </div>
            <span>$${(item.price * item.qty).toFixed(2)}</span>
        `;

        div.querySelector('.plus').addEventListener('click', () => {
            item.qty++;
            updateCartUI();
        });
        div.querySelector('.minus').addEventListener('click', () => {
            item.qty--;
            if (item.qty <= 0) cart.splice(idx, 1);
            updateCartUI();
        });

        cartItemsContainer.appendChild(div);
    });

    cartTotal.textContent = total.toFixed(2);
}
// 🟦 MOSTRAR MODAL DE PAGO AL PRESIONAR "Finalizar Pedido"
document.querySelector(".checkout").addEventListener("click", () => {
    document.getElementById("payment-modal").style.display = "flex";
});

// 🟥 BOTÓN PARA CERRAR EL MODAL
document.querySelector(".close-payment").addEventListener("click", () => {
    document.getElementById("payment-modal").style.display = "none";
});

// 🟦 BOTONES DE PAGO
document.querySelector(".mercado-btn").addEventListener("click", () => {
    alert("Redirigiendo a Mercado Pago...");
    // aquí puedes poner window.location.href = "tu_link";
});

document.querySelector(".paypal-btn").addEventListener("click", () => {
    alert("Redirigiendo a PayPal...");
    // aquí puedes poner window.location.href = "tu_link";
});
