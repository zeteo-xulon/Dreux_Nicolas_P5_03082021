//==========================================
// Variables List
//==========================================
const mainProduct = document.querySelector("main");

// Get the id from the url
let id = urlParameter.get("_id");

// stocker
let optionColor = "";
let getColor = "";

//=====================================
//        SCENARIO
//=====================================

/*Display the teddie with it's information and specificities.
 * (1) | playing the loop to get the color before injecting HTML.
 * (2) | Injecting HTML.
 * (3) | Initialize submit button that will check each time the product and localStorage object(s).
 * (!) | In case of error, it display an information for the user that teddies could not load.
 */
fetch(url + "/" + id)
	.then((res) => res.json())
	.then((product) => {
		loopColor(product);
		injectHtml(product);
		submitChecker(product);
	})
	.catch((err) => {
		console.log(err);
		displayErrorMessage();
	});

/*=====================================================
 *       FUNCTION LIST
 *====================================================*/
//display a message for the user when something wrong
function displayErrorMessage() {
	mainProduct.innerHTML = `<h2>Veuillez réessayer utltérieumenent, une erreur s'est produite.</h2>`;
}

function displayMaxQuantityMessage() {
	const quantityBox = document.querySelector(".product__quantity__box");
	quantityBox.innerHTML += `<p class="product__quantity--error-message">La quantité maximale est de 9</p>`;
}

function displayTeddieInfo(product) {
	return `
  	<section class="product-card">

      <div class="product__img-box" >
        <img class="product__img" src="${
					product.imageUrl
				}" alt="Image du nounours ${product.name}" />
      </div>

      <article class="product__informations">

          <h2 class="product__name">${product.name}</h2>
          <p class="product__id">Référence : ${product._id}</p>
          <label for="option__color">Choisissez votre couleur de peluche</label>
          <select id="optionColor">${optionColor}</select>
					<div class="product__quantity__box">
          	<input type="number" name="product__quantity" class ="product__quantity" id="productQuantity" min="0" max="9" value="1" />
					</div>
          <aside class="product__description">
            <h3 class="product__title">Description</h3>
            <p class="product__description__paragraph">${
							product.description
						}</p>
          </aside>

          <div class="center-box">
            <p class="product__price">${formatter.format(
							parseInt(product.price) / 100
						)}</p>
            <button class="btn" id="productSubmit">Ajouter au panier</button>
          </div>

      </article>
    
    </section>
      `;
}

function injectHtml(product) {
	mainProduct.innerHTML = displayTeddieInfo(product);
}

function loopColor(param) {
	for (let color of param.colors) {
		optionColor += `<option value="${color}">${color}</option>`;
	}
}

/*-----------------------------------------------------
 *											SUBMIT
 *-----------------------------------------------------
 * Create an object to add in the local storage
 * check the local Storage, if its not empty
 * it create 2 array, one with the object and then update it
 * one with all the objects except the actual one
 * then it create a last array with everything and
 * send it to localStorage.
 */
function submitChecker(product) {
	const submitButton = document.getElementById("productSubmit");
	submitButton.onclick = (data) => {
		const colorPointer = document.getElementById("optionColor").value;
		const QuantityPointer = document.getElementById("productQuantity").value;

		let objectToAdd = {
			id: id,
			color: colorPointer,
			quantity: QuantityPointer,
			name: product.name,
			imgUrl: product.imageUrl,
			price: product.price,
		};
		let array = [];
		if (localStorage.length > 0) {
			array = get("productItem");

			let filtredArray = [];
			let arrayWithoutProduct = [];
			let quantityToPush = parseInt(objectToAdd.quantity);
			filtredArray = array.filter(
				(e) => e.id == objectToAdd.id && e.color == objectToAdd.color
			);
			arrayWithoutProduct = array.filter(
				(e) => e.id != objectToAdd.id && e.color != objectToAdd.color
			);
			if (filtredArray.length === 0) {
				if (quantityToPush > 9) {	
					displayMaxQuantityMessage();
					document.getElementById("productQuantity").value = 9;
				}
				if (quantityToPush <= 9) {
					arrayToStorage(objectToAdd, array, "productItem");
					goToCart();
				}
			}
			if (filtredArray.length === 1) {
				let quantityArray = parseInt(filtredArray[0].quantity);
				quantityToPush = quantityArray + quantityToPush;
				if (quantityToPush >= 9) {
					quantityToPush = 9;
					objectToAdd.quantity = "9";
					arrayToStorage(objectToAdd, arrayWithoutProduct, "productItem");
					displayMaxQuantityMessage();
					document.getElementById("productQuantity").value = 9;
					setTimeout((e) => goToCart(), 1500);
				}
				if (quantityToPush < 9) {
					objectToAdd.quantity = quantityToPush;
					arrayToStorage(objectToAdd, arrayWithoutProduct, "productItem");
				}
			}
			// return (document.location.href = "./cart.html");
		}
		if (localStorage.length === 0) {
			arrayToStorage(objectToAdd, array, "productItem");
			goToCart();
		}
	};
}

function get(key) {
	return JSON.parse(localStorage.getItem(key));
}

function store(key, material) {
	localStorage.setItem(key, JSON.stringify(material));
}

function arrayToStorage(teddieObject, param, key) {
	param.unshift(teddieObject);
	store(key, param);
	return param;
}

function goToCart() {
	return (document.location.href = "./cart.html");
}
