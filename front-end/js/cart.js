//=============================
//      VARIABLE
//=============================

const cartArticleContainer = document.getElementById("cartArticleList");
const items = localStorage.productItem;
const itemQuantity = parseInt(items.quantity);
const messageBox = document.getElementById("display__message");
const totalPrice = document.getElementById("totalPrice");

let incartProduct = JSON.parse(localStorage.getItem("productItem"));
let productInCart = false;
let priceList = [];
let totalQuantity = 0;

//=============================
//      SCENARIO
//=============================

for (let i = 0; i < incartProduct.length; i++) {
	let item = incartProduct[i];
	htmlInjector(item);
	localStorageQuantityCheck(item);
}
priceCalculator();

//=============================
//      FUNCTION
//=============================

function localStorageQuantityCheck(item) {
	if (item.quantity > 0) {
		if (itemQuantity > 9) {
			itemQuantity = 9;
			displayQuantityWarningMessage();
			return (productInCart = true);
		}
	}
	item.quantity === 0 ? productInCart = false : productInCart = true;
}

function priceCalculator() {
	let quantityProductList = document.querySelectorAll(
		".cart__product__quantity"
	);
	let allPrice = document.querySelectorAll(".cart__product__price");
	let total = 0;

	for (let i = 0; i < quantityProductList.length; i++) {
		let quantity = quantityProductList[i].valueAsNumber;
		let price = parseInt(allPrice[i].textContent);
		let sum = quantity * price;
		total += sum;
	}
	totalPrice.innerHTML = formatter.format(total);
}

function cartInjection(item) {
	productInCart ? htmlInjector(item) : displayEmptyCartMessage();
}

//-----------------------------------------

function displayEmptyCartMessage() {
	cartArticleContainer.innerHTML = `<p class="empty__cart">Le panier est vide.</p>`;
}

function displayQuantityWarningMessage() {
	messageBox.innerHTML = `<p class="message__text">La quantité maximal est de 9.</p>`;
}

function htmlInjector(item) {
	cartArticleContainer.innerHTML += injectTeddies(item);
}

function injectTeddies(item) {
	return `
	<li class="cart__article">
		<a class="cart__link__product" href="./product.html?_id=${item.id}">
		<img class="cart__product__img" src="${item.imgUrl}">
		</a>

		<div class="cart__product__box">
			<h2 class="cart__product__name">${item.name}</h2>
			<h3 class="cart__product__id">${item.id}</h3>
			<p class="cart__product__color">${item.color}</p>
		</div>

		<div class="cart__product__number__box">
			<input type="number" name="product__quantity" class="cart__product__quantity" min="0" max="9" value='${
				item.quantity
			}' onchange='priceCalculator()'>
			<p class="cart__product__price">${formatter.format(
				parseInt(item.price) / 100
			)}</p>
		</div>
	</li>
  
  `;
}
