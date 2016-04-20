var AuthController = function() {
  
  var signOut = function() {
    router.app.userAuth = new UserAuth();
    localStorage.removeItem('user_token');
    router.go({ name: 'default' });
  };
  
  return {
    signOut: signOut
  };
}