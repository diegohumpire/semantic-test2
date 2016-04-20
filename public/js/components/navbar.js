var NavbarComponent = Vue.extend({
  template: '#navbar-template',
  methods: {
    signOut: function() {
      var authController = new AuthController();
      authController.signOut();
    }
  }
});

Vue.component('navbar-component', NavbarComponent);