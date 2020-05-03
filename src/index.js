const promotions = ['SINGLE LOOK', 'DOUBLE LOOK', 'TRIPLE LOOK', 'FULL LOOK'];

function getShoppingCart(ids, productsList) {
	let shopping = {};
	let products = [];
	productsList.filter(p => {
		ids.filter(i => {
			if(i == p.id){
				products.push({
					name: p.name,
					category: p.category
				})
			}
		})
	})
	shopping.products = products
	shopping.promotion = verifyPromotion(shopping)
	shopping = calculateValues(ids, productsList, shopping)
	return shopping;
}

function verifyPromotion(productsSelected) {
	let categories = calculateCategory(productsSelected)
	if(categories.length == 1){
		return 'SINGLE LOOK'
	}else if(categories.length == 2){
		return 'DOUBLE LOOK'
	}else if(categories.length === 3){
		return 'TRIPLE LOOK'
	}else if(categories.length >= 4){
		return 'FULL LOOK'
	}
}

function calculateCategory(productsSelected){
	let categories = []
	productsSelected.products.forEach(e => {
		if(categories.filter(c => c.category == e.category).length == 0){
			categories.push({
				category: e.category,
				repeat: productsSelected.products.filter(s => s.category == e.category).length
			})
		}
	});
	return categories
}

function calculateValues(ids, productsList, shopping){
	let normalValue = 0;
	let allproducts = [];
	productsList.filter(p => {
		ids.filter(i => {
			if(i == p.id){
				allproducts.push(p)
				normalValue += p.regularPrice
			}
		})
	});
	shopping.totalPrice = calcTotalPrice(allproducts, shopping.promotion)
	shopping.discountValue = (normalValue - shopping.totalPrice).toFixed(2)
	shopping.discount = (shopping.discountValue * 100 / normalValue).toFixed(2)+'%'
	return shopping
}

function calcTotalPrice(products, promotion) {
	let total = 0;
	let ok = 0;
	products.forEach(e => {
		ok = 0;
		e.promotions.forEach(x => {
			if(!!x.looks.find(p => p == promotion)){
				total += x.price
				ok = 1;
			}
		})
		if(ok == 0){
			total += e.regularPrice
		}
	})
	return total.toFixed(2);
}

module.exports = { getShoppingCart };
