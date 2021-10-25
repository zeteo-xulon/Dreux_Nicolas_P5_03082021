//=============================
//      VARIABLE
//=============================
const cartArticleContainer = document.getElementById("cartArticleList");
const messageBox = document.getElementById("display__message");
const totalPrice = document.getElementById("totalPrice");
const cartButton = document.getElementById("cartButton");
const shadeContainer = document.getElementById("formDisplay");

let incartProduct = get("productItem");

//=============================
//      SCENARIO
//=============================
/*
 * Begin by a loop of all the product in the localStorage,
 * It will inject the HTML relative to all the elements
 * it will check the quantity, and correct what could be wrong
 * then it will calculate the price, and begin to listen what
 * happen on screen, to delete, or go to command information step.
 */
injectCart();
calculatePrice();
listenEvent();
checkTheCart();

//=============================
//      FUNCTION
//=============================

//  On submit click, it will verify the input using regex.
//  if its wrong, an error is display, if its ok, throw the post() function.
function buildArray() {
	//Pointer
	const errorBox = document.querySelector(".display__error-text");
	let firstName = document.getElementById("firstname").value;
	let lastName = document.getElementById("name").value;
	let address = document.getElementById("adress").value;
	let city = document.getElementById("city").value;
	let email = document.getElementById("email").value;
	//regex
	let regexName = new RegExp(/^[a-zA-Z\-]+$/);
	let regexEmail = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
	let regexAddress = new RegExp(/^[a-zA-Z0-9\s,.'-]{3,}$/);
	let regexCity = new RegExp(/^[a-zA-Z',.\s-]{1,25}$/);

	// reset eventual old error message to dodge possible stack
	errorBox.innerHTML = "";

	if (regexName.exec(firstName) === null) {
		errorBox.innerHTML += `<p>La syntaxe du prénom n'est pas valide.</p>`;
	}
	if (regexName.exec(lastName) === null) {
		errorBox.innerHTML += `<p>La syntaxe du nom de famille n'est pas valide.</p>`;
	}
	if (regexAddress.exec(address) === null) {
		errorBox.innerHTML += `<p>La syntaxe de l'adresse n'est pas valide.</p>`;
	}
	if (regexCity.exec(city) === null) {
		errorBox.innerHTML += `<p>La syntaxe de la ville n'est pas valide.</p>`;
	}
	if (regexEmail.exec(email) === null) {
		errorBox.innerHTML += `<p>La syntaxe de l'adresse email n'est pas valide.</p>`;
	}
	if (
		regexName.exec(firstName) !== null &&
		regexName.exec(lastName) !== null &&
		regexAddress.exec(address) !== null &&
		regexCity.exec(city) !== null &&
		regexEmail.exec(email) !== null
	) {
		let payload = buildUserObject(firstName, lastName, address, city, email);
		post(payload);
	}
}

/*	Build the client object object with user info and product bought.
 *		@Param firstName receive a string.
 *		@Param lastName receive a string.
 *		@Param address receive a string.
 *		@Param city receive a string.
 *		@Param email receive a string.
 */
function buildUserObject(firstName, lastName, address, city, email) {
	let contact = {
		firstName: firstName,
		lastName: lastName,
		address: address,
		city: city,
		email: email,
	};
	let products = productArray();
	return (payload = { contact, products });
}

// Calculate the total price throught all the quantity and their respective price, and format it.
function calculatePrice() {
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

//-----------------------------------------
// CHECKER

/* Verify the quantity of the products
 *	 set it to 0 if its null
 *	 set it to 9 if it outcome 9.
 *	 @Param item receive the data from the localStorage loop	*/
function checkLocalStorageQuantity(item) {
	if (item.quantity === null) {
		item.quantity = 0;
	}
	if (item.quantity > 0) {
		if (item.quantity > 9) {
			item.quantity = 9;
			displayQuantityWarningMessage();
		}
	}
}

// Verify if there is something in cart
function checkTheCart() {
	let array = get("productItem");
	if (array === null || array.length === 0) {
		displayEmptyCartMessage();
	}
}

//-----------------------------------------
// DISPLAYER

// The message to display when the cart is empty
function displayEmptyCartMessage() {
	cartArticleContainer.innerHTML = `<p class="empty__cart">Le panier est vide.</p>`;
}

// Will call the form injector, then build the pointer.
// Create 2 listener, one to exit the form, one to submit it.
function displayFormPopUp() {
	shadeContainer.innerHTML = injectForm();

	const shade = document.querySelector(".shade-screen");
	const exit = document.getElementById("formExit");
	const submit = document.getElementById("submitForm");

	exit.addEventListener("click", (r) => shade.remove());

	submit.addEventListener("click", (e) => {
		e.preventDefault();
		buildArray();
	});
}

// in case of quantity > 9, display a warning message.
function displayQuantityWarningMessage() {
	messageBox.innerHTML = `<p class="message__text">La quantité maximal est de 9.</p>`;
}

//-----------------------------------------

// Get each article separatly
function getArticle() {
	for (let i = 0; i < incartProduct.length; i++) {
		let item = incartProduct[i];
		injectHtml(item);
		checkLocalStorageQuantity(item);
	}
}

//-----------------------------------------
// INJECTOR

// Inject the good response to the cart, or empty, or the article.
function injectCart() {
	if (incartProduct === null) {
		incartProduct = [];
		displayEmptyCartMessage();
	}
	if (incartProduct.length > 0) {
		getArticle();
	}
}

// html data about the form
function injectForm() {
	return `
	<div class="shade-screen">
	<article class="form__card">
		<form action="" method="get" class="form">
				<p class="form__exit" id="formExit">x</p>
				<p class="form__title">Veuillez remplir vos informations de livraison</p>
				<label for="firstname">Entrez votre prénom : </label>
				<input type="text" name="name" id="firstname" required>
				<label for="name">Entrez votre nom :</label>
				<input type="text" name="name" id="name" required>
				<label for="address">Entrez votre adresse :</label>
				<input type="text" name="name" id="adress" required>
				<label for="city">Ville :</label>
				<input type="text" name="name" id="city" required>
				<label for="email">Entrez votre adresse mail: </label>
				<input type="email" name="email" id="email" required>
				<div class="display__error-text"></div>
				<div class="form__button">
					<input type="submit" value="Commander" class="form__btn btn" id="submitForm">
				</div>
		</form>
	</article>
</div>
	`;
}

// will add the product info in html
function injectHtml(item) {
	cartArticleContainer.innerHTML += injectTeddies(item);
}

// html data about teddies
function injectTeddies(item) {
	return `
	<li class="cart__article">
		<a class="cart__link__product" href="./product.html?_id=${item.id}">
		<img class="cart__product__img" src="${item.imgUrl}" alt="image de la peluche ${
		item.name
	}">
		</a>

		<div class="cart__product__box">
			<h2 class="cart__product__name">${item.name}</h2>
			<h3 class="cart__product__id">${item.id}</h3>
			<p class="cart__product__color">${item.color}</p>
		</div>

		<div class="cart__product__number__box">
			<input type="number" name="product__quantity" class="cart__product__quantity" min="0" max="9" value='${
				item.quantity
			}' onchange='calculatePrice()'>
			<p class="cart__product__price">${formatter.format(
				parseInt(item.price) / 100
			)}</p>
			<i class="far fa-trash-alt"></i>
		</div>
	</li>
  
  `;
}
//-----------------------------------------
// Create a listener for all the screen, acting dependantly to the area clicked.
function listenEvent() {
	document.addEventListener("click", (e) => {
		let totalPrice = parseInt(document.getElementById("totalPrice").innerText);
		if (e.target.matches(".fa-trash-alt")) {
			removeLocal("productItem", e);
			e.path[2].remove();
			calculatePrice();
			checkTheCart();
		}
		if (e.target.matches("#cartButton")) {
			totalPrice <= 0
				? alert("Le panier est vide")
				: (calculatePrice(), displayFormPopUp());
		}
	});
}

// Send a request to the API with the payload object and change url for confirmation page.
function post(object) {
	fetch("http://localhost:3000/api/teddies/order", {
		method: "POST",
		body: JSON.stringify(object),
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((res) => res.json())
		.then((e) => {
			localStorage.removeItem("productItem");
			return (document.location.href =
				"./confirmation.html?orderId=" +
				e.orderId +
				"&firstName=" +
				e.contact.firstName +
				"&lastName=" +
				e.contact.lastName +
				"&total=" +
				parseInt(totalPrice.innerText));
		})
		.catch((err) => console.log(err));
}

// Create an array with only id of product
function productArray() {
	let array = [];
	let local = get("productItem");
	local.forEach((element) => array.push(element.id));
	return array;
}

// In case of null, will set an integer 0.
function regulateQuantity(data) {
	return data === null ? (data = 0) : parseInt(data.quantity);
}

/* Function to remove the selected product from localStorage
 *  @param key is the localStorage key
 *  @param caller is the info received from the eventlistener.  */
function removeLocal(key, caller) {
	let selectedId = caller.path[2].childNodes[3].childNodes[3].innerText;
	let selectedColor = caller.path[2].childNodes[3].childNodes[5].innerText;
	let arrayClip = get(key);
	let a = arrayClip.filter((e) => e.id == selectedId && e.color != selectedColor);
	let b = arrayClip.filter((e) => e.id != selectedId && e.color != selectedColor);
	if (a.length > 0 && b.length > 0) {
		let c = a.concat(b);
		return store(key, c);
	}
	if (a.length > 0 && b.length === 0) {
		return store(key, a);
	}
	if (a.length === 0 && b.length > 0) {
		return store(key, b);
	}
}
