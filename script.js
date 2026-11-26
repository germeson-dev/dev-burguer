const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkOutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];


//Abrir Modal do Carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal()
    cartModal.style.display = "flex"
})

//Quando clicar fora
cartModal.addEventListener("click", function(event) {
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

// Botão Fechar
closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none"
})

// Botão Add ao Carrinho
menu.addEventListener("click", function(event) {
    // console.log(event.target)
    let parentButton = event.target.closest(".add-to-cart-btn")
    // console.log(parentButton)
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        // console.log(name)
        // console.log(price)

        addToCart(name, price)
      
    }

})

// Função para Adicionar ao Carrinho
function addToCart(name,price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        //Se o item já existe, aumenta apenas a quantidade + 1
        // console.log(existingItem);
        existingItem.quantity += 1;

    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })

    }

    updateCartModal()

}

//Atualiza Carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        // console.log(item);
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium mt-3">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>

        </div>
        `
        total += item.price * item.quantity;
        

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;

}


// Função para Remover o item do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }

}

// Preencher o endereço
addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;
    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }

    //
})

checkOutBtn.addEventListener("click", function(){
    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //Enviar pedido para api WhatsApp
    const cartItems = cart.map((item) => {
        return (
            `${item.name}\nQuantidade: (${item.quantity})\nPreço: R$${item.price.toFixed(2)}\n\n`
        )
    }).join("")
    
    const texto = `*Pedido efetuado pelo site*\n\n`
    const message = encodeURIComponent(cartItems)
    const pedido = encodeURIComponent(texto)
    const phone = "5511940547947"
    const endereco = addressInput.value


    window.open(`https://api.whatsapp.com/send/?phone=${phone}&text=${pedido}${message}Endereço: ${endereco}`)

    cart = [];
    updateCartModal();
})

//Verificar a hora e manipular o cart horário

function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
    //true = restaurante está aberto
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}