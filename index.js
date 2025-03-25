document.addEventListener("DOMContentLoaded", function () {
  fetchContent();
  cartEvents();
  updateTotal();
  addCartEvent();
  addFilterContent();
});

const sneakerContent = document.querySelector(".sneaker-content");
const casualContent = document.querySelector(".casual-content");
const sportContent = document.querySelector(".sport-content");
const slippersContent = document.querySelector(".slippers-content");


fetchDetails=[{
  url:"sneaker.json",
  content:sneakerContent,
  item:"sneaker"
},
{
  url:"casual.json",
  content:casualContent,
  item:"casual"
},
{
  url:"sport.json",
  content:sportContent,
  item:"sport"
},
{
  url:"slippers.json",
  content:slippersContent,
  item:"slippers"
}
]

// fetch json function //



function fetchContent() {

  fetchDetails.forEach((d) => {
    fetch(d.url)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        renderContent(data, d.content, d.item);
      })
      .catch((err) => console.log("error", err));
  });
}

function renderContent(data, content, item) {
  for (var i = 0; i < data.length; i++) {
    content.innerHTML += `<div class="shoes-box" data-item =${item}>
                  <div class="pic">
                      <img src=${data[i].image} class="shoes-img">
                  </div>
                  <h2 class="shoes-title">${data[i].shoes_name}</h2>
                  <span class="shoes-price">${data[i].shoes_price}</span>
                  <ion-icon name="cart" class="add-cart-btn"></ion-icon>
              </div>`;
  }
  addCartEvent();
}

let itemList = [];

// add to cart function //
var cartContent = document.querySelector(".cart-content");
function addCartEvent() {
  let addCartBtn = document.querySelectorAll(".add-cart-btn");
  addCartBtn.forEach((addbtn) => {
    addbtn.addEventListener("click", () => {
      let shoes = addbtn.parentElement;
      let shoesTitle = shoes.querySelector(".shoes-title").innerHTML;
      let shoesPrice = shoes.querySelector(".shoes-price").innerHTML;
      let shoesImg = shoes.querySelector(".shoes-img").src;
      let itemDetail = { title: shoesTitle, price: shoesPrice, image: shoesImg };
      if (itemList.find((ele) => ele.title == itemDetail.title)) {
        return;
      } else {
        itemList.push(itemDetail);
      }
      let productElement = `<div class="cart-box"> 
        <img src=${shoesImg} class="cart-img">
        <div class="cart-detail">
            <div class="cart-shoes-title">${shoesTitle}</div>
            <div class="cart-price-box">
                <div class="cart-price">${shoesPrice}</div>
                <div class="cart-amt">${shoesPrice}</div>
            </div>
            <input type="number" value="1" class="cart-quantity">
        </div>
        <ion-icon name="trash" class="cart-remove"> 
       </div>`;
      let newElement = document.createElement("div");
      newElement.innerHTML = productElement;
      cartContent.append(newElement);
      cartEvents();
      updateTotal();
    });
  });
}

// buttons function //
const cartBtn = document.querySelector(".cart-icon");
const cartMenu = document.querySelector(".cart-menu");
const cartCloseBtn = document.querySelector(".cart-close");
cartBtn.addEventListener("click", () => {
  cartMenu.classList.add("active");
});
cartCloseBtn.addEventListener("click", () => {
  cartMenu.classList.remove("active");
});

function cartEvents() {
  // remove cart menu items //

  let cartRemoveBtn = document.querySelectorAll(".cart-remove");
  cartRemoveBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      let title = btn.parentElement.querySelector(".cart-shoes-title").innerHTML;
      itemList = itemList.filter((el) => el.title != title);
      btn.parentElement.remove();
      updateTotal();
    });
  });

  // change quantity function //

  let quantityChange = document.querySelectorAll(".cart-quantity");
  quantityChange.forEach((input) => {
    input.addEventListener("change", () => {
      if (isNaN(input.value) || input.value < 1) {
        input.value = 1;
      }
      updateTotal();
    });
  });
}

//  add total function //
var cartCount;
var count;
var forTax;
function updateTotal() {
  var cartItems = document.querySelectorAll(".cart-box");
  var totalValue = document.querySelector(".total-price");

  let total = 0;

  cartItems.forEach((product) => {
    let priceElement = product.querySelector(".cart-price");
    let price = parseFloat(priceElement.innerHTML.replace("$.", ""));
    let qty = product.querySelector(".cart-quantity").value;
    let addPrice = price * qty;
    total += addPrice;
    product.querySelector(".cart-amt").innerHTML = "$." + addPrice;
  });

  totalValue.innerHTML = "$. " + total;
  forTax = total;
  // cart count function//
  cartCount = document.querySelector(".cart-count");
  let noCartFilter = document.querySelector(".no-cart-filter");
  count = itemList.length;
  cartCount.innerHTML = count;
  if (count == 0) {
    cartCount.style.display = "none";
    noCartFilter.classList.add("off");
  } else {
    cartCount.style.display = "block";
    noCartFilter.classList.remove("off");
  }
}
// filter container function //
let shoesBox;
const filterBtn = document.querySelector(".filter-btn");
const filterClick = document.querySelector(".filter-click");
const filterIcon = document.querySelector(".filter-icon");
const allContent = document.querySelector(".all-content");
const filterBox = document.querySelector(".filter-box");
const filterContent = document.querySelector(".filter-content");
const filterButtons = document.querySelectorAll(".filters");
const searchBox = document.getElementById("search");
filterBtn.addEventListener("click", () => {
  allContent.classList.add("off");
  filterBox.classList.remove("off");
  filterIcon.classList.add("active");
  footerBox.style.display = "none";
  addFilterContent();
});
filterClick.addEventListener("click", () => {
  allContent.classList.remove("off");
  filterBox.classList.add("off");
  filterIcon.classList.remove("active");
  receiptBox.classList.add("off");
  footerBox.style.display = "block";
  fetchContent();
  filterContent.innerHTML = "";
});
function addFilterContent() {
  shoesBox = document.querySelectorAll(".shoes-box");
  shoesBox.forEach((element) => {
    filterContent.append(element);
  });
}
// search button function //
let noResultFilter = document.querySelector(".no-result-filter");
searchBox.addEventListener("keyup", (e) => {
  searchText = e.target.value.toLowerCase().trim();
  let filterBoxLength = 0;
  shoesBox.forEach((shoes) => {
    const data = shoes.innerText.toLowerCase();
    if (data.includes(searchText)) {
      shoes.style.display = "block";
      filterBoxLength++;
    } else {
      shoes.style.display = "none";
    }
    filterButtons.forEach((button) => {
      button.classList.remove("active");
    });
    filterButtons[0].classList.add("active");
  });
  if (filterBoxLength == 0) {
    noResultFilter.classList.remove("off");
  } else {
    noResultFilter.classList.add("off");
  }
});
// filter buttons function //
filterButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    setActiveBtn(e);
    const btnFilter = e.target.dataset.filter;
    shoesBox.forEach((shoes) => {
      if (btnFilter == "all") {
        shoes.style.display = "block";
      } else {
        const shoesFilter = shoes.dataset.item;
        if (btnFilter == shoesFilter) {
          shoes.style.display = "block";
        } else {
          shoes.style.display = "none";
        }
      }
    });
  });
});

function setActiveBtn(e) {
  filterButtons.forEach((button) => {
    button.classList.remove("active");
  });
  e.target.classList.add("active");
}

// bill function //
const menuBtns = document.querySelector(".menu-buttons");
const backBtn = document.querySelector(".back-icon");
const footerBox = document.getElementById("footer");
function toBill() {
  receiptBox.classList.remove("off");
  allContent.classList.add("off");
  filterBox.classList.add("off");
  cartMenu.classList.remove("active");
  menuBtns.classList.add("off");
  backBtn.classList.remove("off");
  footerBox.style.display = "none";
}

function addTax() {
  let x = 0.05;
  let tax = x * forTax;
  let totalPay = forTax + tax;
  exportdata.push({ tax: "$. " + tax });
  exportdata.push({ total: "$. " + totalPay });
}

// place order function //
var exportdata = [];
const btnBuy = document.querySelector(".btn-buy");
function placeOrder() {
  let cartData = document.querySelectorAll(".cart-detail");

  let totalamt = document.querySelector(".total-price").innerHTML;
  if (count == 0) {
    alert("Your Cart is Empty, Please Order Something");
    return;
  } else {
    cartData.forEach((detail) => {
      let cartShoes = detail.querySelector(".cart-shoes-title").textContent;
      let cartPrice = detail.querySelector(".cart-price").textContent;
      let cartamt = detail.querySelector(".cart-amt").textContent;
      let cartqty = detail.querySelector(".cart-quantity").value;
      exportdata.push({
        ShoesName: cartShoes,
        ShoesPrice: cartPrice,
        TotalPrice: cartamt,
        quantity: cartqty,
      });
      toBill();
    });
  }
  exportdata.push({ subTotal: totalamt });
  //exportdata = data;
  addTax();
  createBill();
}
btnBuy.addEventListener("click", placeOrder);

// create ebill //
const eBill = document.querySelector(".e-bill");
function createBill() {
  const subTotalAmt = document.querySelector(".sub-total-amt");
  const taxAmt = document.querySelector(".tax-amt");
  const TotalAmt = document.querySelector(".full-total");
  for (let i = 0; i < exportdata.length; i++) {
    var table = exportdata[i];
    if (
      table.ShoesName &&
      table.ShoesPrice &&
      table.TotalPrice &&
      table.quantity
    ) {
      eBill.innerHTML += `<tr>
          <td>${table.ShoesName}</td>
          <td>${table.ShoesPrice}</td>
          <td>${table.quantity}</td>
          <td>${table.TotalPrice}</td>
      </tr>`;
    }
    if (table.subTotal) {
      subTotalAmt.innerHTML = table.subTotal;
    }
    if (table.tax) {
      taxAmt.innerHTML = table.tax;
    }
    if (table.total) {
      TotalAmt.innerHTML = table.total;
    }
  }
}
// receipt and address function //
const receiptBox = document.querySelector(".receipt-box");
const successBox = document.querySelector(".success-display");
const confirmBtn = document.querySelector(".confirm-order");
function toConfirmOrder() {
  var inputName = document.getElementById("input-name").value;
  var inputPhone = document.getElementById("input-phone").value;
  var inputDoor = document.getElementById("input-door").value;
  var inputStreet = document.getElementById("input-street").value;
  var inputCity = document.getElementById("input-city").value;
  var inputState = document.getElementById("input-state").value;
  var inputPin = document.getElementById("input-pin").value;

  var validName = /^[A-Za-z]+$/;
  var validPhone = /^\d{10}$/;
  var validPin = /^62\d{4}$/;

  if (
    !inputName ||
    !inputPhone ||
    !inputDoor ||
    !inputStreet ||
    !inputCity ||
    !inputState ||
    !inputPin
  ) {
    alert("Please fill in all the fields.");
    return;
  }

  if (!validName.test(inputName)) {
    alert("invalid Name");
    return;
  } else {
    exportdata.push({ Name: inputName });
    if (!validPhone.test(inputPhone)) {
      alert("invalid Phone");
      return;
    } else {
      exportdata.push({ PhoneNumber: inputPhone });
      if (!validPin.test(inputPin)) {
        alert("invalid pincode");
        return;
      } else {
        if (!inputDoor || !inputStreet) {
          alert("Please fill in all the fields.");
          return;
        } else {
          receiptBox.classList.add("off");
          backBtn.classList.add("off");
          successBox.classList.remove("off");
          exportdata.push({
            Address: {
              "DoorNo.": inputDoor,
              Street: inputStreet,
              City: inputCity,
              State: inputState,
              Pincode: inputPin,
            },
          });
        }
      }
    }
  }
  console.log(exportdata);
}
confirmBtn.addEventListener("click", toConfirmOrder);
// back button function//

function backToHome() {
  confirm("are you sure to go back");
  receiptBox.classList.add("off");
  allContent.classList.remove("off");
  menuBtns.classList.remove("off");
  backBtn.classList.add("off");
  footerBox.style.display = "block";
  exportdata = [];
  eBill.innerHTML = "";
  console.log(exportdata);
}
backBtn.addEventListener("click", backToHome);

// back to home page //

const refresh = document.querySelector(".refresh");
refresh.addEventListener("click", () => {
  window.location.reload();
});

function renderContent(data, content, item) {
  for (let i = 0; i < data.length; i++) {
    // Buat container untuk tiap item
    let shoesItem = document.createElement("div");
    shoesItem.className = "shoes-box";
    shoesItem.dataset.item = item;
    
    shoesItem.innerHTML = `
      <div class="pic">
        <img src="${data[i].image}" class="shoes-img" alt="${data[i].shoes_name}">
      </div>
      <h2 class="shoes-title">${data[i].shoes_name}</h2>
      <span class="shoes-price">${data[i].shoes_price}</span>
      <ion-icon name="cart" class="add-cart-btn"></ion-icon>
    `;
    
    // Tambahkan event listener pada gambar untuk mengarahkan ke halaman detail
    let imgElement = shoesItem.querySelector(".pic img");
    imgElement.addEventListener("click", () => {
      // Simpan data item ke localStorage
      localStorage.setItem("detailData", JSON.stringify(data[i]));
      // Pindah ke halaman detail
      window.location.href = "detail.html";
    });
    
    // Masukkan item ke dalam container yang dituju
    content.append(shoesItem);
  }
  addCartEvent();
}
