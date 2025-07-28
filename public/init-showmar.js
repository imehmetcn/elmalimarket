// Showmar theme için gerekli global değişkenler
window.IdeaApp = {
  helpers: {
    getRouteGroup: function() { return 'default'; },
    formatMoney: function(amount) { return parseFloat(amount).toFixed(2).replace('.', ','); },
    checkEmail: function(email) { 
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); 
    },
    getFormValidateMessage: function(selector, attr) {
      var element = document.querySelector(selector);
      return element ? element.getAttribute(attr) || '' : '';
    },
    enableElement: function(element) {
      if (element.length) element.removeAttr('disabled');
    },
    disableElement: function(element) {
      if (element.length) element.attr('disabled', 'disabled');
    }
  }
};

window.IdeaCart = {
  items: [],
  itemCount: 0,
  totalPrice: 0,
  validContextList: ['showcase', 'detail', 'quick'],
  listeners: {
    prePersist: function() {},
    postPersist: function() {},
    postUpdate: function() {},
    preRemove: function() {},
    postRemove: function() {},
    postFlush: function() {}
  },
  helpers: {
    getItemTotalQuantity: function(productId) { return 0; }
  },
  deleteItem: function() {},
  updateItem: function() {},
  removeItem: function() {},
  flush: function() {}
};

window.mainCurrency = '₺';

// OpenBox global object
window.openBox = {
  reset: function() {
    document.querySelectorAll('[data-selector="openbox-close"]').forEach(function(el) {
      el.click();
    });
  }
};