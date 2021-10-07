//---------------------------------
//						VARIABLES
//---------------------------------
const serverAdress = "http://localhost:3000/api/teddies";
const teddieList = document.querySelector(".teddie__list");
//---------------------------------
//						SCENARIO
//---------------------------------
//to get the data from the API and display it
fetch(serverAdress)
	.then((res) => res.json())
	.then((data) => loop(data))
	.catch((err) => {
		console.log(err);
		teddieList.textContent = "Les nounours n'ont pas pu être chargé";
	});
//---------------------------------
//						FUNCTION
//---------------------------------

//the ressources to incorporate in the diplay function
const htmlInjection = (teddie) => {
	return `
		<a class="teddie__card" href="./front-end/pages/product.html?_id=${teddie._id}">
		<img src="${teddie.imageUrl}" alt="Image d'ours en peluche">
		</a>
		`;
};

//loop into the json to inject the html into the code
function loop(teddies) {
	for (teddie of teddies) {
		teddieList.innerHTML += htmlInjection(teddie);
	}
}
