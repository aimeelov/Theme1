// Put your applicaiton javascript here

if( document.getElementById('sort_by') != null ) {
    document.querySelector('#sort_by').addEventListener('change', function(e) {
        var url = new URL(window.location.href);
        url.searchParams.set('sort_by', e.currentTarget.value);

        window.location = url.href;
    });
}

if( document.getElementById('AddressCountryNew') != null ) {
    document.getElementById('AddressCountryNew').addEventListener('change', function(e) {
        var provinces = this.options[this.selectedIndex].getAttribute('data-provinces');
        var provinceSelector = document.getElementById('AddressProvinceNew');
        var provinceArray = JSON.parse(provinces);

        //console.log(provinceArray);
        if(provinceArray.length < 1) {
            provinceSelector.setAttribute('disabled','disabled');
        } else {
            provinceSelector.removeAttribute('disabled');
        }

        provinceSelector.innerHTML = '';
        var options = '';
        for(var i = 0; i < provinceArray.length; i++) {
            options += '<option value="' + provinceArray[i][0] + '">' + provinceArray[i][0] + '</option>';
        }

        provinceSelector.innerHTML = options;
    });
}

if(document.getElementById("forgotPassword") != null) {
    document.getElementById("forgotPassword").addEventListener("click", function(e) {
        console.log("I clicked");
        const element = document.querySelector("#forgot_password_form");
        if(element.classList.contains("d-none")) {
            element.classList.remove("d-none");
            element.classList.add("d-block");
        }
    });
}

var localeItems = document.querySelectorAll("#localeItem");
if(localeItems.length > 0) {
    localeItems.forEach(item => {
        item.addEventListener("click", event => {
            document.getElementById("localeCode").value = item.getAttribute("lang");
            document.getElementById("localization_form_tag").submit();
        });
    });
}

var productInfoAnchors = document.querySelectorAll("#productInfoAnchor");

var productModal;

if( document.getElementById('productInfoModal') != null ) {
    productModal = new bootstrap.Modal(document.getElementById('productInfoModal'), {});
}

if(productInfoAnchors.length > 0) {
    productInfoAnchors.forEach(item => {
        item.addEventListener("click", event => {
            
            var url = '/products/' + item.getAttribute('product-handle') + '.js';

            fetch(url)
            .then((resp) => resp.json())
            .then(function(data) {
                console.log(data);

                document.getElementById("productInfoImg").src = data.images[0];
                document.getElementById("productInfoTitle").innerHTML = data.title;
                document.getElementById("productInfoPrice").innerHTML = item.getAttribute('product-price');
                document.getElementById("productInfoDescription").innerHTML = data.description;

                var variants = data.variants;
                var variantSelect = document.getElementById("modalItemID");

                variantSelect.innerHTML = '';

                variants.forEach(function( variant, index) {
                    console.log(variant);

                    variantSelect.options[variantSelect.options.length] = new Option(variant.option1, variant.id);
                });

                productModal.show();
            });

            
        });
    });
}

/* Testing Different Add to Cart Modal /*

var modalAddToCartForm = document.querySelector("#addToCartForm");

if( modalAddToCartForm != null ) {
    modalAddToCartForm.addEventListener("submit", function(e) {
        e.preventDefault();
    
        let formData = {
            'items': [
                {
                    'id': document.getElementById("modalItemID").value,
                    'quantity': document.getElementById("modalItemQuantity").value
                }
            ]
        };
    
        fetch('/cart/add.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then((resp) => { 
            return resp.json();
        })
        .then((data) => {
            update_cart();
        })
        .catch((err) => {
            console.error('Error: ' + err);
        })
    });
}

document.addEventListener('DOMContentLoaded', function() {
    update_cart();
});

function update_cart() {
    fetch('/cart.js')
    .then((resp) => resp.json())
    .then((data) => document.getElementById("numberOfCartItems").innerHTML = data.items.length)
    .catch((err) => console.error(err));
}
*/

var predictiveSearchInput = document.getElementById('searchInputField');
var timer;

var offcanvasSearch = document.getElementById('offcanvasSearchResult');
var bsOffcanvas = new bootstrap.Offcanvas(offcanvasSearch);

if(predictiveSearchInput != null) {
    predictiveSearchInput.addEventListener('input', function(e) {

        clearTimeout(timer);

        if(predictiveSearchInput.value) {
            timer = setTimeout(fetchPredictiveSearch, 3000);
        }

        
    });
}

function fetchPredictiveSearch() {
    fetch(`/search/suggest.json?q=${predictiveSearchInput.value}&resources[type]=product`)
    .then(resp => resp.json())
    .then(data => { 
        console.log(data);

        var products = data.resources.results.products;

        document.getElementById('search_results_body').innerHTML = '';

        products.forEach(function(product, index) {
            document.getElementById('search_results_body').innerHTML += `
                <div class="card" style="width: 19rem;">
                    <img src="${product.image} class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">$${product.price}</p>
                    </div>
                </div>
            `
        });
        bsOffcanvas.show();
    });
}

var cartCount = {{ cart.item_count }};

$(document).ready(function(){   
   {% if cart.item_count != 0 %}  
      $('#cart-number').replaceWith("<a href="/cart" id="cart-number">View cart (" + cartCount + ")</a>");
   {% endif %}

   $('.modal--overlay').on('click', function(){
      var overlay = $('.modal--overlay')
      closeModal(overlay)
    })
});

function addItem(form_id) {
   $.ajax({
      type: 'POST', 
      url: '/cart/add.js',
      dataType: 'json', 
      data: $('#'+form_id).serialize(),
      success: addToCartOk,
      error: addToCartFail
    });
}

function addToCartOk(product) { 
   cartCount++; 
   $('.modal').html('<span class="close" id="close">✕</span>' + product.title + ' was added to the cart!'); 
   $('#cart-number').replaceWith("<a href="/cart" id="cart-number">View cart (" + cartCount + ")</a>");
   openModal();
} 

function addToCartFail(obj, status) { 
    $('.modal').html('<span class="close" id="close">✕</span> The product you are trying to add is out of stock.'); 
   openModal()
 } 

//Modal Actions
//center modal based on window size
function centerModal(){
   var modal = $('.modal.open');
   var mWidth = modal.outerWidth()
   var mHeight = modal.outerHeight();
   var width = $(window).width();
   var height = $(window).height();
   if((width % 1) != 0){
      width = Math.round(width)
    }
   if((height % 1) != 0){
      height = Math.round(height)
   }
   var topPos = (height / 2) - (mHeight / 2);
   var leftPos = (width / 2) - (mWidth / 2);
   modal.css({top: topPos, left:leftPos})

 }

//open modal and overlay
function openModal(){
   $('.modal').removeClass('hidden').addClass('open');
   $('.modal--overlay').removeClass('hidden').addClass('open');
   $('body').css('overflow', 'hidden');
   centerModal();
}

//close modal and overlay
function closeModal(overlay){
   $(overlay).addClass('hidden').removeClass('open');
   $('.modal.open').addClass('hidden').removeClass('open');
   $('body').css('overflow', 'auto');
}


