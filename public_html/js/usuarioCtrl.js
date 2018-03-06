/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module('app.usuarioCtrl', [])

        .controller('usuarioCtrl', ['$scope', '$stateParams', '$state', '$ionicHistory', '$ionicPopup', '$ionicLoading', 'usuarioFactory', 'usuarioService',
            function ($scope, $stateParams, $state, $ionicHistory, $ionicPopup, $ionicLoading, usuarioFactory, usuarioService) {

                $scope.usuario = {
                    login: "",
                    clave: ""
                };

                $scope.buscarMensajesUsuario = function () {
                    
                    $ionicLoading.show({
                        template: '<ion-spinner icon=\"android\" class=\"spinner-energized\"></ion-spinner>'
                    });


                    usuarioService.obtenerMensajesUsuario(usuarioFactory.usuario.idUsuario)
                            .then(function (data) {
                                $ionicLoading.hide();
                                usuarioFactory.mensajes = data;
                                $ionicHistory.nextViewOptions({
                                    disableBack: true
                                });
                                $state.go('menu.mensajes', {}, {location: "replace"});
                                
                            })
                            .catch(function (data, status) {
                                $ionicLoading.hide();
                                $ionicPopup.alert({
                                    title: 'Info',
                                    template: 'Hubo un error al cargar los mensajes.'
                                });
                            });



                };

                $scope.getMensajes = function () {
                    return usuarioFactory.mensajes;
                };


            }]);

