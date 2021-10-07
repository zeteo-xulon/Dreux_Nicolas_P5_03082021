//==========================================
// Variables List
//==========================================
const url = "http://localhost:3000/api/teddies";

//Pointer
const mainProduct = document.querySelector("main");

// Get the id from the url
let urlParameter = new URLSearchParams(window.location.search);
let id = urlParameter.get("_id");

// Use for stack the color option data.
let optionColor = "";
let getColor = "";

//Variable for checking algorithm
let reachedMaxQuantity = false;
let productArray = [];

//=====================================
//        SCENARIO
//=====================================

/*Display the teddie with it's information and specificities.
 * (1) | playing the loop to get the color before injecting HTML.
 * (2) | Injecting HTML.
 * (3) | Initialize submit button to store data in the LocalStorage for the cart page.
 * (!) | In case of error, it display an information for the user that teddies could not load.
 */
fetch(url + "/" + id)
	.then((res) => res.json())
	.then((product) => {
		loopColor(product);
		mainProduct.innerHTML = teddieDisplayInfo(product);
		submit();
	})
	.catch((err) => {
		console.log(err);
		displayErrorMessage();
	});

/*=====================================================
 *       FUNCTION LIST
 *====================================================*/

// will display a H2 information message for the user if fetch catch an error.
const displayErrorMessage = () => {
	mainProduct.innerHTML = `
    <h2>Veuillez réessayer utltérieumenent, une erreur s'est produite.</h2>
    `;
};

// | A loop for to go throught all the color in the list and add it.
function loopColor(param) {
	for (let color of param.colors) {
		optionColor += `<option value="${color}">${color}</option>`;
	}
}

/*--------------------------------------------------------------------------------
 *																		SUBMIT
 *---------------------------------------------------------------------------------
 * Send to localStorage the information of the product, id, color and quantity.
 */
function submit() {
	const submitButton = document.getElementById("productSubmit");
	submitButton.onclick = (data) => {
		const colorPointer = document.getElementById("optionColor").value;
		const QuantityPointer = document.getElementById("productQuantity").value;
		let objectToAdd = {
			id: id,
			color: colorPointer,
			quantity: QuantityPointer,
		};

		if (localStorage.length > 0) {
			storageToArray();
			/* Ici je vais vouloir mettre a part les objets qui auront le même
			 * Id que le produit de la page.
			 * Puis, je vais vouloir encore checker si dans ce tableau mis a part
			 * il y a un objet avec la couleur du produit que j'essaie d'envoyer
			 * Puis je verifierais si la quantité est = ou inferieur a 9 en ajoutant
			 * la valeur de quantité de l'objet que j'essaie d'envoyer.
			 * si oui, alors j'ai besoin d'ajouter la valeur dans l'objet a envoyer
			 * si non, je dois fixer la valeur à 9, et retourner un message d'info
			 * disant que la quantité maximum est de 9
			 */
			let firstFiltredArray = productArray.filter(
				(e) => e.id === objectToAdd.id
			);
			let treatedArray = firstFiltredArray.filter(
				(e) => e.color === objectToAdd.color
			);
			if (treatedArray.length === 0) {
				arrayToStorage(objectToAdd);
			}
			if (treatedArray === 1) {
				//Je dois ajouter une ligne pour seulement ajouter la quantité, en verifiant
				// que la valeur reste inférieur ou égale à 9.
			}
			return (productArray = []);
		}
		if (localStorage.length === 0) {
			arrayToStorage(objectToAdd);
			return (productArray = []);
		}

		// document.location.href = "./cart.html";
	};
}

function foundId(item, check) {
	return (item.id = check.id);
}

function storageToArray() {
	let getToArray = localStorage.getItem("productItem");
	let parseToArray = JSON.parse(getToArray);
	productArray = parseToArray;
	return productArray;
}

function arrayToStorage(teddieObject) {
	productArray.push(teddieObject);
	console.log(productArray);
	productArray = JSON.stringify(productArray);
	localStorage.setItem("productItem", productArray);
	productArray = JSON.parse(productArray);
	return productArray;
}
// ---------------------------------------------------------------------------------

function quantityChecker() {
	let quantity = document.getElementById("productQuantity").value;

	quantity.addEventListener("change", (val) => {
		if (val > 9) {
			reachedMaxQuantity = true;
			displayMaxQuantityMessage();
		}
	});
}

function displayMaxQuantityMessage() {
	const quantityBox = document.querySelector(".product__quantity__box");

	if (reachedMaxQuantity === true) {
		quantityBox.innerHTML += `<p class="">La quantité maximale est atteinte</p>`;
	}
}

//- - - - - - - - - - - - - - - - - -
function teddieDisplayInfo(product) {
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
          <select id="optionColor">
            ${optionColor}
          </select>
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
