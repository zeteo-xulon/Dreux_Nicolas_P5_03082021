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

// (1) | A loop for to go throught all the color in the list and add it.
function loopColor(param) {
	for (let color of param.colors) {
		optionColor += `<option value="${color}">${color}</option>`;
	}
}

//----------------
// (2) | Display all information of the teddie in the html main__product
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

// will display a H2 information message for the user if fetch catch an error.
const displayErrorMessage = () => {
	mainProduct.innerHTML = `
    <h2>Veuillez réessayer utltérieumenent, une erreur s'est produite.</h2>
    `;
};

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
		productArray.push({
			id: id,
			color: colorPointer,
			quantity: QuantityPointer,
		});
		productArray = JSON.stringify(productArray);
		localStorage.setItem("productItem", productArray);
	};
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
//=======================================
/*LOGIQUE DE LA FUNCTION DE VERIF
 * - - - - - - - - - - - - - - - -
 * Si l'id n'est pas déjà dans le tableau
 *	 push du produit dans le tableau du localStorage
 *	Si l'id est dans le tableau
 *			Si la couleur n'est pas la même
 * 		push du produit dans le tableau du localStorage
 *			Si la couleur et l'id sont les même
 *					Si la quantité est >= a 9
 *					message d'alerte "La quantité maximal est atteinte."
 *					Si la quantité est < 9 && si la quantité à push + quantité déjà dans l'objet >= 9
 *					quantité === 9
 *					sinon quantité de l'objet + quantité à push
 *
 *- - - - - - - - - - - - - - - - - - - - - - - - - -
 *	function pour checker, pour insérér, pour modifier la quantité.
 *	Donc 3 fonctions ?
 * Est ce que j
 *
 */
function checkLocalStorage() {
	const productColor = document.getElementById("optionColor").value;
	let array = localStorage();
	for (item of array) {
		if (item.id != id && item.color != productColor) {
			if (item.quantity >= 9) {
				alert("La quantité maximal est atteinte");
			}
		}
	}
}
