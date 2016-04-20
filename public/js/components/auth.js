var SignInComponent = Vue.extend({
  template: '#sign-in-template',
  data: function () {
    return {
      user: {}
    };
  },
  methods: {
    signIn: function() {
      this.$http.post(appUrls.tokenizer, this.user)
        .then(
          function(response) {
            
            var user = router.app.userAuth;
            user.token = response.data.token;
            user.username = response.data.user.username;
            user.authenticated = true;
            user.tasks = response.data.user.tasks;
            
            localStorage.setItem('user_token', response.data.token);
            
            router.go({ name: "todoApp" });
          },
          function(response) {
            console.log(response.data);
          });
    }
  },
  route: {
    canActivate: function() {},
    activate: function() {
      var token = localStorage.getItem('user_token');
      
      if(token != null) {
        if (token.length > 0) {
          router.go({ name: 'todoApp' });
        } else {
          router.stop();
        }
      }
    }
  }
});