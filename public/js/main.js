// Vue Object
var App = Vue.extend({
    data: function() {
        return {
            userAuth: new UserAuth()
        }
    },
    ready: function() {
        
    }
});

var router = new VueRouter();

router.map({
    '/login': {
        component: SignInComponent,
        name: 'signIn'
    },
    '/todo': {
        component: TodoComponent,
        name: 'todoApp'
    },
    '/': {
        component: SignInComponent,
        name: 'default'
    }
});

router.start(App, '#App');

// router.beforeEach(function (transition) {
//     var token = localStorage.getItem('user_token');
//     if(token.length > 0) {
//         // router.redirect(transition.to.path);
//         transition.next();
//     } else {
//         router.go({ name: "/" });
//     }
// })