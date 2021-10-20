let urlParameter = new URLSearchParams(window.location.search);
const url = "http://localhost:3000/api/teddies";

// Create our number formatter.
const formatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

// Get the item from localStorage, parse it and return it for further use.
// @Param key receive the localStorage key (productItem in this case)
function get(key) {
	return JSON.parse(localStorage.getItem(key));
}

/* Get the item from localStorage, parse it and return it for further use.
* @Param key receive the localStorage key (productItem for exemple)
* @Param  array receive and array to prepare for localStorage and set it. */
function store(key, array) {
	return localStorage.setItem(key, JSON.stringify(array));
}