// import Router from 'vue-router'
function route(pathname) {
    console.log("About to route a request for " + pathname);
  }
   
exports.route = route;
// export default new Router({
//     // "mode": 'history',
//     routes: [
//         {
//             path: '/',
//             name: 'index',
//             component: require('@/components/index').default
//         },
//         {
//             path: '/createUser',
//             name: 'create',
//             component: require('@/components/server').default
//         },
//         {
//             path: '/detail',
//             name: 'detail',
//             component: require('@/components/detail').default
//         }
//     ]
// })
