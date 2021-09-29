//=============================
//      VARIABLE
//=============================
const url = "http://localhost:3000/api/teddies";
const cartArticleContainer = document.getElementById("cartArticle");

let incartProduct = JSON.parse(localStorage.getItem("productItem"));
let productId = incartProduct.id;

//=============================
//      SCENARIO
//=============================
function display() {
	fetch(url + "/" + productId)
		.then((res) => res.json())
		.then((e) => {
			// (1) | Injecting HTML here.
			cartArticleContainer.innerHTML = injectTeddiesInCartList(e);
		});
}
display();

//=============================
//      FUNCTION
//=============================
function injectTeddiesInCartList(param) {
	return `
  <a class="cart__link__product" href="./front-end/pages/product.html?_id=${param._id}">
  <img class="cart__product__img" src="${param.imageUrl}">
  </a>

  <div class="cart__product__box">
    <h2 class="cart__product__name">${param.name}</h2>
    <h3 class="cart__product__id">${param._id}</h3>
  </div>

  <p class="cart__product__color">${incartProduct.color}</p>

  <div class="cart__product__number__box">
    <input type="number" name="product__quantity" class="cart__product__quantity" id="cartProductQuantity" min="0" max="9" value='${
			incartProduct.quantity
		}'>
  </div>

  <p class="cart__product__price">${parseInt(param.price) / 100} €</p>
  `;
}
