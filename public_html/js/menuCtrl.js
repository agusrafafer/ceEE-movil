/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


angular.module('app.menuCtrl', [])

        .controller('menuCtrl', ['$scope', '$state', '$stateParams', '$ionicPopup', 'usuarioFactory', 'usuarioService',
            function ($scope, $state, $stateParams, $ionicPopup, usuarioFactory, usuarioService) {


                $scope.isLogueado = function () {
                    if (typeof (usuarioFactory.usuario) === "undefined")
                        return false;
                    if (usuarioFactory.usuario === "") {
                        return false;
                    }
                    return true;
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
                            $state.go('menu.home', {}, {location: "replace"});
                        }
                    });

                };


            }
        ]);
