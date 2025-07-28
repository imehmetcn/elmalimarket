// Showmar theme için gerekli global değişkenler
window.IdeaApp = {
  helpers: {
    getRouteGroup: function () { return 'default'; },
    formatMoney: function (amount) {
      if (!amount) return '0,00';
      return parseFloat(amount).toFixed(2).replace('.', ',');
    },
    checkEmail: function (email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    getFormValidateMessage: function (selector, attr) {
      var element = document.querySelector(selector);
      return element ? element.getAttribute(attr) || '' : '';
    },
    enableElement: function (element) {
      if (element && element.length) element.removeAttr('disabled');
    },
    disableElement: function (element) {
      if (element && element.length) element.attr('disabled', 'disabled');
    }
  }
};

window.IdeaCart = {
  items: [],
  itemCount: 0,
  totalPrice: 0,
  validContextList: ['showcase', 'detail', 'quick'],
  listeners: {
    prePersist: function () { },
    postPersist: function () { },
    postUpdate: function () { },
    preRemove: function () { },
    postRemove: function () { },
    postFlush: function () { }
  },
  helpers: {
    getItemTotalQuantity: function (productId) { return 0; }
  },
  deleteItem: function () { },
  updateItem: function () { },
  removeItem: function () { },
  flush: function () { }
};

window.mainCurrency = '₺';

// OpenBox global object
window.openBox = {
  reset: function () {
    var elements = document.querySelectorAll('[data-selector="openbox-close"]');
    elements.forEach(function (el) {
      if (el.click) el.click();
    });
  }
};

// IdeaTheme navigation menu mock
window.IdeaTheme = {
  navigationMenu: {
    init: function () {
      // Navigation menu initialization
      console.log('Navigation menu initialized');
    }
  },
  cart: {
    init: function () {
      // Cart initialization
      console.log('Cart initialized');
    },
    updateCartContainer: function () {
      // Update cart container
      var cartTotal = document.querySelector('[data-selector="cart-total-price"]');
      if (cartTotal) {
        cartTotal.textContent = '0,00 ₺';
      }
      var cartCount = document.querySelector('[data-selector="cart-item-count"]');
      if (cartCount) {
        cartCount.style.display = 'none';
      }
    }
  },
  login: {
    init: function () {
      // Login initialization
      console.log('Login initialized');
    }
  },
  init: function () {
    // Main theme initialization
    this.navigationMenu.init();
    this.cart.init();
    this.cart.updateCartContainer();
    this.login.init();
    console.log('IdeaTheme initialized');
  },
  eventListener: function () {
    // Event listeners
  },
  afterInit: function () {
    // After initialization
    this.cart.updateCartContainer();
  },
  initLazyLoad: function () {
    // Lazy load initialization
  },
  categorySlider: function () {
    // Category slider
  },
  initSlider: function () {
    // Slider initialization
  },
  detailSlider: function () {
    // Detail slider
  },
  bannerTitle: function () {
    // Banner title
  },
  headerFixed: function () {
    // Header fixed
  },
  scrollTop: function () {
    // Scroll to top
  },
  scrollToggle: function () {
    // Scroll toggle
  },
  footerMenu: function () {
    // Footer menu
  }
};