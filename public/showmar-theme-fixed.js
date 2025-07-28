// Showmar Theme - Simplified Version
(function($, w) {
  'use strict';
  
  if (!w.jQuery) {
    console.error('IdeaApp: jQuery not found');
    return;
  }

  // Ensure IdeaTheme exists
  if (!w.IdeaTheme) {
    w.IdeaTheme = {};
  }

  w.IdeaTheme = {
    init: function() {
      console.log('IdeaTheme initializing...');
      
      // Initialize components safely
      if (this.navigationMenu && this.navigationMenu.init) {
        this.navigationMenu.init();
      }
      
      if (this.cart && this.cart.init) {
        this.cart.init();
      }
      
      this.eventListener();
      this.afterInit();
    },

    afterInit: function() {
      if (this.cart && this.cart.updateCartContainer) {
        this.cart.updateCartContainer();
      }
      
      this.initLazyLoad();
      
      // Initialize route-specific functionality
      var routeGroup = (this.getRouteGroup && this.getRouteGroup()) || 'default';
      if (this[routeGroup] && this[routeGroup].init) {
        this[routeGroup].init();
      }
      
      if (this.login && this.login.init) {
        this.login.init();
      }
      
      this.bannerTitle();
      this.headerFixed();
    },

    getRouteGroup: function() {
      return 'default';
    },

    initLazyLoad: function() {
      // Lazy loading implementation
      if (typeof lazyload === 'function') {
        lazyload();
      }
    },

    bannerTitle: function() {
      // Banner title functionality
    },

    headerFixed: function() {
      // Header fixed functionality
      var self = this;
      $(window).on('scroll', function() {
        self.scrollToggle($(this));
      });
    },

    scrollTop: function() {
      $("html, body").animate({scrollTop: 0}, 400);
    },

    scrollToggle: function(element) {
      if (element.scrollTop() > 200) {
        $("#scroll-top").stop().fadeIn();
      } else {
        $("#scroll-top").stop().fadeOut();
      }
    },

    navigationMenu: {
      init: function() {
        console.log('Navigation menu initialized');
        
        // Category overflow click handler
        $(document).on('click', '.category-overflow', function() {
          var categoryLevel = $(this).closest('.category-level-1');
          categoryLevel.toggleClass('active');
        });
      }
    },

    cart: {
      init: function() {
        console.log('Cart initialized');
        this.updateCartContainer();
      },

      updateCartContainer: function() {
        var cartTotal = $('[data-selector="cart-total-price"]');
        var cartCount = $('[data-selector="cart-item-count"]');
        
        if (cartTotal.length) {
          cartTotal.html('0,00 ₺');
        }
        
        if (cartCount.length) {
          cartCount.hide();
        }
      }
    },

    login: {
      init: function() {
        console.log('Login initialized');
      }
    },

    eventListener: function() {
      var self = this;
      
      // Scroll to top
      $(document).on('click', '#scroll-top', function() {
        self.scrollTop();
      });

      // Window scroll
      $(window).on('scroll', function() {
        self.headerFixed();
        self.scrollToggle($(this));
      });

      // OpenBox close
      $(document).on('click', '[data-selector="openbox-close"]', function() {
        if (window.openBox && window.openBox.reset) {
          window.openBox.reset();
        }
      });
    }
  };

})(jQuery, window);

// Initialize when DOM is ready
$(function() {
  if (window.IdeaTheme && window.IdeaTheme.init) {
    window.IdeaTheme.init();
  }
});