//---------------------------------
//						VARIABLE
//---------------------------------
const teddieList = document.querySelector(".teddie__list");

//---------------------------------
//						SCENARIO
//---------------------------------
// Get the data from the API and display it
fetch(url)
	.then((res) => res.json())
	.then((data) => loopingInProduct(data))
	.catch((err) => {
		console.log(err);
		teddieList.textContent = "Les nounours n'ont pas pu être chargé";
	});

//---------------------------------
//						FUNCTION
//---------------------------------
//the ressources to incorporate in the diplay function
// @Param teddie receive the fetch response
const injectHtml = (teddie) => {
	return `
		<a class="teddie__card" href="./front-end/pages/product.html?_id=${teddie._id}">
		<img src="${teddie.imageUrl}" alt="Image d'ours en peluche">
		</a>
		`;
};

//loop into the json to inject the html into the code
// @Param teddie receive the fetch response
function loopingInProduct(teddies) {
	for (teddie of teddies) {
		teddieList.innerHTML += injectHtml(teddie);
	}
}
