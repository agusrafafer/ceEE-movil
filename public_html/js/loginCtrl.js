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
                            .then(function (data) {
                                $ionicLoading.hide();
                                usuarioFactory.usuario = data;
//                                alert("Hola: " + usuarioFactory.usuario.nombre);
                                $ionicHistory.nextViewOptions({
                                    disableBack: true
                                });
                                $state.go('menu.home', {}, {location: "replace"});
                            })
                            .catch(function (data, status) {
                                $ionicLoading.hide();
                                $ionicPopup.alert({
                                    title: 'Info',
                                    template: 'Hubo un error al intentar ingresar.'
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

