// Vue Object
var App = Vue.extend({});

var router = new VueRouter();

router.map({
    '/signin': {
        component: SignInComponent
    },
    '/todo': {
        component: TodoComponent
    },
    '/': {
        component: SignInComponent
    }
});

router.start(App, '#appTodo');