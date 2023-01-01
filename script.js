var cart = localStorage.getItem('cart');
if(cart) cart = JSON.parse(cart);
else cart = []
var data = [];
var page = 1;
var main = document.querySelector('main');

(async () => {
    await api_calling(page);
    movie_mapping(data);
})();

async function api_calling(page) {
    let response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=5540e483a20e0b20354dabc2d66a31c9&language=en-US&page=${page}&adult=false`);
    data = await response.json();
    console.log(data);
    data = data.results;
}

function movie_mapping(data) {
    data.map((oneData) => {
        if (!oneData.count) oneData.count = 1;
        main.innerHTML += `<div class="movie">
        <h2 id=${oneData.id} onclick="movieDetail(event)" ><span>Show Name:</span>${oneData.title.substr(0, 15)}</h2>
        <img class="image" onclick="movieDetail(event)" src="https://image.tmdb.org/t/p/original/${oneData.poster_path}" id=${oneData.id}>
        <div class="head-er">
        <h2 id=${oneData.id} onclick="movieDetail(event)" ><span class="pa">Language:</span>${oneData.popularity}</h2>
            <button class="addButton" onclick="add_to_cart(event)" id=${oneData.id}>Add Movie</button>
        </div>
        </div>`;
    })
}

function movieDetail(e) {
    let id = e.target.id;
    main.style.display = "block";
    let movie = {};
    for (let i = 0; i < data.length; i++) {
        if (data[i].id == id) {
            movie = data[i]
        }
    }
    main.innerHTML = `<div class="singleMovie"><img src="https://image.tmdb.org/t/p/original/${movie.poster_path}">
    <h1>${movie.title}</h1>
    <h3>${movie.overview}</h3>
    </div>`
}

function home_button() {
    main.style.display = "grid";
    main.innerHTML = ""
    pagination.style.display = "block";
    movie_mapping(data);
}

function add_to_cart(e) {
    let idd = e.target.id;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id == idd) {
            cart[i].count += 1;
            let summ = cart_length(cart)
            let cartNumber = document.querySelector('.cart-number');
            cartNumber.innerHTML = `<sup style="background : red; color: white; border-radius: 30%; padding: 3px">${summ}<sup>`
            return
        }
    }
    for (let i = 0; i < data.length; i++) {
        if (data[i].id == idd) {
            cart.push(data[i]);
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    let summ = cart_length(cart);
    let cartNumber = document.querySelector('.cart-number');
    cartNumber.innerHTML = `<sup style="background : red; color: white; border-radius: 30%; padding: 3px">${summ}<sup>`
}

function cart_button() {
    main.style.display = 'block';
    main.innerHTML = `
        <h1>Cart</h1>
        <div class="cartt">
        </div>
    `
    let pagination = document.getElementById('pagination');
    pagination.style.display = "none";
    let cart_div = document.querySelector('.cartt');
    cart.map((oneData) => {
        cart_div.innerHTML += `
        <div class="oneItemInCart">
            <img style="height:100px; width:100px;" src="https://image.tmdb.org/t/p/original/${oneData.poster_path}" >
            <h2> ${oneData.title} </h2>
            <div class="cart-buttons"> 
            <button onclick="add_item(event)"  id=${oneData.id}> + </button>
                ${oneData.count}
                <button onclick="remove_item(event)"  id=${oneData.id}> - </button>
            <div>
        </div>
        `
    })
}

function add_item(e) {
    let idd = e.target.id;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id == idd) {
            cart[i].count += 1;
        }
    }
    let cart_div = document.querySelector('.cartt');
    console.log(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
    cart_div.innerHTML = "";
    cart.map((oneData) => {
        cart_div.innerHTML += `
        <div class="oneItemInCart">
            <img style="height:100px; width:100px;" src="https://image.tmdb.org/t/p/original/${oneData.poster_path}" >
            <h2> ${oneData.title} </h2>
            <div class="cart-buttons"> 
            <button onclick="add_item(event)"  id=${oneData.id}> + </button>
                ${oneData.count}
                <button onclick="remove_item(event)"  id=${oneData.id}> - </button>
            <div>
        </div>
        `
    })
    let summ = cart_length(cart)
    let cartNumber = document.querySelector('.cart-number');
    cartNumber.innerHTML = `<sup style="background : red; color: white; border-radius: 30%; padding: 3px">${summ}<sup>`
}

let summ = cart_length(cart)
let cartNumber = document.querySelector('.cart-number');
cartNumber.innerHTML = `<sup style="background : red; color: white; border-radius: 30%; padding: 3px">${summ}<sup>`

function remove_item(e) {
    let idd = e.target.id;
    for (let i = 0; i < cart.length; i++) {
        if (idd == cart[i].id) {
            if (cart[i].count == 1) {
                cart.splice(i, 1);
            } else {
                cart[i].count -= 1;
            }
        }
    }
    let cart_div = document.querySelector('.cartt');
    console.log(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
    cart_div.innerHTML = "";
    cart.map((oneData) => {
        cart_div.innerHTML += `
        <div class="oneItemInCart">
            <img style="height:100px; width:100px;" src="https://image.tmdb.org/t/p/original/${oneData.poster_path}" >
            <h2> ${oneData.title} </h2>
            <div class="cart-buttons"> 
            <button onclick="add_item(event)"  id=${oneData.id}> + </button>
                ${oneData.count}
                <button onclick="remove_item(event)"  id=${oneData.id}> - </button>
            <div>
        </div>
        `
    })
    let summ = cart_length(cart)
    let cartNumber = document.querySelector('.cart-number');
    cartNumber.innerHTML = `<sup style="background : red; color: white; border-radius: 30%; padding: 3px">${summ}<sup>`
}

function cart_length(cart) {
    let sum = 0;
    for (let i = 0; i < cart.length; i++) {
        sum += cart[i].count;
    }
    return sum;
}

async function page_changing(e) {
    let id = e.target.id;
    let removeSome = document.getElementById(page);
    removeSome.classList.remove('active')
    if (id == "desc") {
        if (page < 2) {
            page = 1;
        } else {
            page = page - 1;
        }
    } else if (id == "inc") {
        if (page > 6) {
            page = 7;
        } else {
            page = page + 1;
        }
    } else {
        id = Number(id);
        page = id;
    }
    document.getElementById(page).classList.add("active")
    await api_calling(page);
    main.innerHTML = ""
    movie_mapping(data);
}

function movieSearch() {
    let searchTexts = document.querySelector('.input-search');
    let searchText = searchTexts.value;
    let datas = data.filter((oneData) => {
        if (oneData.title.toLowerCase().includes(searchText.toLowerCase())) {
            return oneData;
        }
    })

    main.innerHTML = "";
    // searchTexts.value = ""
    movie_mapping(datas);
}
