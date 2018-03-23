angular.module('app.routes', [])

        .config(function ($stateProvider, $urlRouterProvider) {

            // Ionic uses AngularUI Router which uses the concept of states
            // Learn more here: https://github.com/angular-ui/ui-router
            // Set up the various states which the app can be in.
            // Each state's controller can be found in controllers.js
            $stateProvider


                    .state('menu.home', {
                        url: '/page1',
                        views: {
                            'side-menu21': {
                                templateUrl: 'templates/home.html',
                                controller: 'usuarioCtrl'
                            }
                        }
                    })


                    .state('menu', {
                        url: '/side-menu21',
                        templateUrl: 'templates/menu.html',
                        controller: 'usuarioCtrl'
                    })

                    .state('menu.login', {
                        url: '/page4',
                        views: {
                            'side-menu21': {
                                templateUrl: 'templates/login.html',
                                controller: 'loginCtrl'
                            }
                        }
                    })

                    .state('menu.mensajes', {
                        url: '/mensajes',
                        views: {
                            'side-menu21': {
                                templateUrl: 'templates/mensajes.html',
                                controller: 'usuarioCtrl'
                            }
                        }
                    })

                    .state('menu.mensajeDetalle', {
                        url: '/page7',
                        views: {
                            'side-menu21': {
                                templateUrl: 'templates/mensajeDetalle.html',
                                controller: 'usuarioCtrl'
                            }
                        }
                    })
                    
                    .state('menu.miCuenta', {
                        url: '/page8',
                        views: {
                            'side-menu21': {
                                templateUrl: 'templates/miCuenta.html',
                                controller: 'usuarioCtrl'
                            }
                        }
                    });

            $urlRouterProvider.otherwise('/side-menu21/page4');


        });