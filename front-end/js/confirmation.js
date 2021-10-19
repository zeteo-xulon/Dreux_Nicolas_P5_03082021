const ticketId = document.getElementById('ticketId');
const totalPrice = document.getElementById('ticketTotalPrice');
const clientName = document.getElementById('clientName');

//find the info from the url to display it
let id = urlParameter.get("orderId");
let firstName = urlParameter.get('firstName');
let lastName = urlParameter.get('lastName');
let total = urlParameter.get('total');

ticketId.innerHTML = id;
totalPrice.innerHTML = formatter.format(total);
clientName.innerHTML = firstName + " " + lastName;
