/* /////////////////////////////// START USER LOGIN & REGISTER VAlIDATION /////////////////////////////// */

// get users from local storags
var users = JSON.parse(localStorage.getItem("Users")) || [];
var showMsg = document.createElement("div");

function loadUserData() {
  var user = JSON.parse(sessionStorage.getItem("user"));
  if (user) {
    document.getElementById("user").innerHTML = user.userFname;
    document.getElementById("user_login").innerHTML = "profile";
    document.getElementById("user_login").href = "/src/Pages/profile.html";
    document.getElementById("user_register").innerHTML = "logout";
    document.getElementById("user_register").href = "/src/Pages/logout.html";
  }
} // if user logged in show info in navbar

function profileInfo() {
  var user = JSON.parse(sessionStorage.getItem("user"));
  document.getElementById("profile_userFname").value = user.userFname;
  document.getElementById("profile_userLname").value = user.userLname;
  document.getElementById("profile_email").value = user.useremail;
  document
    .getElementById("profile_logout")
    .addEventListener("click", function () {
      location.replace("/src/Pages/logout.html");
    });
} // user profile page

// Registeration form
var newUserFName;
var newUserLName;
var newUserEmail;
var newUserPass;
var confirmPass;
const registeration = document.getElementById("registeration");
if (registeration) {
  registeration.addEventListener("submit", addNewUser);
} // when user submit to register
const regFName = document.getElementById("first_name");
const regLName = document.getElementById("last_name");
const regEmail = document.getElementById("email");
const regPass = document.getElementById("password");
const regConfirm = document.getElementById("password-confirm");
if (regFName) {
  regFName.addEventListener("keyup", function () {
    validateFName(regFName.value);
  });
} //first name validation

if (regLName) {
  regLName.addEventListener("keyup", function () {
    validateLName(regLName.value);
  });
} //last name validation

if (regEmail) {
  regEmail.addEventListener("keyup", function () {
    validateEmail(regEmail.value);
  });
} //email validation

if (regPass) {
  regPass.addEventListener("keyup", function () {
    validatePass(regPass.value);
  });
} //password validation

if (regConfirm) {
  regConfirm.addEventListener("keyup", function () {
    let pass = document.getElementById("password").value;
    let confirm = document.getElementById("password-confirm").value;
    validateMatchPass(pass, confirm);
  });
} //password and confirm password validation

function addNewUser(event) {
  event.preventDefault();
  // get form input values
  newUserFName = document.getElementById("first_name").value;
  newUserLName = document.getElementById("last_name").value;
  newUserEmail = document.getElementById("email").value;
  newUserPass = document.getElementById("password").value;
  confirmPass = document.getElementById("password-confirm").value;

  // First validation on empty fields
  let emptyResult = checkEmptyFields(
    newUserFName,
    newUserLName,
    newUserEmail,
    newUserPass,
    confirmPass
  );
  if (!emptyResult) {
    return errRegDiv.prepend(showMsg);
  }

  // Second validation on inputs regex
  let resultFNameRegex = validateFName(newUserFName); //first name input
  if (!resultFNameRegex) {
    failedMsg("First Name should be at least 3 characters");
    return errRegDiv.prepend(showMsg);
  }
  let resultLNameRegex = validateLName(newUserLName); //last name input
  if (!resultLNameRegex) {
    failedMsg("Last Name should be at least 3 characters");
    return errRegDiv.prepend(showMsg);
  }

  let resultEmailRegex = validateEmail(newUserEmail); //email input
  if (!resultEmailRegex) {
    failedMsg("Please enter valid email");
    return errRegDiv.prepend(showMsg);
  }

  let resultPassRegex = validatePass(newUserPass); //password input
  if (!resultPassRegex) {
    let errMsg = `<div>
                            <p class="my-0">Password should contains:</p>
                            <p class="my-0">Min 8 characters</p>
                            <p class="my-0">Max 16 characters</p>
                            <p class="my-0">Min 1 lowercase letter</p>
                            <p class="my-0">Min 1 uppercase letter</p>
                            <p class="my-0">Min 1 special character</p>
                            <p class="my-0">Min 1 number</p>
                      </div>`;
    failedMsg(errMsg);
    return errRegDiv.prepend(showMsg);
  }

  // Third validation on matching password and confirm password
  if (newUserPass != confirmPass) {
    failedMsg("Password and confirm password doesn't match");
    return errRegDiv.prepend(showMsg);
  }

  // Fourth validation on if user email already exists or not
  let resultUserExists = getUserInfo(newUserEmail);
  if (resultUserExists) {
    failedMsg("This email already exists");
    return errRegDiv.prepend(showMsg);
  }

  // insert user information to local storage
  let userData = {
    userFname: newUserFName,
    userLname: newUserLName,
    useremail: newUserEmail,
    userpassword: newUserPass,
  };
  users.push(userData);
  localStorage.setItem("Users", JSON.stringify(users)); // save user info to local storage
  sessionStorage.setItem("user", JSON.stringify(userData)); // save user info to session
  successMsg(
    "Registeration Success,<br/> Please wait unitll redirect to home page"
  );
  errRegDiv.appendChild(showMsg);
  // redirect to home page
  return redirect("/index.html", 1500);
} // end add new user function

// login form
var userEmail;
var userPass;
const errRegDiv = document.getElementById("registerErrors");
const errLoginDiv = document.getElementById("loginErrors");
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", login);
} // when user submit to login

function login(event) {
  event.preventDefault();
  // get form input values
  userEmail = document.getElementById("email").value;
  userPass = document.getElementById("password").value;

  // First validation on empty fields
  let emptyResult = checkEmptyFields(userEmail, userPass);
  if (!emptyResult) {
    return errLoginDiv.prepend(showMsg);
  }

  // Second validation on inputs regex
  let resultEmailRegex = validateEmail(userEmail); //email input
  if (!resultEmailRegex) {
    failedMsg("Please enter valid email");
    return errLoginDiv.prepend(showMsg);
  }

  // Third validation on user data exists in local storage or not

  // get user information from local storage by entered email
  let userInfo = getUserInfo(userEmail);

  // check entered email and password with email and password in local storage
  if (userEmail != userInfo.useremail || userPass != userInfo.userpassword) {
    failedMsg("Wrong email or password");
    return errLoginDiv.prepend(showMsg);
  }

  successMsg("Login Successfully");
  errLoginDiv.prepend(showMsg);
  sessionStorage.setItem("user", JSON.stringify(userInfo)); // save user info to session
  redirect("/index.html", 500);
} // end login function

function checkEmptyFields(...inputs) {
  for (let input of inputs) {
    if (input.length == 0) {
      failedMsg("All Fields Required");
      return false;
    }
  }
  return true;
} // end check empty fields function

function validateFName(name) {
  let nameRegex = /^([a-zA-Z ]){3,30}$/;
  if (nameRegex.test(name)) {
    document.getElementById("first_name_error").innerHTML =
      '<i class="fa-regular fa-circle-check text-success"></i>';
    return true;
  } else {
    document.getElementById("first_name_error").innerHTML =
      '<i class="fa-regular fa-circle-xmark text-danger"></i>';
    return false;
  }
} // end name validation function

function validateLName(name) {
  let nameRegex = /^([a-zA-Z ]){3,30}$/;
  if (nameRegex.test(name)) {
    document.getElementById("last_name_error").innerHTML =
      '<i class="fa-regular fa-circle-check text-success"></i>';
    return true;
  } else {
    document.getElementById("last_name_error").innerHTML =
      '<i class="fa-regular fa-circle-xmark text-danger"></i>';
    return false;
  }
} // end name validation function

function validateEmail(email) {
  let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (emailRegex.test(email)) {
    if (document.getElementById("email_error")) {
      document.getElementById("email_error").innerHTML =
        '<i class="fa-regular fa-circle-check text-success"></i>';
    }
    return true;
  } else {
    if (document.getElementById("email_error")) {
      document.getElementById("email_error").innerHTML =
        '<i class="fa-regular fa-circle-xmark text-danger"></i>';
    }
    return false;
  }
} // end email validation function

function validatePass(password) {
  let passRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,16}$/;
  if (passRegex.test(password)) {
    if (document.getElementById("password_error")) {
      document.getElementById("password_error").innerHTML =
        '<i class="fa-regular fa-circle-check text-success"></i>';
    }
    return true;
  } else {
    if (document.getElementById("password_error")) {
      document.getElementById("password_error").innerHTML =
        '<i class="fa-regular fa-circle-xmark text-danger"></i>';
    }
    return false;
  }
} // end name password function

function validateMatchPass(p, c) {
  if (c.length == 0) {
    document.getElementById("password-confirm_error").innerHTML =
      '<i class="fa-regular fa-circle-xmark text-danger"></i>';
    return false;
  }
  if (p == c) {
    document.getElementById("password-confirm_error").innerHTML =
      '<i class="fa-regular fa-circle-check text-success"></i>';
    return true;
  } else {
    document.getElementById("password-confirm_error").innerHTML =
      '<i class="fa-regular fa-circle-xmark text-danger"></i>';
    return false;
  }
} // end match password function

function redirect(href, time) {
  setTimeout(() => {
    location.href = href;
  }, time);
} // end redirect to another page function

function failedMsg(msg) {
  showMsg.classList.remove("alert-success");
  showMsg.classList.add("text-center", "alert", "alert-danger", "mt-4");
  showMsg.setAttribute("role", "alert");
  showMsg.innerHTML = msg;
} // end failed message function

function successMsg(msg) {
  showMsg.classList.remove("alert-danger");
  showMsg.classList.add("text-center", "alert", "alert-success", "mt-4");
  showMsg.setAttribute("role", "alert");
  showMsg.innerHTML = msg;
} // end success message function

function getUserInfo(email) {
  for (let user of users) {
    if (user.useremail == email) {
      return {
        userFname: user.userFname,
        userLname: user.userLname,
        useremail: user.useremail,
        userpassword: user.userpassword,
      };
    }
  }
  return false;
} // end check user if exists function

/* /////////////////////////////// END USER LOGIN & REGISTER VAlIDATION /////////////////////////////// */

/* /////////////////////////////// Start Scroll Up Button /////////////////////////////// */

const upBtn = document.getElementById("to_up");
if (upBtn) {
  window.onscroll = function () {
    if (
      document.body.scrollTop > 240 ||
      document.documentElement.scrollTop > 240
    ) {
      upBtn.style.display = "block";
    } else {
      upBtn.style.display = "none";
    }
  }; // show or hide button
  upBtn.addEventListener("click", function () {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }); // scroll to top page
}

/* /////////////////////////////// End Scroll Up Button /////////////////////////////// */

/* /////////////////////////////// Home, Shop and Single Products Pages/////////////////////////////// */

let products = [
  {
    id: 1,
    name: " Flowery shirt ",
    tag: " floweryshirt ",
    price: 15,
    brand: "H&M",
    src: "/src/assets/images/products/f3.jpg",
    categ: "men",
    descr:
      "gggggggri tempore? Iusto labore consectetur tempora laudantium cupiri tempore? Iusto labore consectetur tempora laudantium cupiggggggg",
    inCart: 0,
    discountPercentage: 30,
  },
  {
    id: 2,
    name: " ColorFul Shirt ",
    tag: " colorfulshirt ",
    price: 20,
    brand: "zara",
    src: "/src/assets/images/products/f1.jpg",
    categ: "men",
    descr:
      "ri tempore? Iusto labore consectetur tempora laudantium cupigggggggggggggg",
    inCart: 0,
    discountPercentage: 40,
  },
  {
    id: 3,
    name: " Cats Blouse ",
    tag: " catsblouse ",
    price: 20,
    brand: "H&M",
    src: "/src/assets/images/products/f8.jpg",
    categ: "women",
    descr: "ri tempore? Iusto labore consectetur tempora laudantium cupi",
    inCart: 0,
    discountPercentage: 40,
  },
  {
    id: 4,
    name: " White Flowers Shirt ",
    tag: " whiteflowersshirt ",
    price: 15,
    brand: "zara",
    src: "/src/assets/images/products/f2.jpg",
    categ: "men",
    descr:
      "turi tempore? Iusto labore consectetur tempora laudantium cupiditate atque magni ea co",
    inCart: 0,
    discountPercentage: 25,
  },
  {
    id: 5,
    name: " Baggy Trousers ",
    tag: " baggytrousers ",
    price: 15,
    brand: "H&M",
    src: "/src/assets/images/products/f7.jpg",
    categ: "women",
    descr: "kjbfndjnbvjnbjndjkfnjgnfnjkvnfknjkfdghfhdkuhkfdjvnhdfujk",
    inCart: 0,
    discountPercentage: 100,
  },
  {
    id: 6,
    name: " White Pink Shirt ",
    tag: " whitepinkshirt ",
    price: 15,
    brand: "zara",
    src: "/src/assets/images/products/f4.jpg",
    categ: "men",
    descr:
      "cing elit. Deleniti quos rem molestiae fuga ea explicabo aspernatur,",
    discountPercentage: 45,
    inCart: 0,
  },
  {
    id: 7,
    name: " Navy Blue Shirt ",
    tag: " navyblueshirt ",
    price: 20,
    brand: "zara",
    src: "/src/assets/images/products/f5.jpg",
    categ: "men",
    descr: "Lorem, ipsum dolor sit amet consectetur adipisifgfgfdbgbgf",
    discountPercentage: 10,
    inCart: 0,
  },
  {
    id: 8,
    name: " Orange Blue Shirt ",
    tag: " orangeblueshirt ",
    price: 15,
    brand: "H&M",
    src: "/src/assets/images/products/f6.jpg",
    categ: "men",
    descr: "gggggggggggggg",
    inCart: 0,
    discountPercentage: 3,
  },
  {
    id: 9,
    name: " Sky Blue Shirt ",
    tag: " skyblueshirt ",
    price: 25,
    brand: "H&M",
    src: "/src/assets/images/products/n1.jpg",
    categ: "men",
    descr: "gggggggggggggg",
    inCart: 0,
    discountPercentage: 20,
  },
  {
    id: 10,
    name: " Blue shirt ",
    tag: " blueshirt ",
    price: 20,
    brand: "H&M",
    src: "/src/assets/images/products/n2.jpg",
    categ: "men",
    descr:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti quos rem molestiae fuga ea explicabo aspernatur,",
    inCart: 0,
    discountPercentage: 96,
  },
  {
    id: 11,
    name: " White shirt ",
    tag: " whiteshirt ",
    price: 30,
    brand: "zara",
    src: "/src/assets/images/products/n3.jpg",
    categ: "men",
    descr:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elitexplicabo aspernatur,",
    inCart: 0,
    discountPercentage: 55,
  },

  {
    id: 12,
    name: " Green shirt ",
    tag: " greenshirt ",
    price: 15,
    brand: "zara",
    src: "/src/assets/images/products/n4.jpg",
    categ: "men",
    descr:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti quos rem molestiae fuga ea explicabo aspernatur,",
    inCart: 0,
    discountPercentage: 60,
  },
];
const procontainer = document.querySelector(".pro-container");
const procontainerNA = document.querySelector(".pro-containerNA");

function productsCreate(product, x, container) {
  // event.preventDefault()
  const newDiv = document.createElement("div");
  newDiv.classList.add("pro");
  // newDiv.classList.add("all"); tttttttttttttttttttttttttttttttttttttttttttttt
  newDiv.classList.add(product.categ);

  var img = document.createElement("img");
  img.src = product.src;
  img.setAttribute("id", product.id);
  newDiv.appendChild(img);

  const div2 = document.createElement("div");
  div2.classList.add("des");
  var span = document.createElement("span");
  var spanText = document.createTextNode(product.brand);
  span.appendChild(spanText);
  div2.appendChild(span);

  var h5 = document.createElement("h5");
  var h5Text = document.createTextNode(product.name);
  h5.appendChild(h5Text);
  div2.appendChild(h5);

  const div3 = document.createElement("div");
  div3.classList.add("star");
  for (let i = 0; i < 5; i++) {
    const iStar = document.createElement("i");
    // iStar.classList.add("fas fa-star");
    iStar.classList.add("fas");
    iStar.classList.add("fa-star");
    div3.appendChild(iStar);
  }
  div2.appendChild(div3);

  var h4 = document.createElement("h4");
  var h4Text = document.createTextNode("$" + product.price);
  h4.appendChild(h4Text);
  div2.appendChild(h4);

  newDiv.appendChild(div2);

  var a = document.createElement("a");
  // a.classList.add("add-cart cart1");
  a.classList.add("add-cart");
  a.classList.add("cart" + x);

  const iCart = document.createElement("i");
  // iCart.classList.add("fa-light fa-cart-shopping cart");
  iCart.classList.add("fa-solid");
  iCart.classList.add("fa-cart-plus");
  // <i class="fa-solid fa-cart-plus"></i>
  a.appendChild(iCart);
  newDiv.appendChild(a);

  // const desc= document.createElement("div");
  // desc.classList.add("pop-desc");
  // var pr = document.createElement("p");
  // var prText = document.createTextNode(product.descr);
  // pr.appendChild(prText);
  // pr.classList.add("p"+(x-1));
  // newDiv.appendChild(pr);

  container.appendChild(newDiv);
}

function productsload(productS, x) {
  if (x == 1) {
    for (let i = 0; i < productS.length; i++) {
      productsCreate(productS[i], i + 1, procontainerNA);
    }
    productpop = document.querySelectorAll(".pro-containerNA .pro img");
    carts = document.querySelectorAll(".add-cart");
    // console.log(productpop.length);
  } else if (x == 2) {
    for (let i = 0; i < 4; i++) {
      productsCreate(productS[i], i + 1, procontainer);
    }
  }
  // carts = document.querySelectorAll(".add-cart");
}

function onLoadCartNumbers() {
  let productNumbers = localStorage.getItem("cartNumbers");
  carts = document.querySelectorAll(".add-cart");
  if (productNumbers) {
    document.querySelector(".nav-cart span").textContent = productNumbers;
  }
}
function cartNumbers(product) {
  console.log("The prduct clicked is", product);
  let productNumbers = localStorage.getItem("cartNumbers");
  productNumbers = parseInt(productNumbers);
  if (productNumbers) {
    localStorage.setItem("cartNumbers", productNumbers + 1);
    document.querySelector(".nav-cart span").textContent = productNumbers + 1;
  } else {
    localStorage.setItem("cartNumbers", 1);
    document.querySelector(".nav-cart span").textContent = 1;
  }
  setItems(product);
}

function setItems(product) {
  // console.log("Inside of SetItems function");
  // console.log("My product is ", product);
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  // console.log("My cartItems are",cartItems);
  if (cartItems != null) {
    // cartItems
    if (cartItems[product.tag] == undefined) {
      cartItems = {
        ...cartItems,
        [product.tag]: product,
      };
    }
    cartItems[product.tag].inCart += 1;
  } else {
    product.inCart = 1;
    cartItems = {
      [product.tag]: product,
    };
  }
  localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}

function totalCost(product) {
  // console.log("The product price is ",product.price);
  let cartCost = localStorage.getItem("totalCost");
  // console.log ( " My cartCost is " , cartCost ) ;
  // console.log ( typeof cartCost ) ;
  if (cartCost != null) {
    cartCost = parseInt(cartCost);
    localStorage.setItem("totalCost", cartCost + product.price);
  } else {
    localStorage.setItem("totalCost", product.price);
  }
}

function displayCart() {
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  let productContainer = document.querySelector(".products");
  let cartCost = localStorage.getItem("totalCost");

  // console.log (cartItems) ;
  if (cartItems && productContainer) {
    productContainer.innerHTML = " ";
    Object.values(cartItems).map((item) => {
      productContainer.innerHTML += `
            <div class="product">
                <img src = ${item.src}>
                <span>${item.name}</span>
            </div>
            <div class = "price"> ${item.price},00</div>
            <div class = "quantity">
                <span>${item.inCart}</span>
                <i class="fa-solid fa-plus add-item"></i>
            </div>
            <div class="total">${item.inCart * item.price},00</div>
            `;
    });

    productContainer.innerHTML += `
        <div class = "basketTotalContainer">
            <h4 class = "basketTotalTitle">
                Basket Total
            </h4>
            <h4 class = "basketTotal">
                $${cartCost},00
            </h4>
        </div>
        <div class="checkout">
        <a href="/index.html"><button class="normal" >Shop More</button></a>
        <a href="/src/Pages/checkout.html"><button class="normal" >Proceed to check out</button></a>
      </div>
        `;
  }

  displayCheckout();
  let listorder = localStorage.getItem("listorder");
  listorder = JSON.parse(listorder);
  let remove = document.querySelectorAll(".remove-item");
  let add = document.querySelectorAll(".add-item");
  let reduce = document.querySelectorAll(".reduce-item");
  console.log("ahmed");
  //    for(let i=0; i< remove.length; i++){
  //         remove[i].addEventListener("click",()=>{
  //             // console.log("remove btn"+i);
  //             // console.log(products[0]);
  //             // removeCartItem(i);

  //         })
  //     }
  for (let i = 0; i < add.length; i++) {
    add[i].addEventListener("click", () => {
      console.log("add btn" + i);
      // console.log(listorder.length +" list order")
      // console.log(listorder[3]);
      cartNumbers(products[listorder[i]]);
      console.log("after caetsnumber");
      totalCost(products[listorder[i]]);
      displayCart();
    });
  }
  //    for(let i=0; i< reduce.length; i++){
  //         reduce[i].addEventListener("click",()=>{
  //             console.log("reduce btn"+i);
  //         })
  //     }
}

function displayCheckout() {
  let cartItems = localStorage.getItem("productsInCart");
  cartItems = JSON.parse(cartItems);
  let productContainer = document.querySelector(".products-check");
  let cartCost = localStorage.getItem("totalCost");

  // console.log (cartItems) ;
  if (cartItems && productContainer) {
    productContainer.innerHTML = " ";
    Object.values(cartItems).map((item) => {
      productContainer.innerHTML += `
            <div class="product">
                <img src = ${item.src}>
                <span>${item.name}</span>
            </div>
            <div class = "price"> ${item.price},00</div>
            <div class = "quantity">
                <span>${item.inCart}</span>
            </div>
            <div class="total">${item.inCart * item.price},00</div>
            `;
    });

    productContainer.innerHTML += `
        <div class = "basketTotalContainer">
            <h4 class = "basketTotalTitle">
                Basket Total
            </h4>
            <h4 class = "basketTotal">
                $${cartCost},00
            </h4>
        </div>
        `;
  }
}

function saveListOrderLocal(x) {
  let arr;
  if (localStorage.getItem("listorder") === null) {
    arr = [];
  } else {
    arr = JSON.parse(localStorage.getItem("listorder"));
  }

  arr.push(x);
  localStorage.setItem("listorder", JSON.stringify(arr));
}

var arr = [];
function onGoing() {
  var carts = document.querySelectorAll(".add-cart");
  // console.log("sahm");
  for (let i = 0; i < carts.length; i++) {
    // console.log("sahm");
    carts[i].addEventListener("click", () => {
      if (i >= 4) {
        let j = i - 4;
        // console.log("added over cart "+i);
        // console.log("added over cart j"+j);
        if (!arr.includes(j)) {
          saveListOrderLocal(j);
        }
        cartNumbers(products[j]);
        totalCost(products[j]);
      } else {
        if (!arr.includes(i)) {
          saveListOrderLocal(i);
        }
        // console.log("added tyyyyyyyyyo cart "+i);
        cartNumbers(products[i]);
        totalCost(products[i]);
      }
    });
  }
  // for(let i=0; i< productpop.length; i++){
  //     productpop[i].addEventListener("click",()=>{
  //         console.log("added to cart "+i);
  //         // showpopup(products[i])
  //         showP(productpop[i]);
  //         window.location.href = "/src/Pages/singleProduct.html";
  //         // productpop[i].getElementsByTagName("p").style.display="block";
  //         // document.querySelector(".p"+i).style.display=" ";
  //         // console.log(document.querySelector(".p"+i));
  //     })
  // }
}

onLoadCartNumbers();

displayCart();

productsload(products, 2);
productsload(products, 1);

onGoing();

/* /////////////////////////////// Start PRODUCT FILTER /////////////////////////////// */

const productsFilter = document.querySelectorAll(".pro");
// console.log(productsFilter);
const categories = document.querySelectorAll(".category");

for (var i = 0; i < categories.length; i++) {
  categories[i].addEventListener("click", function () {
    var current = document.getElementsByClassName("active-category");
    current[0].classList.remove("active-category");
    this.classList.add("active-category");
  });
}

document
  .querySelector(".products-categroy")
  .addEventListener("click", (event) => {
    if (event.target.tagName != "LI") return false;
    let filter = event.target.dataset["f"];

    productsFilter.forEach((elem) => {
      elem.classList.remove("hide");
      if (!elem.classList.contains(filter) && filter !== "all") {
        elem.classList.add("hide");
      }
    });
  });

/* /////////////////////////////// END PRODUCT FILTER /////////////////////////////// */

let proo = document.querySelectorAll(".pro-containerNA .pro img");

for (let i = 0; i < proo.length; i++) {
  proo[i].addEventListener("click", () => {
    let idPr = proo[i].getAttribute("id");
    let proddet = products[i].id;
    if (idPr == proddet) {
      prodPage(proddet);
    }
  });
}
function prodPage(id) {
  //  window.location.replace("/src/Pages/productDet.html");
  let o = products.find((elm) => {
    return elm.id == id;
  });
  let desc = `
  <section class="container">
  <div  py-3">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6 col-xl-4">
        <div class="card" style="border-radius: 15px;">
          <div class="bg-image hover-overlay ripple ripple-surface ripple-surface-light"
            data-mdb-ripple-color="light">
            <img src="${o.src}"
              style="border-top-left-radius: 15px; border-top-right-radius: 15px;" class="img-fluid"
              alt="Laptop" />
            <a href="#!">
              <div class="mask"></div>
            </a>
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div>
                <p class='fs-4 fw-bold link-unstyled'><a href="#!" class="text-dark text-uppercase">${o.name}</a></p>
               <hr>
                <p class="small text-muted text-red">${o.categ}</p>
                <p class="small">${o.descr}</p>
              </div>
              <div>
                <div class="d-flex flex-row justify-content-end mt-1 mb-4 text-danger">
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                  <i class="fas fa-star"></i>
                </div>
              </div>
            </div>
          </div>
          <hr class="my-0" />
          <div class="card-body pb-0">
            <div class="d-flex justify-content-between">
              <p><a href="#!" class="text-dark fw-bold fs-4 bg-danger text-white rounded p-2 ro">${o.price} $</a></p>
              <p class="text-dark">#### 8787</p>
            </div>
            <p class="small text-muted">VISA Platinum</p>
          </div>
          <hr class="my-0" />
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center pb-2 mb-1">
              <a href="index.html" class="text-dark fw-bold">Cancel</a>
              <button onclick='fun()' class="btn btn-primary" onclick='onGoing()'>Add To cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`;
  //location.replace('/src/Pages/productDet.html')
  procontainerNA.innerHTML = desc;
  location.href = "#pRoductS";
  //prod.innerHTML = desc;
}

/* /////////////////////////////// Start Scroll Up Button /////////////////////////////// */
