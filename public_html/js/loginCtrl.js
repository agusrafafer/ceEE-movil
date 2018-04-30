/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module('app.loginCtrl', [])

        .controller('loginCtrl', ['$scope', '$stateParams', '$state', '$ionicHistory', '$ionicPopup', '$ionicLoading', 'usuarioFactory', 'usuarioService',
            function ($scope, $stateParams, $state, $ionicHistory, $ionicPopup, $ionicLoading, usuarioFactory, usuarioService) {

                $scope.usuario = {
                    login: "",
                    clave: ""
                };

                $scope.$on('$ionicView.loaded', function (event) {
                    $ionicLoading.show({
                        template: '<ion-spinner icon=\"android\" class=\"spinner-energized\"></ion-spinner>'
                    });
                    var authToken = localStorage.getItem("usuarioFactory.authToken");
                    if (authToken !== null) {
                        usuarioService.tratarTokenAutorizacion(authToken);
                        var expira = localStorage.getItem("usuarioFactory.authExpDate");
                        var fecha = new Date();
                        if (fecha.getTime() > Number.parseInt(expira)) {
                            usuarioService.validarLogin(usuarioFactory.usuario.login, usuarioFactory.usuario.contrasenha)
                                    .then(function (response) {
                                        $ionicLoading.hide();
                                        usuarioService.tratarTokenAutorizacion(response.headers()['authorization']);
                                        $ionicHistory.nextViewOptions({
                                            disableBack: true
                                        });
                                        $state.go('menu.home', {}, {location: "replace"});
                                    })
                                    .catch(function (data) {
                                        $ionicLoading.hide();
                                        usuarioFactory.usuario = "";
                                        usuarioFactory.authToken = "";
                                        usuarioFactory.authExpDate = -1;
                                    });
                        }
                    } else {
                        $ionicLoading.hide();
                    }
                });
                
                
                $scope.loopChequeo = function () {

                    cordova.plugins.backgroundMode.setDefaults({
                        title: 'Proceso en background1',
                        text: 'Ejecutando en background1'
                    });

                    // Enable background mode while track is playing
                    cordova.plugins.backgroundMode.enable();

                    // Called when background mode has been activated
                    cordova.plugins.backgroundMode.onactivate = function () {
                        taskChequeoMsj();
                    };


                };


                function taskChequeoMsj() {
                    console.log("Hola loop");
                    alert("Hola loop");
                    
                    window.setTimeout(taskChequeoMsj, 5000);
                }

//                $scope.onloadCtrl = function () {
//                    $ionicLoading.show({
//                        template: '<ion-spinner icon=\"android\" class=\"spinner-energized\"></ion-spinner>'
//                    });
//                    var authToken = localStorage.getItem("usuarioFactory.authToken");
//                    if (authToken !== null) {
//                        usuarioService.tratarTokenAutorizacion(authToken);
//                        var expira = localStorage.getItem("usuarioFactory.authExpDate");
//                        var fecha = new Date();
//                        if (fecha.getTime() > Number.parseInt(expira)) {
//                            usuarioService.validarLogin(usuarioFactory.usuario.login, usuarioFactory.usuario.contrasenha)
//                                    .then(function (response) {
//                                        $ionicLoading.hide();
//                                        usuarioService.tratarTokenAutorizacion(response.headers()['authorization']);
//                                        $ionicHistory.nextViewOptions({
//                                            disableBack: true
//                                        });
//                                        $state.go('menu.home', {}, {location: "replace"});
//                                    })
//                                    .catch(function (data) {
//                                        $ionicLoading.hide();
//                                        usuarioFactory.usuario = "";
//                                        usuarioFactory.authToken = "";
//                                        usuarioFactory.authExpDate = -1;
//                                    });
//                        }
//                    } else {
//                        $ionicLoading.hide();
//                    }
//                };

                $scope.validarUsuario = function () {
                    $ionicLoading.show({
                        template: '<ion-spinner icon=\"android\" class=\"spinner-energized\"></ion-spinner>'
                    });


                    usuarioService.validarLogin($scope.usuario.login, $scope.usuario.clave)
                            .then(function (response) {
                                $ionicLoading.hide();
                                usuarioService.tratarTokenAutorizacion(response.headers()['authorization']);
                                if (usuarioFactory.usuario !== null) {
                                    $ionicHistory.nextViewOptions({
                                        disableBack: true
                                    });
                                    $state.go('menu.home', {}, {location: "replace"});
                                } else {
                                    usuarioFactory.usuario = "";
                                    $ionicPopup.alert({
                                        title: 'Info',
                                        template: 'Usuario o clave incorrecta'
                                    });
                                }
                            })
                            .catch(function (data) {
                                $ionicLoading.hide();
                                $ionicPopup.alert({
                                    title: 'Info',
                                    template: data
                                });
                            });



                };

                $scope.recuperarClave = function () {
                    $scope.loopChequeo();
                    var promptPopup = $ionicPopup.prompt({
                        title: 'Recuperar clave',
                        template: 'Ingrese su correo electrónico',
                        inputType: 'email',
                        inputPlaceholder: 'usuario@correo.com'
                    });

                    promptPopup.then(function (res) {
                        if (!res) {
                            $ionicPopup.alert({
                                title: 'Info',
                                template: 'El correo ingresado no es válido'
                            });
                        } else {
                            //Enviar el mail de recuperacion con ws y desde aqui 
                            //llamar al servicio correspondiente
                        }
                    });
                };

                $scope.salir = function () {
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Info',
                        template: '¿Seguro desea salir?',
                        okText: 'Si',
                        cancelText: 'No'
                    });

                    confirmPopup.then(function (res) {
                        if (res) {
                            usuarioFactory.usuario = "";
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $state.go('menu.login', {}, {location: "replace"});
                        }
                    });

                };




                


            }]);

