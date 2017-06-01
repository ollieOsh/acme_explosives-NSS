let printDOM = (obj) => {
	let output = `
	<h2>${obj.categoryName}</h2>
	<div class="row">`

	obj.types.forEach(function(type) {
		output += `
			<div class="col-md-12 text-center">
				<h3>${type.name}</h3>
			</div>`

		type.products.forEach(function(product) {
			output += `
			<div class="col-md-4">
				<h4>${product.name}</h4>
				<p>${product.description}</p>
			</div>`
		});
	});

	output += `</div>`;
	$("#here").html(output);
}

function Categories(selected) {
	return new Promise ((resolve, reject) => {
		$.getJSON("categories.json")
		.then(function(data) {
			let arr = data.categories,
				bigObj = {};
			console.log("category", selected);
			arr.forEach(function(obj) {
				if(obj.name == selected) {
					console.log(obj.name, obj.id);
					bigObj.categoryID = obj.id;
					bigObj.categoryName = obj.name
				}
			});
			console.log("bigObj", bigObj);
			Types(bigObj);
		});
	});
}

function Types(bigObj) {
	return new Promise ((resolve, reject) => {
		$.getJSON("types.json")
		.then(function(data) {
			let arr = data.types;
			bigObj.types = [];
			console.log("types", arr);
			arr.forEach(function(obj) {
				if(obj.category == bigObj.categoryID) {
					console.log(obj.name, obj.id);
					bigObj.types.push({name: obj.name, id: obj.id});
				}
			});
			console.log("bigObj 2", bigObj);
			Products(bigObj);
		});
	});
}

function Products(bigObj) {
	console.log("PRODUCTS");
	return new Promise ((resolve, reject) => {
		$.getJSON("products.json")
		.then(function(data) {
			let arr = data.products,
				types = bigObj.types;
			console.log("types", types, "products", arr);
			types.forEach(function(type) {
				console.log("category id", bigObj.categoryID, "type id", type.id);
				type.products = [];
				arr.forEach(function(obj) {
					for(prop in obj){
						if(obj[prop].id == bigObj.categoryID && obj[prop].type == type.id){
							type.products.push(obj[prop])
						}
					}
				});
				bigObj.types = types;
			});
			console.log("FINAL", bigObj);
			printDOM(bigObj);
		});
	});
}

$(".dropdown-menu > li").on("click", function(event){
	let category = event.target.innerHTML;

	console.log("category", category);
	Categories(category);
})