// Get the product list and cart elements
const productListElement = document.querySelector('.product-list'),
cartElement = document.querySelector('.cart'),
cartItemsElement = document.querySelector('.cart-items'),
totalPriceElement = document.querySelector('.total-price');

// Define the products array
const products = [
    { id: 1, name: 'Perfume', price: 19.99, image: 'img/perfume.png' },
    { id: 2, name: 'Laptop', price: 999.99, image: 'img/9566377.png'},
    { id: 3, name: 'Furniture' , price: 199.99, image: 'img/red-sofa-furniture-icon-png-4.png'},
    { id: 4, name: 'Smartphone', price: 699.99, image: 'img/pngtree-mobile-phone-png-image_18127921.png'},
    { id: 5, name: 'Headphones', price: 49.99, image: 'img/headphone.png' },
    { id: 6, name: 'Camera', price: 299.99, image: 'img/pngtree-dslr-digital-camera-png-image_5279956.png' },
    { id: 7, name: 'Shoes', price: 89.99, image: 'img/pngtree-white-shoes-png-image_15357252.png' },
    { id: 8, name: 'Backpack', price: 59.99, image: 'img/download.png' },
    { id: 9, name: 'Sunglasses', price: 29.99, image: 'img/Sunglasses.png' },
];
// Define the cart array
let cart = JSON.parse(localStorage.getItem('cart')) || [];
function renderProductList() {
    productListElement.innerHTML = '';
    products.map((product) => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <button class="add-to-cart-button" data-product-id="${product.id}">Add to Cart</button>
        `;
        productListElement.appendChild(productElement);
        
        // Add event listener to the "Add to Cart" button
        const addToCartButton = productElement.querySelector('.add-to-cart-button');
        addToCartButton.addEventListener('click', () => {
            const existingCartItem = cart.find((cartItem) => cartItem.product.id === product.id);
            if (existingCartItem) {
                const response = prompt(`You already have "${product.name}" in your cart. How many more would you like to add?`);
                if (response !== null) {
                    const quantityToAdd = parseInt(response);
                    if (!isNaN(quantityToAdd) && quantityToAdd > 0) {
                        handleAddToCartButtonClick({ target: addToCartButton }, quantityToAdd);
                        const productName = quantityToAdd > 1 ? `${product.name}s` : product.name;
                        alert(`Thank you ☺ ${quantityToAdd} "${productName}"  has been successfully added to your cart!`);
                    } else {
                        alert('Invalid quantity. Please enter a positive integer.');
                    }
                }
            } else {
                const quantityToAdd = 1;
                handleAddToCartButtonClick({ target: addToCartButton }, quantityToAdd);
                alert(`Thank you ☺ dear customer!"${product.name}" has been successfully added to your cart! Keep shopping!`);
            }
        });
    });
}  

// Function to render the cart
function renderCart() {
    cartItemsElement.innerHTML = '';
    cart.map((cartItem, index) => {
        const cartItemElement = document.createElement('li');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
            <img src="${cartItem.product.image}" alt="${cartItem.product.name}">
            <h3>${cartItem.product.name}</h3>
            <p>Quantity: ${cartItem.quantity}</p>
            <p>Subtotal: $${cartItem.product.price * cartItem.quantity}</p>
            <button class="increase-quantity-button" data-cart-item-index="${index}">+</button>
            <button class="decrease-quantity-button" data-cart-item-index="${index}">-</button>
            <button class="remove-from-cart-button" data-cart-item-index="${index}">Remove</button>
        `;
        cartItemsElement.appendChild(cartItemElement);
    });
    const totalPrice = cart.reduce((total, cartItem) => total + cartItem.product.price * cartItem.quantity, 0);
    totalPriceElement.textContent = `Total: $${totalPrice}`;
}

// Function to handle add to cart button click
function handleAddToCartButtonClick(event) {
    const productId = parseInt(event.target.dataset.productId);
    const product = products.find((product) => product.id === productId);
    const existingCartItem = cart.find((cartItem) => cartItem.product.id === productId);
    if (existingCartItem) {
        existingCartItem.quantity++;
    } else {
        cart.push({ product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Function to handle increase quantity button click
function handleIncreaseQuantityButtonClick(event) {
    const cartItemIndex = parseInt(event.target.dataset.cartItemIndex);
    cart[cartItemIndex].quantity++;
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Function to handle decrease quantity button click
function handleDecreaseQuantityButtonClick(event) {
    const cartItemIndex = parseInt(event.target.dataset.cartItemIndex);
    if (cart[cartItemIndex].quantity > 1) {
        cart[cartItemIndex].quantity--;
    } else {
        cart.splice(cartItemIndex, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Function to handle remove from cart button click
function handleRemoveFromCartButtonClick(event) {
    const cartItemIndex = parseInt(event.target.dataset.cartItemIndex);
    cart.splice(cartItemIndex, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Add event listeners to the add to cart buttons
productListElement.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-to-cart-button')) {
        handleAddToCartButtonClick(event);
    }
});

// Add event listeners to the increase quantity buttons
cartItemsElement.addEventListener('click', (event) => {
    if (event.target.classList.contains('increase-quantity-button')) {
        handleIncreaseQuantityButtonClick(event);
    } else if (event.target.classList.contains('decrease-quantity-button')) {
        handleDecreaseQuantityButtonClick(event);
    } else if (event.target.classList.contains('remove-from-cart-button')) {
        handleRemoveFromCartButtonClick(event);
    }
});

// Render the product list and cart
renderProductList();
renderCart();

// Search functionality
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm));
    renderProductList(filteredProducts);
});
function renderProductList(productsToRender = products) {
    const productListElement = document.querySelector('.product-list');
    productListElement.innerHTML = '';
    productsToRender.forEach((product) => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <button class="add-to-cart-button" data-product-id="${product.id}">Add to Cart</button>
        `;
        productListElement.appendChild(productElement);
    });
}
