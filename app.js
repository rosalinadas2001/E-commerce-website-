/**
 * ShopEase - Main Application Logic
 * Modern Vanilla JS implementation for multi-view navigation, filtering, search, cart, wishlist, auth, and modals.
 */

// Global State
const state = {
  products: [...productsData],
  selectedCategories: new Set(),
  selectedPriceRange: "all",
  selectedBrands: new Set(),
  minRating: null,
  searchQuery: "",
  sortBy: "popularity",
  viewMode: "grid",
  currentPage: 1,
  itemsPerPage: 8,
  currentView: "home",
  currentUser: null, // set when user signs in
  
  // User Orders History
  orders: JSON.parse(localStorage.getItem("shopease_orders") || "null") || [
    {
      id: "#SE-849201",
      date: "Oct 10, 2026, 02:45 PM",
      status: "Delivered",
      step: 4,
      items: [
        {
          id: 1,
          name: "Apple iPhone 15",
          price: 79900,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80",
          category: "Electronics"
        },
        {
          id: 2,
          name: "Sony WH-1000XM5 Headphones",
          price: 24990,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
          category: "Electronics"
        }
      ],
      total: "₹1,04,890",
      shipping: "FREE"
    }
  ],

  // Pre-loaded cart items matching reference mockup "2 My Cart"
  cart: [
    {
      id: 1,
      name: "Apple iPhone 15",
      price: 79900,
      originalPrice: 89900,
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80",
      quantity: 1
    },
    {
      id: 2,
      name: "Sony WH-1000XM5 Headphones",
      price: 24990,
      originalPrice: 29990,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      quantity: 1
    }
  ],
  wishlist: new Set(),
  appliedDiscountPercent: 0,
  activeCouponCode: ""
};

// DOM Elements
const DOM = {
  // Navigation & Views
  navLinks: document.querySelectorAll(".nav-link"),
  viewContents: document.querySelectorAll(".view-content"),
  
  // Shop Product View & Filter Panel
  productsGrid: document.getElementById("productsGrid"),
  emptyState: document.getElementById("emptyState"),
  paginationContainer: document.getElementById("paginationContainer"),
  resultsCount: document.getElementById("resultsCount"),
  mobileProductCount: document.getElementById("mobileProductCount"),
  activeFilterTags: document.getElementById("activeFilterTags"),
  productSearchInput: document.getElementById("productSearchInput"),
  clearSearchBtn: document.getElementById("clearSearchBtn"),
  sortSelect: document.getElementById("sortSelect"),
  gridViewBtn: document.getElementById("gridViewBtn"),
  listViewBtn: document.getElementById("listViewBtn"),
  emptyResetBtn: document.getElementById("emptyResetBtn"),
  
  // Filter Panel Elements
  navFilterProductsBtn: document.getElementById("navFilterProductsBtn"),
  navFilterBadge: document.getElementById("navFilterBadge"),
  toolbarFilterBtn: document.getElementById("toolbarFilterBtn"),
  toolbarFilterBadge: document.getElementById("toolbarFilterBadge"),
  mobileFilterBadge: document.getElementById("mobileFilterBadge"),
  filterPanelOverlay: document.getElementById("filterPanelOverlay"),
  filterPanelDrawer: document.getElementById("filterPanelDrawer"),
  closeFilterPanelBtn: document.getElementById("closeFilterPanelBtn"),
  panelClearAllBtn: document.getElementById("panelClearAllBtn"),
  panelInlineResetBtn: document.getElementById("panelInlineResetBtn"),
  panelApplyFiltersBtn: document.getElementById("panelApplyFiltersBtn"),
  panelApplyBadge: document.getElementById("panelApplyBadge"),
  panelActiveSummary: document.getElementById("panelActiveSummary"),
  panelActiveCountText: document.getElementById("panelActiveCountText"),
  catSelectedBadge: document.getElementById("catSelectedBadge"),
  brandSelectedBadge: document.getElementById("brandSelectedBadge"),
  mobileMenuBtn: document.getElementById("mobileMenuBtn"),
  navMenu: document.getElementById("navMenu"),
  
  // Cart Drawer
  cartOverlay: document.getElementById("cartOverlay"),
  cartDrawer: document.getElementById("cartDrawer"),
  openCartBtn: document.getElementById("openCartBtn"),
  closeCartBtn: document.getElementById("closeCartBtn"),
  cartBadge: document.getElementById("cartBadge"),
  cartHeaderCount: document.getElementById("cartHeaderCount"),
  cartItemsList: document.getElementById("cartItemsList"),
  shippingProgressFill: document.getElementById("shippingProgressFill"),
  shippingProgressText: document.getElementById("shippingProgressText"),
  billSubtotal: document.getElementById("billSubtotal"),
  billDiscountRow: document.getElementById("billDiscountRow"),
  billDiscount: document.getElementById("billDiscount"),
  billShipping: document.getElementById("billShipping"),
  billTotal: document.getElementById("billTotal"),
  couponInput: document.getElementById("couponInput"),
  applyCouponBtn: document.getElementById("applyCouponBtn"),
  couponFeedback: document.getElementById("couponFeedback"),
  checkoutBtn: document.getElementById("checkoutBtn"),
  
  // Wishlist Drawer & Header
  wishlistHeaderBtn: document.getElementById("wishlistHeaderBtn"),
  wishlistBadge: document.getElementById("wishlistBadge"),
  wishlistOverlay: document.getElementById("wishlistOverlay"),
  wishlistDrawer: document.getElementById("wishlistDrawer"),
  closeWishlistBtn: document.getElementById("closeWishlistBtn"),
  wishlistHeaderCount: document.getElementById("wishlistHeaderCount"),
  wishlistItemsList: document.getElementById("wishlistItemsList"),
  clearAllWishlistBtn: document.getElementById("clearAllWishlistBtn"),
  moveAllWishlistToCartBtn: document.getElementById("moveAllWishlistToCartBtn"),
  
  // Quick Search Modal
  quickSearchBtn: document.getElementById("quickSearchBtn"),
  searchModal: document.getElementById("searchModal"),
  closeSearchModalBtn: document.getElementById("closeSearchModalBtn"),
  modalSearchInput: document.getElementById("modalSearchInput"),
  modalClearSearchBtn: document.getElementById("modalClearSearchBtn"),
  searchLiveResults: document.getElementById("searchLiveResults"),
  
  // Auth Modal & User Account
  userAccountBtn: document.getElementById("userAccountBtn"),
  userBtnText: document.getElementById("userBtnText"),
  userDropdownMenu: document.getElementById("userDropdownMenu"),
  authModal: document.getElementById("authModal"),
  closeAuthModalBtn: document.getElementById("closeAuthModalBtn"),
  tabSignInBtn: document.getElementById("tabSignInBtn"),
  tabSignUpBtn: document.getElementById("tabSignUpBtn"),
  signInForm: document.getElementById("signInForm"),
  signUpForm: document.getElementById("signUpForm"),
  menuLogoutBtn: document.getElementById("menuLogoutBtn"),
  menuMyOrders: document.getElementById("menuMyOrders"),
  menuMyWishlist: document.getElementById("menuMyWishlist"),
  
  // Orders Modal
  ordersModal: document.getElementById("ordersModal"),
  closeOrdersModalBtn: document.getElementById("closeOrdersModalBtn"),
  ordersCountBadge: document.getElementById("ordersCountBadge"),
  ordersListContainer: document.getElementById("ordersListContainer"),
  viewMyOrdersBtn: document.getElementById("viewMyOrdersBtn"),
  
  // Modals
  quickViewModal: document.getElementById("quickViewModal"),
  quickViewCloseBtn: document.getElementById("quickViewCloseBtn"),
  quickViewBody: document.getElementById("quickViewBody"),
  checkoutModal: document.getElementById("checkoutModal"),
  orderSuccessDoneBtn: document.getElementById("orderSuccessDoneBtn"),
  orderIdDisplay: document.getElementById("orderIdDisplay"),
  orderSummaryBox: document.getElementById("orderSummaryBox"),
  
  // Contact Form & FAQs & Live Chat
  contactForm: document.getElementById("contactForm"),
  liveChatToggleBtn: document.getElementById("liveChatToggleBtn"),
  liveChatBox: document.getElementById("liveChatBox"),
  closeLiveChatBtn: document.getElementById("closeLiveChatBtn"),
  contactStartChatBtn: document.getElementById("contactStartChatBtn"),
  chatMessages: document.getElementById("chatMessages"),
  chatInputForm: document.getElementById("chatInputForm"),
  chatInputField: document.getElementById("chatInputField"),
  copyPhoneBtn: document.getElementById("copyPhoneBtn"),
  copyEmailBtn: document.getElementById("copyEmailBtn"),
  copyAddressBtn: document.getElementById("copyAddressBtn"),
  openMapsBtn: document.getElementById("openMapsBtn"),
  callNowBtn: document.getElementById("callNowBtn"),
  sendEmailBtn: document.getElementById("sendEmailBtn"),
  
  // Toast & Mobile Triggers
  toastContainer: document.getElementById("toastContainer"),
  mobileFilterOpenBtn: document.getElementById("mobileFilterOpenBtn"),

  // Customer Service Policies Modal
  policyModal: document.getElementById("policyModal"),
  policyModalTitle: document.getElementById("policyModalTitle"),
  policyModalSubtitle: document.getElementById("policyModalSubtitle"),
  policyHeaderIcon: document.getElementById("policyHeaderIcon"),
  policyModalBody: document.getElementById("policyModalBody"),
  closePolicyModalBtn: document.getElementById("closePolicyModalBtn"),
  policyCloseOkBtn: document.getElementById("policyCloseOkBtn"),
  policyContactUsBtn: document.getElementById("policyContactUsBtn"),
  footerHelpFaqLink: document.getElementById("footerHelpFaqLink"),
  footerShippingLink: document.getElementById("footerShippingLink"),
  footerReturnLink: document.getElementById("footerReturnLink"),
  footerTermsLink: document.getElementById("footerTermsLink")
};

/* ==========================================================================
   Utilities
   ========================================================================== */
function formatINR(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = "toast";
  
  const iconSvg = type === "success" 
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

  toast.innerHTML = `
    <span class="toast-icon">${iconSvg}</span>
    <span>${message}</span>
  `;

  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

/* ==========================================================================
   View Navigation System (Home, Shop, About, Contact)
   ========================================================================== */
function switchView(viewName, updateHistory = true) {
  const validViews = ["home", "shop", "about", "contact"];
  if (!validViews.includes(viewName)) {
    viewName = "home";
  }
  state.currentView = viewName;

  // Update views visibility
  const targetId = `view${viewName.charAt(0).toUpperCase() + viewName.slice(1)}`;
  DOM.viewContents.forEach(view => {
    if (view.id === targetId) {
      view.classList.add("active");
    } else {
      view.classList.remove("active");
    }
  });

  // Update header navigation active states
  DOM.navLinks.forEach(link => {
    if (link.dataset.view === viewName) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Keep URL hash in sync with current view
  if (updateHistory) {
    if (window.location.hash !== `#${viewName}`) {
      window.history.pushState(null, "", `#${viewName}`);
    }
  }

  // Smooth scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ==========================================================================
   Filtering & Sorting Engine
   ========================================================================== */
function getFilteredAndSortedProducts() {
  let list = [...state.products];

  // 1. Category Filter
  if (state.selectedCategories.size > 0) {
    list = list.filter(p => state.selectedCategories.has(p.category));
  }

  // 2. Price Range Filter
  if (state.selectedPriceRange !== "all") {
    switch (state.selectedPriceRange) {
      case "0-500":
        list = list.filter(p => p.price <= 500);
        break;
      case "501-1000":
        list = list.filter(p => p.price > 500 && p.price <= 1000);
        break;
      case "1001-2000":
        list = list.filter(p => p.price > 1000 && p.price <= 2000);
        break;
      case "2001-5000":
        list = list.filter(p => p.price > 2000 && p.price <= 5000);
        break;
      case "5001-plus":
        list = list.filter(p => p.price > 5000);
        break;
    }
  }

  // 3. Brand Filter
  if (state.selectedBrands.size > 0) {
    list = list.filter(p => state.selectedBrands.has(p.brand));
  }

  // 4. Rating Filter
  if (state.minRating !== null) {
    list = list.filter(p => p.rating >= state.minRating);
  }

  // 5. Search Query
  if (state.searchQuery.trim() !== "") {
    const q = state.searchQuery.toLowerCase().trim();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  // 6. Sorting
  switch (state.sortBy) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      list.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || b.id - a.id);
      break;
    case "popularity":
    default:
      list.sort((a, b) => (b.priority || 0) - (a.priority || 0) || (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || b.reviewsCount - a.reviewsCount);
      break;
  }

  return list;
}

/* ==========================================================================
   Product Rendering
   ========================================================================== */
function renderProducts() {
  const filtered = getFilteredAndSortedProducts();
  const totalCount = filtered.length;

  if (totalCount === 0) {
    DOM.productsGrid.style.display = "none";
    DOM.emptyState.style.display = "flex";
    DOM.paginationContainer.style.display = "none";
    DOM.resultsCount.textContent = "Showing 0 products";
    DOM.mobileProductCount.textContent = "Showing 0 products";
    renderActiveFilterPills();
    return;
  }

  DOM.productsGrid.style.display = "grid";
  DOM.emptyState.style.display = "none";
  DOM.paginationContainer.style.display = "flex";

  const totalPages = Math.ceil(totalCount / state.itemsPerPage);
  if (state.currentPage > totalPages) {
    state.currentPage = totalPages;
  }
  const startIndex = (state.currentPage - 1) * state.itemsPerPage;
  const endIndex = Math.min(startIndex + state.itemsPerPage, totalCount);
  const pageProducts = filtered.slice(startIndex, endIndex);

  DOM.resultsCount.textContent = `Showing ${startIndex + 1}–${endIndex} of ${totalCount} products`;
  DOM.mobileProductCount.textContent = `Showing ${startIndex + 1}–${endIndex} of ${totalCount}`;

  DOM.productsGrid.className = state.viewMode === "list" ? "products-grid list-view" : "products-grid";
  DOM.productsGrid.innerHTML = pageProducts.map(p => createProductCardHTML(p)).join("");

  renderActiveFilterPills();
  renderPagination(totalPages);
}

function createProductCardHTML(product) {
  const isWishlisted = state.wishlist.has(product.id);
  const badgeHTML = product.badge 
    ? `<span class="product-badge badge-${product.badgeType}">${product.badge}</span>` 
    : `<span></span>`;

  return `
    <article class="product-card" data-id="${product.id}">
      <div class="card-top-row">
        ${badgeHTML}
        <button class="wishlist-btn ${isWishlisted ? "active" : ""}" 
                data-wishlist-id="${product.id}" 
                title="${isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}" 
                aria-label="Wishlist">
          <svg viewBox="0 0 24 24" fill="${isWishlisted ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

      <div class="card-image-box" data-quickview-id="${product.id}">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <button class="quick-view-overlay-btn" data-quickview-id="${product.id}">Quick View</button>
      </div>

      <div class="card-details">
        <h3 class="product-title" data-quickview-id="${product.id}" title="${product.name}">${product.name}</h3>

        ${state.viewMode === "list" ? `<p class="product-description">${product.description}</p>` : ""}

        <div class="product-rating-row">
          <div class="stars-track">
            ${generateStarRatingHTML(product.rating)}
          </div>
          <span class="rating-score">${product.rating.toFixed(1)}</span>
          <span class="review-count">(${product.reviewsCount})</span>
        </div>

        ${state.viewMode === "list" ? "" : `
          <div class="product-price-row">
            <span class="current-price">${formatINR(product.price)}</span>
            ${product.originalPrice ? `<span class="original-price">${formatINR(product.originalPrice)}</span>` : ""}
            ${product.discount ? `<span class="discount-tag">${product.discount}</span>` : ""}
          </div>

          <button class="add-to-cart-btn" data-cart-id="${product.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span>Add to Cart</span>
          </button>
        `}
      </div>

      ${state.viewMode === "list" ? `
        <div class="card-actions-col">
          <div class="product-price-row">
            <span class="current-price">${formatINR(product.price)}</span>
            ${product.originalPrice ? `<span class="original-price">${formatINR(product.originalPrice)}</span>` : ""}
            ${product.discount ? `<span class="discount-tag">${product.discount}</span>` : ""}
          </div>
          <button class="add-to-cart-btn" data-cart-id="${product.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span>Add to Cart</span>
          </button>
        </div>
      ` : ""}
    </article>
  `;
}

function generateStarRatingHTML(rating) {
  let stars = "";
  const rounded = Math.round(rating);
  for (let i = 1; i <= 5; i++) {
    stars += `<span class="star ${i <= rounded ? "filled" : ""}">★</span>`;
  }
  return stars;
}

/* ==========================================================================
   Active Filter Pills
   ========================================================================== */
function renderActiveFilterPills() {
  const pills = [];

  state.selectedCategories.forEach(cat => {
    pills.push(`
      <span class="filter-pill">
        Category: ${cat}
        <button data-remove-cat="${cat}" aria-label="Remove category">&times;</button>
      </span>
    `);
  });

  if (state.selectedPriceRange !== "all") {
    let label = state.selectedPriceRange;
    if (label === "0-500") label = "₹0–₹500";
    if (label === "501-1000") label = "₹501–₹1,000";
    if (label === "1001-2000") label = "₹1,001–₹2,000";
    if (label === "2001-5000") label = "₹2,001–₹5,000";
    if (label === "5001-plus") label = "₹5,001+";

    pills.push(`
      <span class="filter-pill">
        Price: ${label}
        <button data-remove-price="true" aria-label="Remove price filter">&times;</button>
      </span>
    `);
  }

  state.selectedBrands.forEach(b => {
    pills.push(`
      <span class="filter-pill">
        Brand: ${b}
        <button data-remove-brand="${b}" aria-label="Remove brand">&times;</button>
      </span>
    `);
  });

  if (state.minRating !== null) {
    pills.push(`
      <span class="filter-pill">
        Rating: ${state.minRating}★ & Up
        <button data-remove-rating="true" aria-label="Remove rating filter">&times;</button>
      </span>
    `);
  }

  if (state.searchQuery.trim() !== "") {
    pills.push(`
      <span class="filter-pill">
        Search: "${state.searchQuery}"
        <button data-remove-search="true" aria-label="Remove search query">&times;</button>
      </span>
    `);
  }

  DOM.activeFilterTags.innerHTML = pills.join("");
}

/* ==========================================================================
   Pagination Rendering
   ========================================================================== */
function renderPagination(totalPages) {
  if (totalPages <= 1) {
    DOM.paginationContainer.innerHTML = "";
    return;
  }

  let html = `
    <button class="page-btn ${state.currentPage === 1 ? "disabled" : ""}" data-page="${state.currentPage - 1}" title="Previous Page">
      ‹
    </button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <button class="page-btn ${state.currentPage === i ? "active" : ""}" data-page="${i}">
        ${i}
      </button>
    `;
  }

  html += `
    <button class="page-btn ${state.currentPage === totalPages ? "disabled" : ""}" data-page="${state.currentPage + 1}" title="Next Page">
      ›
    </button>
  `;

  DOM.paginationContainer.innerHTML = html;
}

/* ==========================================================================
   Shopping Cart Engine
   ========================================================================== */
function addToCart(productId) {
  const product = state.products.find(p => p.id === Number(productId));
  if (!product) return;

  const existing = state.cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      quantity: 1
    });
  }

  updateCartUI();
  showToast(`Added "${product.name}" to cart!`);
}

function updateCartQuantity(productId, delta) {
  const item = state.cart.find(i => i.id === Number(productId));
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  updateCartUI();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(i => i.id !== Number(productId));
  updateCartUI();
  showToast("Item removed from cart");
}

function updateCartUI() {
  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  DOM.cartBadge.textContent = totalItems;
  DOM.cartHeaderCount.textContent = `(${totalItems} ${totalItems === 1 ? "item" : "items"})`;

  if (state.cart.length === 0) {
    DOM.cartItemsList.innerHTML = `
      <div class="cart-empty-message">
        <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" style="width: 52px; height: 52px; margin: 0 auto 12px;">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <p>Your shopping cart is empty.</p>
        <button class="primary-btn" id="cartShopNowBtn">Start Shopping</button>
      </div>
    `;

    const shopNowBtn = document.getElementById("cartShopNowBtn");
    if (shopNowBtn) {
      shopNowBtn.addEventListener("click", () => {
        closeCart();
        switchView("shop");
      });
    }
  } else {
    DOM.cartItemsList.innerHTML = state.cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <h4 class="cart-item-name">${item.name}</h4>
          <span class="cart-item-price">${formatINR(item.price)}</span>
          <div class="cart-item-controls">
            <div class="qty-stepper">
              <button class="qty-btn" data-qty-id="${item.id}" data-delta="-1">−</button>
              <span class="qty-num">${item.quantity}</span>
              <button class="qty-btn" data-qty-id="${item.id}" data-delta="1">+</button>
            </div>
            <button class="remove-item-btn" data-remove-cart="${item.id}">Remove</button>
          </div>
        </div>
      </div>
    `).join("");
  }

  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * (state.appliedDiscountPercent / 100));
  const shippingThreshold = 2000;
  const isFreeShipping = subtotal >= shippingThreshold || subtotal === 0;
  const shippingCost = isFreeShipping ? 0 : 99;
  const grandTotal = subtotal - discountAmount + (subtotal === 0 ? 0 : shippingCost);

  DOM.billSubtotal.textContent = formatINR(subtotal);

  if (discountAmount > 0) {
    DOM.billDiscountRow.style.display = "flex";
    DOM.billDiscount.textContent = `-${formatINR(discountAmount)}`;
  } else {
    DOM.billDiscountRow.style.display = "none";
  }

  DOM.billShipping.textContent = isFreeShipping ? "FREE" : formatINR(shippingCost);
  DOM.billTotal.textContent = formatINR(grandTotal);

  if (subtotal >= shippingThreshold) {
    DOM.shippingProgressFill.style.width = "100%";
    DOM.shippingProgressText.innerHTML = `🎉 Congratulations! You unlocked <strong>FREE Express Delivery</strong>!`;
  } else {
    const diff = shippingThreshold - subtotal;
    const pct = Math.min(Math.round((subtotal / shippingThreshold) * 100), 100);
    DOM.shippingProgressFill.style.width = `${pct}%`;
    DOM.shippingProgressText.innerHTML = `Add <strong>${formatINR(diff)}</strong> more for <strong>FREE Express Delivery</strong>!`;
  }
}

function openCart() {
  DOM.cartOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  DOM.cartOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

function applyCoupon() {
  const code = DOM.couponInput.value.trim().toUpperCase();
  if (!code) return;

  if (code === "SHOP10" || code === "SAVE10") {
    state.appliedDiscountPercent = 10;
    state.activeCouponCode = code;
    DOM.couponFeedback.className = "coupon-feedback success";
    DOM.couponFeedback.textContent = "Coupon applied! You got 10% OFF.";
    updateCartUI();
  } else if (code === "SHOP20") {
    state.appliedDiscountPercent = 20;
    state.activeCouponCode = code;
    DOM.couponFeedback.className = "coupon-feedback success";
    DOM.couponFeedback.textContent = "Super deal! 20% OFF applied.";
    updateCartUI();
  } else {
    DOM.couponFeedback.className = "coupon-feedback error";
    DOM.couponFeedback.textContent = "Invalid coupon code. Try 'SHOP10'";
  }
}

/* ==========================================================================
   Wishlist Engine & Slide-Over Drawer
   ========================================================================== */
function toggleWishlist(productId) {
  const id = Number(productId);
  const product = state.products.find(p => p.id === id);
  if (!product) return;

  if (state.wishlist.has(id)) {
    state.wishlist.delete(id);
    showToast(`Removed "${product.name}" from wishlist`);
  } else {
    state.wishlist.add(id);
    showToast(`Saved "${product.name}" to wishlist ❤️`);
  }

  DOM.wishlistBadge.textContent = state.wishlist.size;
  renderProducts();
  renderWishlistUI();
}

function openWishlist() {
  renderWishlistUI();
  DOM.wishlistOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeWishlist() {
  DOM.wishlistOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

function renderWishlistUI() {
  DOM.wishlistBadge.textContent = state.wishlist.size;
  DOM.wishlistHeaderCount.textContent = `(${state.wishlist.size} ${state.wishlist.size === 1 ? "item" : "items"})`;

  if (state.wishlist.size === 0) {
    DOM.wishlistItemsList.innerHTML = `
      <div class="cart-empty-message">
        <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" style="width: 52px; height: 52px; margin: 0 auto 12px;">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <p>Your wishlist is currently empty.</p>
        <button class="primary-btn" id="wishlistShopNowBtn">Browse Collection</button>
      </div>
    `;
    const btn = document.getElementById("wishlistShopNowBtn");
    if (btn) {
      btn.addEventListener("click", () => {
        closeWishlist();
        switchView("shop");
      });
    }
  } else {
    const wishItems = state.products.filter(p => state.wishlist.has(p.id));
    DOM.wishlistItemsList.innerHTML = wishItems.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <h4 class="cart-item-name">${item.name}</h4>
          <span class="cart-item-price">${formatINR(item.price)}</span>
          <div class="cart-item-controls" style="margin-top: 8px;">
            <button class="primary-btn" data-wishlist-to-cart="${item.id}" style="padding: 5px 12px; font-size: 12px;">
              Move to Cart
            </button>
            <button class="remove-item-btn" data-wishlist-remove="${item.id}">
              Remove
            </button>
          </div>
        </div>
      </div>
    `).join("");
  }
}

/* ==========================================================================
   Quick Search Modal (Triggered by 🔍 Search Icon)
   ========================================================================== */
function openSearchModal() {
  DOM.searchModal.style.display = "flex";
  document.body.style.overflow = "hidden";
  DOM.modalSearchInput.value = "";
  DOM.modalClearSearchBtn.style.display = "none";
  renderSearchModalResults("");
  setTimeout(() => DOM.modalSearchInput.focus(), 50);
}

function closeSearchModal() {
  DOM.searchModal.style.display = "none";
  document.body.style.overflow = "";
}

function renderSearchModalResults(query) {
  const q = query.trim().toLowerCase();
  if (!q) {
    // Show top 4 popular items as quick recommendations
    const recommendations = state.products.slice(0, 4);
    DOM.searchLiveResults.innerHTML = `
      <div style="font-size: 12px; font-weight: 700; color: #94a3b8; margin-bottom: 8px; text-transform: uppercase;">
        Recommended Products
      </div>
      ${recommendations.map(p => `
        <div class="search-result-item" data-search-select-id="${p.id}">
          <img src="${p.image}" alt="${p.name}" class="search-item-thumb">
          <div class="search-item-info">
            <h5 class="search-item-title">${p.name}</h5>
            <span class="search-item-meta">${p.category} • ${p.brand}</span>
          </div>
          <span class="search-item-price">${formatINR(p.price)}</span>
        </div>
      `).join("")}
    `;
    return;
  }

  const matches = state.products.filter(p => 
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q)
  );

  if (matches.length === 0) {
    DOM.searchLiveResults.innerHTML = `
      <div style="text-align: center; padding: 24px; color: #64748b; font-size: 14px;">
        No products found matching "<strong>${query}</strong>". Try searching for "Headphones", "iPhone", or "Sneakers".
      </div>
    `;
    return;
  }

  DOM.searchLiveResults.innerHTML = `
    <div style="font-size: 12px; font-weight: 700; color: #94a3b8; margin-bottom: 8px; text-transform: uppercase;">
      Found ${matches.length} matching products
    </div>
    ${matches.slice(0, 6).map(p => `
      <div class="search-result-item" data-search-select-id="${p.id}">
        <img src="${p.image}" alt="${p.name}" class="search-item-thumb">
        <div class="search-item-info">
          <h5 class="search-item-title">${p.name}</h5>
          <span class="search-item-meta">${p.category} • ${p.brand}</span>
        </div>
        <span class="search-item-price">${formatINR(p.price)}</span>
      </div>
    `).join("")}
  `;
}

/* ==========================================================================
   User Authentication & Profile (Triggered by 👤 Login / Register)
   ========================================================================== */
function openAuthModal() {
  DOM.authModal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeAuthModal() {
  DOM.authModal.style.display = "none";
  document.body.style.overflow = "";
}

function updateUserAuthUI() {
  if (state.currentUser) {
    DOM.userBtnText.textContent = state.currentUser.name;
    const initial = state.currentUser.name.charAt(0).toUpperCase();
    const avatar = document.getElementById("userDropdownAvatar");
    if (avatar) avatar.textContent = initial;
    const nameEl = document.getElementById("userDropdownName");
    if (nameEl) nameEl.textContent = state.currentUser.name;
    const emailEl = document.getElementById("userDropdownEmail");
    if (emailEl) emailEl.textContent = state.currentUser.email;
  } else {
    DOM.userBtnText.textContent = "Login / Register";
    DOM.userDropdownMenu.style.display = "none";
  }
}

function loginUser(name, email) {
  state.currentUser = { name, email };
  updateUserAuthUI();
  closeAuthModal();
  showToast(`Welcome back, ${name}! 🎉`);
}

function logoutUser() {
  state.currentUser = null;
  updateUserAuthUI();
  showToast("You have been signed out.");
}

/* ==========================================================================
   Quick View Modal
   ========================================================================== */
function openQuickView(productId) {
  const product = state.products.find(p => p.id === Number(productId));
  if (!product) return;

  const isWishlisted = state.wishlist.has(product.id);

  DOM.quickViewBody.innerHTML = `
    <div class="quickview-layout">
      <div class="quickview-img-box">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="quickview-info">
        <div class="stock-tag">
          <span class="stock-dot"></span>
          <span>In Stock (${product.stock} units available)</span>
        </div>
        <h2>${product.name}</h2>
        <div class="product-rating-row" style="margin-bottom: 12px;">
          <div class="stars-track">
            ${generateStarRatingHTML(product.rating)}
          </div>
          <span class="rating-score">${product.rating.toFixed(1)}</span>
          <span class="review-count">(${product.reviewsCount} customer reviews)</span>
        </div>

        <div class="product-price-row" style="margin-bottom: 16px;">
          <span class="current-price" style="font-size: 24px;">${formatINR(product.price)}</span>
          ${product.originalPrice ? `<span class="original-price" style="font-size: 16px;">${formatINR(product.originalPrice)}</span>` : ""}
          ${product.discount ? `<span class="discount-tag">${product.discount}</span>` : ""}
        </div>

        <p class="quickview-desc">${product.description}</p>

        <div style="font-size: 13px; color: #64748b; margin-bottom: 16px;">
          <p><strong>Brand:</strong> ${product.brand}</p>
          <p><strong>Category:</strong> ${product.category}</p>
          <p><strong>SKU:</strong> SE-PRD-${product.id.toString().padStart(4, "0")}</p>
        </div>

        <div class="quickview-cta-row">
          <button class="primary-btn" id="modalAddToCartBtn" style="flex: 1; height: 44px; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px;">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span>Add to Cart</span>
          </button>
          <button class="wishlist-btn ${isWishlisted ? "active" : ""}" id="modalWishlistBtn" style="width: 44px; height: 44px;" title="Wishlist">
            <svg viewBox="0 0 24 24" fill="${isWishlisted ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("modalAddToCartBtn").addEventListener("click", () => {
    addToCart(product.id);
    closeQuickView();
    openCart();
  });

  document.getElementById("modalWishlistBtn").addEventListener("click", () => {
    toggleWishlist(product.id);
    openQuickView(product.id);
  });

  DOM.quickViewModal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeQuickView() {
  DOM.quickViewModal.style.display = "none";
  document.body.style.overflow = "";
}

/* ==========================================================================
   Checkout Simulation & Order History Storage
   ========================================================================== */
function executeCheckout() {
  if (state.cart.length === 0) {
    showToast("Your cart is empty. Please add products first!", "warning");
    return;
  }

  const randomOrderId = "#SE-" + Math.floor(100000 + Math.random() * 900000);
  DOM.orderIdDisplay.textContent = randomOrderId;

  const totalBill = DOM.billTotal.textContent;
  const itemsCount = state.cart.reduce((s, i) => s + i.quantity, 0);

  // Deep copy of ordered products before cart is cleared
  const orderedItems = state.cart.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    image: item.image,
    category: item.category || "General"
  }));

  const now = new Date();
  const dateFormatted = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
                        ", " + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  // Create new order record
  const newOrder = {
    id: randomOrderId,
    date: dateFormatted,
    status: "Confirmed",
    step: 2, // 1: Placed, 2: Confirmed, 3: Shipped, 4: Delivered
    items: orderedItems,
    total: totalBill,
    shipping: DOM.billShipping.textContent
  };

  // Add to beginning of orders list and persist to localStorage
  state.orders.unshift(newOrder);
  try {
    localStorage.setItem("shopease_orders", JSON.stringify(state.orders));
  } catch (err) {
    console.warn("Storage save failed", err);
  }

  // Automatically log in user as Alex Morgan if not signed in, so they see their name & orders
  if (!state.currentUser) {
    state.currentUser = { name: "Alex Morgan", email: "alex@example.com" };
    updateUserAuthUI();
  }

  DOM.orderSummaryBox.innerHTML = `
    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
      <span>Total Items:</span>
      <strong>${itemsCount}</strong>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
      <span>Amount Paid:</span>
      <strong>${totalBill}</strong>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
      <span>Payment Status:</span>
      <span style="color: #16a34a; font-weight: 600;">Verified & Paid</span>
    </div>
    <div style="display: flex; justify-content: space-between;">
      <span>Estimated Delivery:</span>
      <span>Within 2-3 Business Days</span>
    </div>
  `;

  closeCart();
  DOM.checkoutModal.style.display = "flex";
  document.body.style.overflow = "hidden";

  // Clear cart after checkout
  state.cart = [];
  updateCartUI();
  showToast(`Order ${randomOrderId} successfully placed! Saved to My Orders.`);
}

/* ==========================================================================
   My Orders Modal Management
   ========================================================================== */
function openOrdersModal() {
  renderOrdersUI();
  DOM.ordersModal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeOrdersModal() {
  DOM.ordersModal.style.display = "none";
  document.body.style.overflow = "";
}

function renderOrdersUI() {
  const count = state.orders.length;
  DOM.ordersCountBadge.textContent = `(${count} ${count === 1 ? "Order" : "Orders"})`;

  if (count === 0) {
    DOM.ordersListContainer.innerHTML = `
      <div class="orders-empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        <h3>No orders placed yet</h3>
        <p>Your purchased products and delivery tracking updates will be displayed right here.</p>
        <button class="primary-btn" id="ordersShopNowBtn">Start Shopping</button>
      </div>
    `;

    const btn = document.getElementById("ordersShopNowBtn");
    if (btn) {
      btn.addEventListener("click", () => {
        closeOrdersModal();
        switchView("shop");
      });
    }
    return;
  }

  DOM.ordersListContainer.innerHTML = state.orders.map(order => {
    const isConfirmed = order.status === "Confirmed";
    const statusClass = isConfirmed ? "status-confirmed" : "status-delivered";
    const statusText = order.status;

    return `
      <div class="order-card" data-order-card-id="${order.id}">
        <div class="order-card-header">
          <div class="order-meta-info">
            <span class="order-id-tag">${order.id}</span>
            <span class="bullet-dot">•</span>
            <span class="order-date-tag">${order.date}</span>
          </div>
          <span class="order-status-badge ${statusClass}">
            ${isConfirmed ? "● In Progress" : "✓ Delivered"} - ${statusText}
          </span>
        </div>

        <div class="order-stepper">
          <div class="step-item ${order.step >= 1 ? "active" : ""}">
            <span class="step-circle">${order.step >= 1 ? "✓" : "1"}</span>
            <span class="step-label">Placed</span>
          </div>
          <div class="step-item ${order.step >= 2 ? "active" : ""}">
            <span class="step-circle">${order.step >= 2 ? "✓" : "2"}</span>
            <span class="step-label">Confirmed</span>
          </div>
          <div class="step-item ${order.step >= 3 ? "active" : ""}">
            <span class="step-circle">${order.step >= 3 ? "✓" : "3"}</span>
            <span class="step-label">Shipped</span>
          </div>
          <div class="step-item ${order.step >= 4 ? "active" : ""}">
            <span class="step-circle">${order.step >= 4 ? "✓" : "4"}</span>
            <span class="step-label">Delivered</span>
          </div>
        </div>

        <div class="order-items-list">
          ${order.items.map(item => `
            <div class="order-item-row">
              <img src="${item.image}" alt="${item.name}" class="order-item-img">
              <div class="order-item-details">
                <h4 class="order-item-title">${item.name}</h4>
                <span class="order-item-qty">Quantity: ${item.quantity}</span>
              </div>
              <div class="order-item-price-col">
                <span class="order-item-price">${formatINR(item.price * item.quantity)}</span>
                <button class="buy-again-btn" data-buy-again-id="${item.id}">Buy Again</button>
              </div>
            </div>
          `).join("")}
        </div>

        <div class="order-card-footer">
          <div class="order-total-sum">
            Total Paid: <strong>${order.total}</strong>
          </div>
          <div class="order-actions-group">
            <button class="order-action-btn" data-track-order-id="${order.id}">
              📍 Track Shipment
            </button>
            <button class="order-action-btn" data-invoice-order-id="${order.id}">
              📄 Invoice
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}


/* ==========================================================================
   Event Listeners & Initialization
   ========================================================================== */
function initEvents() {
  // Navigation View Switching Delegation
  document.addEventListener("click", (e) => {
    const viewTrigger = e.target.closest("[data-view]");
    if (viewTrigger) {
      e.preventDefault();
      const targetView = viewTrigger.dataset.view;
      switchView(targetView);
    }
  });

  // Handle Browser Back / Forward buttons
  window.addEventListener("popstate", () => {
    const validViews = ["home", "shop", "about", "contact"];
    const hash = window.location.hash.replace("#", "").toLowerCase();
    const target = validViews.includes(hash) ? hash : "home";
    if (state.currentView !== target) {
      switchView(target, false);
    }
  });

  // Home CTA Buttons
  const homeShopNowBtn = document.getElementById("homeShopNowBtn");
  if (homeShopNowBtn) {
    homeShopNowBtn.addEventListener("click", () => switchView("shop"));
  }

  const homeHotDealsBtn = document.getElementById("homeHotDealsBtn");
  if (homeHotDealsBtn) {
    homeHotDealsBtn.addEventListener("click", () => {
      switchView("shop");
      DOM.sortSelect.value = "price-asc";
      state.sortBy = "price-asc";
      renderProducts();
    });
  }

  const homeViewAllCatsBtn = document.getElementById("homeViewAllCatsBtn");
  if (homeViewAllCatsBtn) {
    homeViewAllCatsBtn.addEventListener("click", () => switchView("shop"));
  }

  const promoShopNowBtn = document.getElementById("promoShopNowBtn");
  if (promoShopNowBtn) {
    promoShopNowBtn.addEventListener("click", () => {
      switchView("shop");
      DOM.couponInput.value = "SHOP10";
      showToast("Coupon 'SHOP10' is ready in your cart!");
    });
  }

  const aboutShopNowBtn = document.getElementById("aboutShopNowBtn");
  if (aboutShopNowBtn) {
    aboutShopNowBtn.addEventListener("click", () => switchView("shop"));
  }

  // Home Category Card Clicks -> Filter in Shop
  document.querySelectorAll(".cat-card").forEach(card => {
    card.addEventListener("click", () => {
      const cat = card.dataset.category;
      state.selectedCategories.clear();
      state.selectedCategories.add(cat);

      // Check the respective checkbox
      document.querySelectorAll('input[name="category"]').forEach(i => {
        i.checked = (i.value === cat);
      });

      switchView("shop");
      state.currentPage = 1;
      renderProducts();
      showToast(`Showing category: ${cat}`);
    });
  });

  // Quick Search Button (🔍)
  DOM.quickSearchBtn.addEventListener("click", openSearchModal);
  DOM.closeSearchModalBtn.addEventListener("click", closeSearchModal);
  DOM.searchModal.addEventListener("click", (e) => {
    if (e.target === DOM.searchModal) closeSearchModal();
  });

  DOM.modalSearchInput.addEventListener("input", (e) => {
    const val = e.target.value;
    DOM.modalClearSearchBtn.style.display = val ? "flex" : "none";
    renderSearchModalResults(val);
  });

  DOM.modalClearSearchBtn.addEventListener("click", () => {
    DOM.modalSearchInput.value = "";
    DOM.modalClearSearchBtn.style.display = "none";
    renderSearchModalResults("");
    DOM.modalSearchInput.focus();
  });

  // Trending Tag buttons in Search Modal
  document.querySelectorAll(".search-tag-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const query = btn.dataset.query;
      closeSearchModal();
      switchView("shop");
      DOM.productSearchInput.value = query;
      DOM.clearSearchBtn.style.display = "flex";
      state.searchQuery = query;
      state.currentPage = 1;
      renderProducts();
    });
  });

  // Click on search live result item
  DOM.searchLiveResults.addEventListener("click", (e) => {
    const item = e.target.closest("[data-search-select-id]");
    if (item) {
      const id = item.dataset.searchSelectId;
      closeSearchModal();
      openQuickView(id);
    }
  });

  // Wishlist Header Button (🤍)
  DOM.wishlistHeaderBtn.addEventListener("click", openWishlist);
  DOM.closeWishlistBtn.addEventListener("click", closeWishlist);
  DOM.wishlistOverlay.addEventListener("click", (e) => {
    if (e.target === DOM.wishlistOverlay) closeWishlist();
  });

  DOM.clearAllWishlistBtn.addEventListener("click", () => {
    state.wishlist.clear();
    renderWishlistUI();
    renderProducts();
    showToast("Wishlist cleared");
  });

  DOM.moveAllWishlistToCartBtn.addEventListener("click", () => {
    if (state.wishlist.size === 0) {
      showToast("Wishlist is empty!", "warning");
      return;
    }
    state.wishlist.forEach(id => {
      addToCart(id);
    });
    state.wishlist.clear();
    renderWishlistUI();
    renderProducts();
    closeWishlist();
    openCart();
    showToast("All wishlist items moved to cart!");
  });

  DOM.wishlistItemsList.addEventListener("click", (e) => {
    const moveBtn = e.target.closest("[data-wishlist-to-cart]");
    if (moveBtn) {
      const id = Number(moveBtn.dataset.wishlistToCart);
      addToCart(id);
      state.wishlist.delete(id);
      renderWishlistUI();
      renderProducts();
      return;
    }

    const removeBtn = e.target.closest("[data-wishlist-remove]");
    if (removeBtn) {
      const id = Number(removeBtn.dataset.wishlistRemove);
      state.wishlist.delete(id);
      renderWishlistUI();
      renderProducts();
      showToast("Item removed from wishlist");
      return;
    }
  });

  // User Account Button (👤 Login / Register)
  DOM.userAccountBtn.addEventListener("click", () => {
    if (state.currentUser) {
      // Toggle dropdown menu
      DOM.userDropdownMenu.style.display = DOM.userDropdownMenu.style.display === "block" ? "none" : "block";
    } else {
      openAuthModal();
    }
  });

  // Close dropdown menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#userMenuWrapper")) {
      DOM.userDropdownMenu.style.display = "none";
    }
  });

  DOM.closeAuthModalBtn.addEventListener("click", closeAuthModal);
  DOM.authModal.addEventListener("click", (e) => {
    if (e.target === DOM.authModal) closeAuthModal();
  });

  DOM.tabSignInBtn.addEventListener("click", () => {
    DOM.tabSignInBtn.classList.add("active");
    DOM.tabSignUpBtn.classList.remove("active");
    DOM.signInForm.style.display = "block";
    DOM.signUpForm.style.display = "none";
  });

  DOM.tabSignUpBtn.addEventListener("click", () => {
    DOM.tabSignUpBtn.classList.add("active");
    DOM.tabSignInBtn.classList.remove("active");
    DOM.signUpForm.style.display = "block";
    DOM.signInForm.style.display = "none";
  });

  DOM.signInForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim() || "alex@example.com";
    const name = email.split("@")[0].replace(/[._]/g, " ") || "Alex Morgan";
    const formattedName = name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    loginUser(formattedName, email);
  });

  DOM.signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("registerName").value.trim() || "Alex Morgan";
    const email = document.getElementById("registerEmail").value.trim() || "alex@example.com";
    loginUser(name, email);
  });

  document.getElementById("googleLoginBtn").addEventListener("click", () => {
    loginUser("Alex Morgan", "alex.morgan@gmail.com");
  });

  document.getElementById("appleLoginBtn").addEventListener("click", () => {
    loginUser("Alex Morgan", "alex.apple@icloud.com");
  });

  DOM.menuLogoutBtn.addEventListener("click", () => {
    logoutUser();
  });

  // Open My Orders Modal from user menu
  DOM.menuMyOrders.addEventListener("click", (e) => {
    e.preventDefault();
    DOM.userDropdownMenu.style.display = "none";
    openOrdersModal();
  });

  // Open My Orders Modal from Checkout Success screen
  if (DOM.viewMyOrdersBtn) {
    DOM.viewMyOrdersBtn.addEventListener("click", () => {
      DOM.checkoutModal.style.display = "none";
      document.body.style.overflow = "";
      openOrdersModal();
    });
  }

  // Close Orders Modal
  if (DOM.closeOrdersModalBtn) {
    DOM.closeOrdersModalBtn.addEventListener("click", closeOrdersModal);
  }
  if (DOM.ordersModal) {
    DOM.ordersModal.addEventListener("click", (e) => {
      if (e.target === DOM.ordersModal) closeOrdersModal();
    });
  }

  // Orders List Container Delegations (Buy Again, Track, Invoice)
  if (DOM.ordersListContainer) {
    DOM.ordersListContainer.addEventListener("click", (e) => {
      // Buy Again
      const buyAgainBtn = e.target.closest("[data-buy-again-id]");
      if (buyAgainBtn) {
        const prodId = buyAgainBtn.dataset.buyAgainId;
        addToCart(prodId);
        closeOrdersModal();
        openCart();
        return;
      }

      // Track Shipment
      const trackBtn = e.target.closest("[data-track-order-id]");
      if (trackBtn) {
        const orderId = trackBtn.dataset.trackOrderId;
        showToast(`🚚 ${orderId}: Package handed over to BlueDart express courier. Arriving soon!`);
        return;
      }

      // Invoice
      const invoiceBtn = e.target.closest("[data-invoice-order-id]");
      if (invoiceBtn) {
        const orderId = invoiceBtn.dataset.invoiceOrderId;
        showToast(`📄 Tax Invoice for ${orderId} downloaded successfully.`);
        return;
      }
    });
  }

  DOM.menuMyWishlist.addEventListener("click", (e) => {
    e.preventDefault();
    DOM.userDropdownMenu.style.display = "none";
    openWishlist();
  });

  // Helper for safe clipboard copy
  function copyTextToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        showToast(successMsg);
      });
    } else {
      const tempInput = document.createElement("input");
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      showToast(successMsg);
    }
  }

  // Contact Method 1: Phone Support Actions
  if (DOM.copyPhoneBtn) {
    DOM.copyPhoneBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const phone = DOM.copyPhoneBtn.dataset.copy || "+91 (800) 123-4567";
      copyTextToClipboard(phone, `📞 Phone number copied: ${phone}`);
    });
  }

  if (DOM.callNowBtn) {
    DOM.callNowBtn.addEventListener("click", () => {
      showToast("📞 Dialing ShopEase Support helpline (+91 800 123-4567)...");
    });
  }

  // Contact Method 2: Email Assistance Actions
  if (DOM.copyEmailBtn) {
    DOM.copyEmailBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const email = DOM.copyEmailBtn.dataset.copy || "support@shopease.com";
      copyTextToClipboard(email, `✉️ Support email copied: ${email}`);
    });
  }

  if (DOM.sendEmailBtn) {
    DOM.sendEmailBtn.addEventListener("click", () => {
      showToast("✉️ Opening your email client for support@shopease.com...");
    });
  }

  // Contact Method 3: Headquarters Location Actions
  if (DOM.copyAddressBtn) {
    DOM.copyAddressBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const addr = DOM.copyAddressBtn.dataset.copy || "Tech Park Phase 2, Indiranagar, Bengaluru, KA 560038";
      copyTextToClipboard(addr, "📍 Headquarters address copied to clipboard!");
    });
  }

  if (DOM.openMapsBtn) {
    DOM.openMapsBtn.addEventListener("click", () => {
      showToast("📍 Opening Bengaluru Headquarters on Google Maps...");
    });
  }

  // Contact Method 4: 24/7 Live Chat Assistant Engine
  function openLiveChat() {
    if (DOM.liveChatBox) {
      DOM.liveChatBox.style.display = "flex";
      if (DOM.chatInputField) {
        setTimeout(() => DOM.chatInputField.focus(), 120);
      }
      if (DOM.chatMessages) {
        DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
      }
    }
  }

  function closeLiveChat() {
    if (DOM.liveChatBox) {
      DOM.liveChatBox.style.display = "none";
    }
  }

  function toggleLiveChat() {
    if (DOM.liveChatBox) {
      if (DOM.liveChatBox.style.display === "none" || !DOM.liveChatBox.style.display) {
        openLiveChat();
      } else {
        closeLiveChat();
      }
    }
  }

  if (DOM.liveChatToggleBtn) {
    DOM.liveChatToggleBtn.addEventListener("click", toggleLiveChat);
  }

  if (DOM.closeLiveChatBtn) {
    DOM.closeLiveChatBtn.addEventListener("click", closeLiveChat);
  }

  if (DOM.contactStartChatBtn) {
    DOM.contactStartChatBtn.addEventListener("click", () => {
      openLiveChat();
      showToast("💬 Live Chat opened! Virtual assistant online.");
    });
  }

  const liveChatSupportCard = document.getElementById("liveChatSupportCard");
  if (liveChatSupportCard) {
    liveChatSupportCard.style.cursor = "pointer";
    liveChatSupportCard.addEventListener("click", (e) => {
      if (!e.target.closest("button")) {
        openLiveChat();
      }
    });
  }

  function getBotResponse(userQuery) {
    const q = userQuery.toLowerCase().trim();

    if (q.includes("order") || q.includes("track") || q.includes("status")) {
      const firstOrder = (state.orders && state.orders.length > 0) ? state.orders[0] : null;
      if (firstOrder) {
        const itemNames = firstOrder.items.map(i => i.name).join(", ");
        return `📦 Your order <strong>${firstOrder.id}</strong> (${itemNames}) is currently <strong>${firstOrder.status}</strong>! Total: <strong>${firstOrder.total}</strong>. Estimated arrival in 2 days.`;
      }
      return "📦 You have no active orders placed yet. Once you place an order, live tracking will update right here in real time!";
    }

    if (q.includes("delivery") || q.includes("shipping") || q.includes("fast") || q.includes("time") || q.includes("courier")) {
      return "🚚 Standard delivery takes <strong>2-4 business days</strong>. Metro cities qualify for <strong>Same-Day or Next-Day Express Delivery</strong>. Orders over ₹2,000 get <strong>FREE Express Shipping</strong>!";
    }

    if (q.includes("return") || q.includes("refund") || q.includes("replace") || q.includes("exchange")) {
      return "🔄 We offer a <strong>7-Day Hassle-Free Return Policy</strong>! If you're not satisfied, request a return anytime from your dashboard and our courier will collect it from your doorstep at zero fee.";
    }

    if (q.includes("coupon") || q.includes("discount") || q.includes("offer") || q.includes("promo") || q.includes("deal") || q.includes("code")) {
      return "🎟️ Use promo code <strong>SHOP10</strong> in your cart drawer to get an instant <strong>10% DISCOUNT</strong> on your entire purchase!";
    }

    if (q.includes("human") || q.includes("agent") || q.includes("representative") || q.includes("person") || q.includes("talk") || q.includes("call")) {
      return "👤 A support specialist is available to speak with you! Call our helpline at <strong>+91 (800) 123-4567</strong> (Mon-Sat, 9AM-8PM IST) or write to <strong>support@shopease.com</strong>.";
    }

    if (q.includes("phone") || q.includes("number") || q.includes("contact")) {
      return "📞 Our phone support is <strong>+91 (800) 123-4567</strong>. Operational Mon-Sat from 9:00 AM to 8:00 PM IST.";
    }

    if (q.includes("email") || q.includes("mail")) {
      return "✉️ You can email us anytime at <strong>support@shopease.com</strong> or <strong>care@shopease.com</strong>. We reply within 15 minutes during business hours.";
    }

    if (q.includes("location") || q.includes("office") || q.includes("address") || q.includes("headquarter") || q.includes("bengaluru")) {
      return "📍 Our headquarters is located at <strong>Tech Park Phase 2, Indiranagar, Bengaluru, KA 560038</strong>.";
    }

    if (q.includes("hi") || q.includes("hello") || q.includes("hey")) {
      return "Hello! 😊 Welcome to ShopEase Support. How can I help you today? You can ask about order status, delivery times, return policies, or discount coupons.";
    }

    return "Thank you for reaching out! ShopEase support is on standby to help with orders, deliveries, returns, and products. Would you like to track an order or check active discounts?";
  }

  function handleSendChatMessage(text) {
    if (!text || !text.trim() || !DOM.chatMessages) return;

    const userText = text.trim();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append User Message
    const userMsgEl = document.createElement("div");
    userMsgEl.className = "chat-msg user-msg";
    userMsgEl.innerHTML = `
      <div class="msg-bubble">
        <p>${userText}</p>
      </div>
      <span class="chat-msg-time">${now}</span>
    `;
    DOM.chatMessages.appendChild(userMsgEl);
    DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;

    // Show Typing Indicator
    const typingEl = document.createElement("div");
    typingEl.className = "chat-msg bot-msg";
    typingEl.id = "chatTypingIndicator";
    typingEl.innerHTML = `
      <div class="chat-typing-indicator">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;
    DOM.chatMessages.appendChild(typingEl);
    DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;

    // Simulate Bot Response delay
    setTimeout(() => {
      const currentTyping = document.getElementById("chatTypingIndicator");
      if (currentTyping) currentTyping.remove();

      const botReply = getBotResponse(userText);
      const botMsgEl = document.createElement("div");
      botMsgEl.className = "chat-msg bot-msg";
      botMsgEl.innerHTML = `
        <div class="msg-bubble">
          <p>${botReply}</p>
        </div>
        <span class="chat-msg-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      `;
      DOM.chatMessages.appendChild(botMsgEl);
      DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
    }, 550);
  }

  if (DOM.chatInputForm) {
    DOM.chatInputForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (DOM.chatInputField) {
        const text = DOM.chatInputField.value;
        DOM.chatInputField.value = "";
        handleSendChatMessage(text);
      }
    });
  }

  // Handle Quick Chat Chips
  if (DOM.chatMessages) {
    DOM.chatMessages.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-chat-ask]");
      if (chip) {
        handleSendChatMessage(chip.dataset.chatAsk);
      }
    });
  }

  // Contact Form Submission
  if (DOM.contactForm) {
    DOM.contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const ticketId = "#TKT-" + Math.floor(10000 + Math.random() * 90000);
      showToast(`Thank you! Your inquiry ${ticketId} has been received. Our team will contact you shortly.`);
      DOM.contactForm.reset();
    });
  }

  // FAQ Accordion
  document.querySelectorAll(".faq-header").forEach(header => {
    header.addEventListener("click", () => {
      const item = header.closest(".faq-item");
      item.classList.toggle("active");
    });
  });

  // ==========================================================================
  // Filter Panel Drawer & Engine
  // ==========================================================================
  const categoryInputs = document.querySelectorAll('input[name="category"]');
  const priceInputs = document.querySelectorAll('input[name="priceRange"]');
  const brandInputs = document.querySelectorAll('input[name="brand"]');
  const ratingInputs = document.querySelectorAll('input[name="minRating"]');

  function openFilterPanel() {
    // If not currently on shop view, switch to shop so products catalog is visible
    if (state.currentView !== "shop") {
      switchView("shop");
    }
    DOM.filterPanelOverlay.classList.add("open");
    if (DOM.navFilterProductsBtn) {
      DOM.navFilterProductsBtn.setAttribute("aria-expanded", "true");
    }
    document.body.style.overflow = "hidden";
    updateFilterPanelCounts();
  }

  function closeFilterPanel() {
    DOM.filterPanelOverlay.classList.remove("open");
    if (DOM.navFilterProductsBtn) {
      DOM.navFilterProductsBtn.setAttribute("aria-expanded", "false");
    }
    document.body.style.overflow = "";
  }

  function updateFilterPanelCounts() {
    const activeCount = state.selectedCategories.size + 
      (state.selectedPriceRange !== "all" ? 1 : 0) + 
      state.selectedBrands.size + 
      (state.minRating !== null ? 1 : 0);

    // Update Nav Badge
    if (DOM.navFilterBadge) {
      if (activeCount > 0) {
        DOM.navFilterBadge.textContent = activeCount;
        DOM.navFilterBadge.style.display = "inline-flex";
      } else {
        DOM.navFilterBadge.style.display = "none";
      }
    }

    // Update Toolbar Badge
    if (DOM.toolbarFilterBadge) {
      if (activeCount > 0) {
        DOM.toolbarFilterBadge.textContent = activeCount;
        DOM.toolbarFilterBadge.style.display = "inline-flex";
      } else {
        DOM.toolbarFilterBadge.style.display = "none";
      }
    }

    // Update Mobile Badge
    if (DOM.mobileFilterBadge) {
      if (activeCount > 0) {
        DOM.mobileFilterBadge.textContent = activeCount;
        DOM.mobileFilterBadge.style.display = "inline-flex";
      } else {
        DOM.mobileFilterBadge.style.display = "none";
      }
    }

    // Category badge
    if (DOM.catSelectedBadge) {
      if (state.selectedCategories.size > 0) {
        DOM.catSelectedBadge.textContent = state.selectedCategories.size;
        DOM.catSelectedBadge.style.display = "inline-flex";
      } else {
        DOM.catSelectedBadge.style.display = "none";
      }
    }

    // Brand badge
    if (DOM.brandSelectedBadge) {
      if (state.selectedBrands.size > 0) {
        DOM.brandSelectedBadge.textContent = state.selectedBrands.size;
        DOM.brandSelectedBadge.style.display = "inline-flex";
      } else {
        DOM.brandSelectedBadge.style.display = "none";
      }
    }

    // Active summary in panel
    if (DOM.panelActiveSummary) {
      if (activeCount > 0) {
        DOM.panelActiveSummary.style.display = "flex";
        DOM.panelActiveCountText.textContent = `${activeCount} filter${activeCount > 1 ? "s" : ""} selected`;
      } else {
        DOM.panelActiveSummary.style.display = "none";
      }
    }

    // Apply Button Matching Count Preview
    if (DOM.panelApplyBadge) {
      const matchCount = getFilteredAndSortedProducts().length;
      DOM.panelApplyBadge.textContent = `(${matchCount})`;
    }
  }

  function updateFilterOptionCounts() {
    const all = state.products;
    const cats = ["Electronics", "Fashion", "Home & Living", "Beauty & Personal Care", "Sports & Outdoors", "Books", "Toys & Games"];
    cats.forEach(c => {
      const el = document.getElementById("countCat" + c.replace(/[^a-zA-Z]/g, ""));
      if (el) {
        const cnt = all.filter(p => p.category === c).length;
        el.textContent = `(${cnt})`;
      }
    });

    const brands = ["Samsung", "Apple", "Sony", "Dell", "HP"];
    brands.forEach(b => {
      const el = document.getElementById("countBrand" + b);
      if (el) {
        const cnt = all.filter(p => p.brand === b).length;
        el.textContent = `(${cnt})`;
      }
    });
  }

  // Clear All Filters
  function resetAllFilters() {
    state.selectedCategories.clear();
    state.selectedPriceRange = "all";
    state.selectedBrands.clear();
    state.minRating = null;
    state.searchQuery = "";
    DOM.productSearchInput.value = "";
    DOM.clearSearchBtn.style.display = "none";

    categoryInputs.forEach(i => i.checked = false);
    priceInputs.forEach(i => i.checked = (i.value === "all"));
    brandInputs.forEach(i => i.checked = false);
    ratingInputs.forEach(i => i.checked = false);

    state.currentPage = 1;
    renderProducts();
    updateFilterPanelCounts();
    showToast("All filters have been reset.");
  }

  // Apply Filters and close drawer
  function applyFiltersAndClose() {
    state.currentPage = 1;
    renderProducts();
    updateFilterPanelCounts();
    closeFilterPanel();
    const matchCount = getFilteredAndSortedProducts().length;
    showToast(`Filters applied (${matchCount} product${matchCount === 1 ? "" : "s"} found).`);
  }

  // Filter input listeners
  categoryInputs.forEach(input => {
    input.addEventListener("change", (e) => {
      if (e.target.checked) {
        state.selectedCategories.add(e.target.value);
      } else {
        state.selectedCategories.delete(e.target.value);
      }
      state.currentPage = 1;
      renderProducts();
      updateFilterPanelCounts();
    });
  });

  priceInputs.forEach(input => {
    input.addEventListener("change", (e) => {
      state.selectedPriceRange = e.target.value;
      state.currentPage = 1;
      renderProducts();
      updateFilterPanelCounts();
    });
  });

  brandInputs.forEach(input => {
    input.addEventListener("change", (e) => {
      if (e.target.checked) {
        state.selectedBrands.add(e.target.value);
      } else {
        state.selectedBrands.delete(e.target.value);
      }
      state.currentPage = 1;
      renderProducts();
      updateFilterPanelCounts();
    });
  });

  ratingInputs.forEach(input => {
    input.addEventListener("change", (e) => {
      state.minRating = Number(e.target.value);
      state.currentPage = 1;
      renderProducts();
      updateFilterPanelCounts();
    });
  });

  // Open & Close Filter Panel Triggers
  if (DOM.navFilterProductsBtn) {
    DOM.navFilterProductsBtn.addEventListener("click", openFilterPanel);
  }

  if (DOM.toolbarFilterBtn) {
    DOM.toolbarFilterBtn.addEventListener("click", openFilterPanel);
  }

  if (DOM.mobileFilterOpenBtn) {
    DOM.mobileFilterOpenBtn.addEventListener("click", openFilterPanel);
  }

  if (DOM.closeFilterPanelBtn) {
    DOM.closeFilterPanelBtn.addEventListener("click", closeFilterPanel);
  }

  if (DOM.filterPanelOverlay) {
    DOM.filterPanelOverlay.addEventListener("click", (e) => {
      if (e.target === DOM.filterPanelOverlay) {
        closeFilterPanel();
      }
    });
  }

  if (DOM.panelClearAllBtn) {
    DOM.panelClearAllBtn.addEventListener("click", resetAllFilters);
  }

  if (DOM.panelInlineResetBtn) {
    DOM.panelInlineResetBtn.addEventListener("click", resetAllFilters);
  }

  if (DOM.panelApplyFiltersBtn) {
    DOM.panelApplyFiltersBtn.addEventListener("click", applyFiltersAndClose);
  }

  DOM.emptyResetBtn.addEventListener("click", resetAllFilters);

  // Initialize filter option catalog counts and badge state
  updateFilterOptionCounts();
  updateFilterPanelCounts();

  // Shop Live Search Input
  DOM.productSearchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    DOM.clearSearchBtn.style.display = state.searchQuery ? "flex" : "none";
    state.currentPage = 1;
    renderProducts();
    updateFilterPanelCounts();
  });

  DOM.clearSearchBtn.addEventListener("click", () => {
    state.searchQuery = "";
    DOM.productSearchInput.value = "";
    DOM.clearSearchBtn.style.display = "none";
    state.currentPage = 1;
    renderProducts();
    updateFilterPanelCounts();
  });

  // Sort Dropdown
  DOM.sortSelect.addEventListener("change", (e) => {
    state.sortBy = e.target.value;
    state.currentPage = 1;
    renderProducts();
  });

  // View Mode Toggles
  DOM.gridViewBtn.addEventListener("click", () => {
    state.viewMode = "grid";
    DOM.gridViewBtn.classList.add("active");
    DOM.listViewBtn.classList.remove("active");
    renderProducts();
  });

  DOM.listViewBtn.addEventListener("click", () => {
    state.viewMode = "list";
    DOM.listViewBtn.classList.add("active");
    DOM.gridViewBtn.classList.remove("active");
    renderProducts();
  });

  // Active Filter Pills Delegation
  DOM.activeFilterTags.addEventListener("click", (e) => {
    const removeCat = e.target.dataset.removeCat;
    if (removeCat) {
      state.selectedCategories.delete(removeCat);
      const input = document.querySelector(`input[name="category"][value="${removeCat}"]`);
      if (input) input.checked = false;
      renderProducts();
      updateFilterPanelCounts();
      return;
    }

    if (e.target.dataset.removePrice) {
      state.selectedPriceRange = "all";
      const input = document.querySelector('input[name="priceRange"][value="all"]');
      if (input) input.checked = true;
      renderProducts();
      updateFilterPanelCounts();
      return;
    }

    const removeBrand = e.target.dataset.removeBrand;
    if (removeBrand) {
      state.selectedBrands.delete(removeBrand);
      const input = document.querySelector(`input[name="brand"][value="${removeBrand}"]`);
      if (input) input.checked = false;
      renderProducts();
      updateFilterPanelCounts();
      return;
    }

    if (e.target.dataset.removeRating) {
      state.minRating = null;
      ratingInputs.forEach(i => i.checked = false);
      renderProducts();
      updateFilterPanelCounts();
      return;
    }

    if (e.target.dataset.removeSearch) {
      state.searchQuery = "";
      DOM.productSearchInput.value = "";
      DOM.clearSearchBtn.style.display = "none";
      renderProducts();
      updateFilterPanelCounts();
      return;
    }
  });

  // Pagination Delegation
  DOM.paginationContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".page-btn");
    if (!btn || btn.classList.contains("disabled") || btn.classList.contains("active")) return;
    const page = Number(btn.dataset.page);
    if (!isNaN(page)) {
      state.currentPage = page;
      renderProducts();
      window.scrollTo({ top: 380, behavior: "smooth" });
    }
  });

  // Product Grid Action Delegations
  DOM.productsGrid.addEventListener("click", (e) => {
    const cartBtn = e.target.closest("[data-cart-id]");
    if (cartBtn) {
      e.stopPropagation();
      addToCart(cartBtn.dataset.cartId);
      return;
    }

    const wishBtn = e.target.closest("[data-wishlist-id]");
    if (wishBtn) {
      e.stopPropagation();
      toggleWishlist(wishBtn.dataset.wishlistId);
      return;
    }

    const qvTrigger = e.target.closest("[data-quickview-id]");
    if (qvTrigger) {
      openQuickView(qvTrigger.dataset.quickviewId);
      return;
    }
  });

  // Cart Drawer Events
  DOM.openCartBtn.addEventListener("click", openCart);
  DOM.closeCartBtn.addEventListener("click", closeCart);
  DOM.cartOverlay.addEventListener("click", (e) => {
    if (e.target === DOM.cartOverlay) closeCart();
  });

  DOM.cartItemsList.addEventListener("click", (e) => {
    const qtyBtn = e.target.closest("[data-qty-id]");
    if (qtyBtn) {
      const id = qtyBtn.dataset.qtyId;
      const delta = Number(qtyBtn.dataset.delta);
      updateCartQuantity(id, delta);
      return;
    }

    const removeBtn = e.target.closest("[data-remove-cart]");
    if (removeBtn) {
      removeFromCart(removeBtn.dataset.removeCart);
      return;
    }
  });

  DOM.applyCouponBtn.addEventListener("click", applyCoupon);
  DOM.couponInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") applyCoupon();
  });

  DOM.checkoutBtn.addEventListener("click", executeCheckout);

  // Quick View Modal Close
  DOM.quickViewCloseBtn.addEventListener("click", closeQuickView);
  DOM.quickViewModal.addEventListener("click", (e) => {
    if (e.target === DOM.quickViewModal) closeQuickView();
  });

  // Checkout Success Done
  DOM.orderSuccessDoneBtn.addEventListener("click", () => {
    DOM.checkoutModal.style.display = "none";
    document.body.style.overflow = "";
    switchView("shop");
  });

  // Filter Accordions
  const filterHeaders = document.querySelectorAll(".filter-header");
  filterHeaders.forEach(header => {
    header.addEventListener("click", () => {
      const group = header.closest(".filter-group");
      group.classList.toggle("collapsed");
    });
  });

  // Mobile Menu Drawer Toggle
  if (DOM.mobileMenuBtn && DOM.navMenu) {
    DOM.mobileMenuBtn.addEventListener("click", () => {
      DOM.navMenu.classList.toggle("mobile-open");
    });

    // Close mobile nav when clicking any nav link
    DOM.navMenu.addEventListener("click", (e) => {
      if (e.target.closest(".nav-link") && !e.target.closest(".nav-filter-btn")) {
        DOM.navMenu.classList.remove("mobile-open");
      }
    });
  }

  // Customer Service Policies Modal Events
  document.querySelectorAll(".policy-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      renderPolicyContent(btn.dataset.policyTab);
    });
  });

  if (DOM.closePolicyModalBtn) DOM.closePolicyModalBtn.addEventListener("click", closePolicyModal);
  if (DOM.policyCloseOkBtn) DOM.policyCloseOkBtn.addEventListener("click", closePolicyModal);

  if (DOM.policyContactUsBtn) {
    DOM.policyContactUsBtn.addEventListener("click", () => {
      closePolicyModal();
      switchView("contact");
    });
  }

  if (DOM.policyModal) {
    DOM.policyModal.addEventListener("click", (e) => {
      if (e.target === DOM.policyModal) closePolicyModal();
    });
  }

  // Footer Customer Service Option 1: Help & FAQs
  if (DOM.footerHelpFaqLink) {
    DOM.footerHelpFaqLink.addEventListener("click", (e) => {
      e.preventDefault();
      switchView("contact");
      setTimeout(() => {
        const faqContainer = document.querySelector(".faq-container");
        if (faqContainer) {
          faqContainer.scrollIntoView({ behavior: "smooth", block: "start" });
          faqContainer.classList.add("faq-highlight");
          setTimeout(() => faqContainer.classList.remove("faq-highlight"), 2000);
          const firstFaq = faqContainer.querySelector(".faq-item");
          if (firstFaq && !firstFaq.classList.contains("active")) {
            firstFaq.classList.add("active");
          }
        }
      }, 150);
      showToast("📍 Navigated to Help & Frequently Asked Questions");
    });
  }

  // Footer Customer Service Option 2: Shipping Policy
  if (DOM.footerShippingLink) {
    DOM.footerShippingLink.addEventListener("click", (e) => {
      e.preventDefault();
      openPolicyModal("shipping");
    });
  }

  // Footer Customer Service Option 3: Return Policy
  if (DOM.footerReturnLink) {
    DOM.footerReturnLink.addEventListener("click", (e) => {
      e.preventDefault();
      openPolicyModal("return");
    });
  }

  // Footer Customer Service Option 4: Terms & Conditions
  if (DOM.footerTermsLink) {
    DOM.footerTermsLink.addEventListener("click", (e) => {
      e.preventDefault();
      openPolicyModal("terms");
    });
  }

  // General delegation for any data-footer-policy links across document
  document.querySelectorAll("[data-footer-policy]").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openPolicyModal(link.dataset.footerPolicy);
    });
  });

  // ESC key closes modals & drawers
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeFilterPanel();
      closeCart();
      closeWishlist();
      closeSearchModal();
      closeAuthModal();
      closeQuickView();
      closeOrdersModal();
      closePolicyModal();
      closeLiveChat();
      if (DOM.navMenu) DOM.navMenu.classList.remove("mobile-open");
      DOM.checkoutModal.style.display = "none";
      DOM.userDropdownMenu.style.display = "none";
      document.body.style.overflow = "";
    }
  });
}

// ==========================================================================
// Customer Service Policy Engine
// ==========================================================================
const POLICIES_DATA = {
  shipping: {
    icon: "🚚",
    title: "Shipping & Delivery Policy",
    subtitle: "Fast, transparent, and insured shipping across India",
    content: `
      <div class="policy-section-block">
        <h4>🚀 Free Express Delivery on Orders > ₹2,000</h4>
        <p>ShopEase offers completely free express shipping on all orders valued at ₹2,000 and above across 19,000+ pin codes in India. A standard flat delivery fee of ₹79 is applied to orders below ₹2,000.</p>
      </div>

      <div class="policy-section-block">
        <h4>⏱️ Estimated Delivery Timelines</h4>
        <div class="policy-feature-grid">
          <div class="policy-feature-item">
            <strong>Metro Cities (1 - 2 Days)</strong>
            <span>Bengaluru, Mumbai, Delhi-NCR, Chennai, Hyderabad, Kolkata</span>
          </div>
          <div class="policy-feature-item">
            <strong>Tier 2 & 3 Cities (2 - 4 Days)</strong>
            <span>Pune, Ahmedabad, Jaipur, Chandigarh, Kochi, Lucknow, etc.</span>
          </div>
          <div class="policy-feature-item">
            <strong>Rest of India (3 - 5 Days)</strong>
            <span>Regional district hubs & outstation destinations</span>
          </div>
          <div class="policy-feature-item">
            <strong>Same-Day Dispatch Guarantee</strong>
            <span>Orders placed before 2:00 PM IST dispatch the very same day</span>
          </div>
        </div>
      </div>

      <div class="policy-section-block">
        <h4>📦 Real-Time Order Tracking & Live Updates</h4>
        <p>Once your order is packed and dispatched from our fulfillment center, you will receive an automated SMS, email, and WhatsApp message with your unique AWB tracking number and direct live tracking link.</p>
      </div>

      <div class="policy-section-block">
        <h4>🛡️ Tamper-Proof Packaging & 100% Transit Insurance</h4>
        <p>All valuable electronics and sensitive items are sealed in tamper-evident protective bubble packaging with serial number barcoding. In the rare event of transit damage or courier delay, we guarantee an immediate replacement or full refund.</p>
      </div>

      <div class="policy-section-block">
        <h4>🚚 Logistics Partners</h4>
        <p>We work exclusively with India's premier logistics providers: <strong>Blue Dart, Delhivery, Xpressbees, Shadowfax</strong>, and <strong>India Post Speed Post</strong>.</p>
      </div>
    `
  },
  return: {
    icon: "🔄",
    title: "7-Day Return & Refund Policy",
    subtitle: "Hassle-free doorstep pickup with instant refunds",
    content: `
      <div class="policy-section-block">
        <h4>🔄 7-Day Easy Return Guarantee</h4>
        <p>We want you to love everything you buy from ShopEase. If you are not 100% satisfied with your purchase, you can initiate a return or replacement request within <strong>7 calendar days</strong> from the delivery date.</p>
      </div>

      <div class="policy-section-block">
        <h4>🚪 Zero-Fee Doorstep Pickup</h4>
        <p>No need to print return labels or visit courier branches! Our logistics agent will collect the return package directly from your delivery address free of charge.</p>
      </div>

      <div class="policy-section-block">
        <h4>⚡ Instant Refund Timelines</h4>
        <div class="policy-feature-grid">
          <div class="policy-feature-item">
            <strong>UPI & Digital Wallets (2 - 4 Hours)</strong>
            <span>Credited directly to Google Pay, PhonePe, Paytm, or BHIM</span>
          </div>
          <div class="policy-feature-item">
            <strong>Credit & Debit Cards (2 - 3 Days)</strong>
            <span>Refunded to original Visa, MasterCard, RuPay card</span>
          </div>
          <div class="policy-feature-item">
            <strong>Net Banking (2 - 3 Banking Days)</strong>
            <span>Direct NEFT/IMPS settlement to your bank account</span>
          </div>
          <div class="policy-feature-item">
            <strong>Cash on Delivery (Instant Transfer)</strong>
            <span>Immediate payout via verified UPI ID or bank transfer</span>
          </div>
        </div>
      </div>

      <div class="policy-section-block">
        <h4>🏷️ Return Eligibility Checklist</h4>
        <p>To ensure a seamless return process, please ensure that:</p>
        <ul style="padding-left: 20px; font-size: 13.5px; color: #475569; display: flex; flex-direction: column; gap: 4px;">
          <li>Item is unused, undamaged, and in resalable condition</li>
          <li>Original brand tags, barcode stickers, user manual, and accessories are intact</li>
          <li>Original brand box or packaging is provided at pickup</li>
        </ul>
      </div>

      <div class="policy-section-block">
        <h4>🔁 1-Click Replacement Option</h4>
        <p>Received a damaged item or incorrect apparel size? Choose <strong>"Instant Replacement"</strong> in your My Orders dashboard to receive a brand-new unit delivered in express priority.</p>
      </div>
    `
  },
  terms: {
    icon: "📜",
    title: "Terms & Conditions",
    subtitle: "Clear, transparent, and fair policies for all shoppers",
    content: `
      <div class="policy-section-block">
        <h4>🤝 User Agreement & Acceptance</h4>
        <p>By browsing, accessing, or placing orders on ShopEase, you agree to be bound by these Terms and Conditions and our Privacy Policy. ShopEase operates under the Consumer Protection (E-Commerce) Rules of India.</p>
      </div>

      <div class="policy-section-block">
        <h4>🔒 100% Genuine & Authentic Products</h4>
        <p>We source every single product directly from certified manufacturers and brand-authorized distributors. All electronics carry valid original manufacturer warranty valid at authorized service centers across India.</p>
      </div>

      <div class="policy-section-block">
        <h4>💰 Transparent Pricing & Inclusive Taxes</h4>
        <p>All prices listed on ShopEase are inclusive of applicable Goods and Services Tax (GST). There are zero hidden convenience charges, payment processing fees, or surprise markups at checkout.</p>
      </div>

      <div class="policy-section-block">
        <h4>🛡️ Payment Security & Data Privacy</h4>
        <p>All payments are processed through PCI-DSS Level 1 certified payment gateways with 256-bit SSL encryption. We never store credit/debit card numbers or CVVs on our servers. Your personal information is strictly protected and never shared or sold to third parties.</p>
      </div>

      <div class="policy-section-block">
        <h4>⚖️ Warranty & Limitation of Liability</h4>
        <p>Warranty claims are serviced by official brand authorized service networks. ShopEase assists you with digital tax invoices and manufacturer escalation support whenever required.</p>
      </div>
    `
  }
};

function openPolicyModal(policyType = "shipping") {
  if (!DOM.policyModal) return;
  renderPolicyContent(policyType);
  DOM.policyModal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closePolicyModal() {
  if (!DOM.policyModal) return;
  DOM.policyModal.style.display = "none";
  document.body.style.overflow = "";
}

function renderPolicyContent(policyType) {
  const data = POLICIES_DATA[policyType] || POLICIES_DATA.shipping;
  if (DOM.policyHeaderIcon) DOM.policyHeaderIcon.textContent = data.icon;
  if (DOM.policyModalTitle) DOM.policyModalTitle.textContent = data.title;
  if (DOM.policyModalSubtitle) DOM.policyModalSubtitle.textContent = data.subtitle;
  if (DOM.policyModalBody) DOM.policyModalBody.innerHTML = data.content;

  // Update tabs active state
  document.querySelectorAll(".policy-tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.policyTab === policyType);
  });
}

// ==========================================================================
// Perks Horizontal Scroller Engine with Automatic Seamless Scrolling
// ==========================================================================
function initPerksScroller() {
  const container = document.getElementById("perksContainer");

  if (!container) return;

  let isInteracting = false;
  let resumeTimer = null;
  const speed = 0.8; // Gliding pixels per frame (smooth ~48px/sec)

  function pauseAutoScroll(delay = 1800) {
    isInteracting = true;
    if (resumeTimer) clearTimeout(resumeTimer);
    if (delay > 0) {
      resumeTimer = setTimeout(() => {
        isInteracting = false;
      }, delay);
    }
  }

  function resumeAutoScroll(delay = 600) {
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      isInteracting = false;
    }, delay);
  }

  // Infinite Seamless Animation Loop
  function autoScrollLoop() {
    if (!isInteracting && container.scrollWidth > container.clientWidth) {
      const loopThreshold = container.scrollWidth / 2;
      container.scrollLeft += speed;
      if (container.scrollLeft >= loopThreshold) {
        container.scrollLeft -= loopThreshold;
      }
    }
    requestAnimationFrame(autoScrollLoop);
  }

  requestAnimationFrame(autoScrollLoop);

  // Pause on hover
  container.addEventListener("mouseenter", () => pauseAutoScroll(0));
  container.addEventListener("mouseleave", () => resumeAutoScroll());

  // Pause on touch devices
  container.addEventListener("touchstart", () => pauseAutoScroll(0), { passive: true });
  container.addEventListener("touchend", () => resumeAutoScroll(1000), { passive: true });

  // Mouse wheel scroll to horizontal
  container.addEventListener("wheel", (e) => {
    if (e.deltaY !== 0 && container.scrollWidth > container.clientWidth) {
      if (!e.shiftKey) {
        e.preventDefault();
        pauseAutoScroll(1800);
        container.scrollLeft += e.deltaY * 0.9;
        const loopThreshold = container.scrollWidth / 2;
        if (container.scrollLeft >= loopThreshold) {
          container.scrollLeft -= loopThreshold;
        } else if (container.scrollLeft < 0) {
          container.scrollLeft += loopThreshold;
        }
      }
    }
  }, { passive: false });

  // Mouse drag-to-scroll
  let isDown = false;
  let startX = 0;
  let scrollStart = 0;

  container.addEventListener("mousedown", (e) => {
    isDown = true;
    pauseAutoScroll(0);
    container.classList.add("is-dragging");
    startX = e.pageX - container.offsetLeft;
    scrollStart = container.scrollLeft;
  });

  window.addEventListener("mouseup", () => {
    if (isDown) {
      isDown = false;
      container.classList.remove("is-dragging");
      resumeAutoScroll(1000);
    }
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    pauseAutoScroll(0);
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5;
    container.scrollLeft = scrollStart - walk;

    const loopThreshold = container.scrollWidth / 2;
    if (container.scrollLeft >= loopThreshold) {
      container.scrollLeft -= loopThreshold;
      scrollStart -= loopThreshold;
    } else if (container.scrollLeft < 0) {
      container.scrollLeft += loopThreshold;
      scrollStart += loopThreshold;
    }
  });
}

// Initialization on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  initEvents();
  initPerksScroller();
  updateCartUI();
  renderProducts();

  // Route to the appropriate view: default to 'home' whenever website is launched
  const validViews = ["home", "shop", "about", "contact"];
  const initialHash = window.location.hash.replace("#", "").toLowerCase();
  if (validViews.includes(initialHash)) {
    switchView(initialHash, false);
  } else {
    switchView("home", false);
  }
});

