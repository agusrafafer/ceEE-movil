/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use-strict';

angular.module('app.usuarioCtrl', [])

        .controller('usuarioCtrl', ['$scope', '$stateParams', '$state', '$ionicHistory', '$ionicPopup', '$ionicLoading', 'usuarioFactory', 'usuarioService', 'urlFotoFactory',
            function ($scope, $stateParams, $state, $ionicHistory, $ionicPopup, $ionicLoading, usuarioFactory, usuarioService, urlFotoFactory) {

                $scope.usuario = {
                    login: "",
                    clave: "",
                    urlFoto: urlFotoFactory.url
                };

                $scope.isLogueado = function () {
                    if (usuarioFactory.usuario === null) {
                        return false;
                    }
                    if (typeof (usuarioFactory.usuario) === "undefined")
                        return false;
                    if (usuarioFactory.usuario === "") {
                        return false;
                    }
                    return true;
                };

                $scope.isAlumno = function () {
                    if (typeof (usuarioFactory.usuario) === "undefined")
                        return false;
                    if (usuarioFactory.usuario === "") {
                        return false;
                    }
                    if (usuarioFactory.usuario === null) {
                        return false;
                    }
                    if (usuarioFactory.usuario.idPersona.idPadre === null &&
                            usuarioFactory.usuario.idPersona.idMadre === null &&
                            usuarioFactory.usuario.idPersona.idTutor === null) {
                        return false;
                    }
                    if (usuarioFactory.usuario.idPersona.idTutor === null) {
                        return false;
                    }
                    return true;
                };

                $scope.buscarMensajesUsuario = function () {

                    $ionicLoading.show({
                        template: '<ion-spinner icon=\"android\" class=\"spinner-energized\"></ion-spinner>'
                    });

                    usuarioService.obtenerMensajesUsuario(usuarioFactory.usuario.idUsuario, false)
                            .then(function (data) {
                                $ionicLoading.hide();

                                usuarioFactory.mensajes = data;

                                $ionicHistory.nextViewOptions({
                                    disableBack: true
                                });
                                $state.go('menu.mensajes', {}, {location: "replace"});

                            })
                            .catch(function (data) {
                                $ionicLoading.hide();
                                $ionicPopup.alert({
                                    title: 'Info',
                                    template: data
                                });
                            });
                };

                $scope.getMensajes = function () {
                    return usuarioFactory.mensajes;
                };

                $scope.verMensaje = function (index, navegar) {
                    usuarioFactory.mensajeSel = usuarioFactory.mensajes[index];
                    $ionicLoading.show({
                        template: '<ion-spinner icon=\"android\" class=\"spinner-energized\"></ion-spinner>'
                    });

                    if (!usuarioFactory.mensajeSel.leido) {
                        usuarioService.marcarMensajeUsuarioComoLeido(usuarioFactory.mensajeSel.idMensajeDestinatario)
                                .then(function (data) {
                                    usuarioService.obtenerMensajesUsuario(usuarioFactory.usuario.idUsuario, false)
                                            .then(function (data) {
                                                $ionicLoading.hide();

                                                usuarioFactory.mensajes = data;

                                            })
                                            .catch(function (data) {
                                                $ionicLoading.hide();
                                                $ionicPopup.alert({
                                                    title: 'Info',
                                                    template: data
                                                });
                                            });

                                })
                                .catch(function (data) {
                                    $ionicLoading.hide();
                                    $ionicPopup.alert({
                                        title: 'Info',
                                        template: data
                                    });
                                });
                    }
                    $ionicLoading.hide();
                    if (navegar) {
                        $state.go('menu.mensajeDetalle', {}, {location: "replace"});
                    }
                };

                $scope.getMensajeSel = function () {
                    return usuarioFactory.mensajeSel;
                };

                $scope.getUsuario = function () {
                    if (typeof (usuarioFactory.usuario) === "undefined")
                        return null;
                    if (usuarioFactory.usuario === "") {
                        return null;
                    }
                    unificarHijos();
                    return usuarioFactory.usuario;
                };

                $scope.$on('$ionicView.loaded', function (event) {
                    $scope.loopChequeo();
                });

                $scope.loopChequeo = function () {

//                    cordova.plugins.backgroundMode.setDefaults({
//                        title: 'Proceso en background1',
//                        text: 'Ejecutando en background1'
//                    });


//                    cordova.plugins.backgroundMode.enable();


//                    cordova.plugins.backgroundMode.onactivate = function () {
                    $scope.taskChequeoMsj();
//                    };


                };


                $scope.taskChequeoMsj = function () {
                    //                    console.log("Hola loop");
//                    alert("Hola loop");

                    //Aca va la llamada al web service
                    //y el aumento del badget

                    if ($scope.isLogueado()) {
                        usuarioService.obtenerMensajesUsuario(usuarioFactory.usuario.idUsuario, true)
                                .then(function (data) {

                                    usuarioFactory.mensajesNoLeidos = data;


                                })
                                .catch(function (data) {

                                });
                    }

                    window.setTimeout($scope.taskChequeoMsj, 5000);
                };

                $scope.getMensajesNoLeidos = function () {
                    return usuarioFactory.mensajesNoLeidos;
                };

                $scope.proximamente = function () {
                    $ionicPopup.alert({
                        title: 'Info',
                        template: 'Esta funcionalidad se encuentra aún en desarrollo'
                    });
                };


                function unificarHijos() {
                    var hijos = [];

                    //cargo en un array auxiliar los hijos del tutor en primera medida
                    var vecHijosTutor = usuarioFactory.usuario.idPersona.personaCollection;
                    for (var i in vecHijosTutor) {
                        hijos.push(vecHijosTutor[i]);
                    }


                    //verifico y cargo los hijos del padre siempre y cuando no hayan sido cargados desde el array del tutor
                    var vecHijosPadre = usuarioFactory.usuario.idPersona.personaCollection1;
                    for (var i in vecHijosPadre) {
                        var existe = false;
                        for (var j in hijos) {
                            if (vecHijosPadre[i].idPersona === hijos[j].idPersona) {
                                existe = true;
                                break;
                            }
                        }
                        if (!existe) {
                            hijos.push(vecHijosPadre[i]);
                        }
                    }

                    //verifico y cargo los hijos de la madre siempre y cuando no hayan sido cargados desde el array del tutor
                    var vecHijosMadre = usuarioFactory.usuario.idPersona.personaCollection2;
                    for (var i in vecHijosMadre) {
                        var existe = false;
                        for (var j in hijos) {
                            if (vecHijosMadre[i].idPersona === hijos[j].idPersona) {
                                existe = true;
                                break;
                            }
                        }
                        if (!existe) {
                            hijos.push(vecHijosMadre[i]);
                        }
                    }

                    usuarioFactory.usuario.personaCollection = hijos;
                }







            }]);

