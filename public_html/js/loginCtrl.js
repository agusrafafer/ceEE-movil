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


            }]);

