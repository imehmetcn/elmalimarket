// Showmar için gerekli global değişkenler ve fonksiyonlar
window.mainCurrency = '₺';

// IdeaApp mock object
window.IdeaApp = {
  helpers: {
    getRouteGroup: function() {
      return 'default';
    },
    getFormValidateMessage: function(selector, attr) {
      return $(selector).attr(attr) || '';
    },
    checkEmail: function(email) {
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    formatMoney: function(amount) {
      return parseFloat(amount).toFixed(2).replace('.', ',');
    },
    enableElement: function(element) {
      element.prop('disabled', false);
    },
    disableElement: function(element) {
      element.prop('disabled', true);
    }
  }
};

// IdeaCart mock object
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
    getItemTotalQuantity: function(productId) {
      return 0;
    }
  },
  deleteItem: function(element, id) {
    // Mock delete function
  }
};

// openBox mock object
window.openBox = {
  reset: function() {
    $('body').removeClass('cart-content-active user-menu-content-active user-menu-welcome-active navigation-active');
    $('.openbox-overlay, .navigation-menu-overlay').hide();
  }
};

// jQuery validation plugin mock
if (typeof $.fn.validate === 'undefined') {
  $.fn.validate = function() {
    return {
      valid: function() { return true; }
    };
  };
  
  $.validator = {
    addMethod: function() {}
  };
}

// Document ready
$(document).ready(function() {
  // Initialize Showmar theme if available
  if (typeof IdeaTheme !== 'undefined') {
    try {
      IdeaTheme.init();
    } catch (e) {
      console.log('IdeaTheme initialization error:', e);
    }
  }
  
  // Initialize slick slider for hero banner
  $('#entry-slider .slick-slider').slick({
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: '<button type="button" class="slick-prev">‹</button>',
    nextArrow: '<button type="button" class="slick-next">›</button>'
  });
});