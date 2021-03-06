/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use-strict';

angular.module('app.usuarioCtrl', [])

        .controller('usuarioCtrl', ['$scope', '$rootScope', '$window', '$stateParams', '$state', '$ionicHistory', '$ionicPopup', '$ionicLoading', 'usuarioFactory', 'usuarioService', 'urlFotoFactory', '$ionicPlatform', '$timeout', '$sce',
            function ($scope, $rootScope, $window, $stateParams, $state, $ionicHistory, $ionicPopup, $ionicLoading, usuarioFactory, usuarioService, urlFotoFactory, $ionicPlatform, $timeout, $sce) {

                $ionicPlatform.ready(function () {

                });
                
                $scope.abrirUrlExterna = function(urlExterna) {
                    $window.open(urlExterna, "_blank", "location=yes,clearsessioncache=yes,clearcache=yes");
                };

                $scope.aToOnclickHtml = function (html) {
                    let textoAux = html;
                    let vec = textoAux.split("</a>");
                    for (let i = 0; i < vec.length; i++) {
                        let posHrefIni = vec[i].indexOf("a href=\"");
                        if (posHrefIni !== -1) {
                            let textoAux1 = vec[i].substring(posHrefIni + 8);
                            let posComillasFinalHref = textoAux1.indexOf("\"");
                            if (posComillasFinalHref !== -1) {
                                let url = textoAux1.substring(0, posComillasFinalHref);
                                url = url.replace("\"", "");
                                let onclickcontenido = "window.open('" + url + "', '_blank', 'location=yes,EnableViewPortScale=yes');\" style=\"text-decoration: underline;color: blue;\"";
                                vec[i] = vec[i].replace(url, onclickcontenido);
                                vec[i] = vec[i].replace("href", "onclick");
                            }
                        }
                    }
                    if (vec.length > 0) {
                        textoAux = vec.join("</a>");
                    }
                    return textoAux;
                };

                $scope.trustAsHtml = function (html) {
                    return $sce.trustAsHtml(html);
                };

                $ionicPlatform.on('pause', function () {
                    $scope.taskChequeoMsj();
                    $timeout.cancel();
                });

                $scope.usuario = {
                    login: "",
                    clave: "",
                    urlFoto: urlFotoFactory.url
                };

                $scope.etapaSel = 1;

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
                    if (typeof (usuarioFactory.usuario) === "Undefined")
                        return false;
                    if (usuarioFactory.usuario === "") {
                        return false;
                    }
                    if (usuarioFactory.usuario === null) {
                        return false;
                    }
                    if (usuarioFactory.usuario.idPersona.alumno === null) {
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

                $scope.$on('$ionicView.afterEnter', function (event) {
                    $scope.taskChequeoMsj();
                });

                $scope.$on('$ionicView.beforeLeave', function () {
                    $scope.taskChequeoMsj();
                    $timeout.cancel();
                });

                $scope.taskChequeoMsj = function () {

                    //Aca va la llamada al web service
                    //cada X segundos

                    if ($scope.isLogueado()) {

                        usuarioService.obtenerMensajesUsuario(usuarioFactory.usuario.idUsuario, true)
                                .then(function (data) {

                                    usuarioFactory.mensajesNoLeidos = data;
                                })
                                .catch(function (data) {

                                });
                    }

                    $timeout($scope.taskChequeoMsj, 60000);//Chequeo mensajes cada 1 minuto
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

                $scope.irAgestion = function (persona) {
                    usuarioFactory.personaSel = persona;
                    $state.go('menu.gestion', {}, {location: "replace"});
                };

                $scope.buscarCalificacionesPersona = function () {

                    $ionicLoading.show({
                        template: '<ion-spinner icon=\"android\" class=\"spinner-energized\"></ion-spinner>'
                    });

                    usuarioService.obtenerCalificacionesPersona(usuarioFactory.personaSel.idPersona)
                            .then(function (data) {
                                $ionicLoading.hide();

                                usuarioFactory.notasPersonaSel = data;

//                                $ionicHistory.nextViewOptions({
//                                    disableBack: true
//                                });
                                if (usuarioFactory.notasPersonaSel.length > 0) {
                                    $state.go('menu.calificaciones', {}, {location: "replace"});
                                } else {
                                    $ionicPopup.alert({
                                        title: 'Info',
                                        template: 'No se encontraron notas cargadas para el alumno'
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

                $scope.getNotasPersonaSel = function () {
                    return usuarioFactory.notasPersonaSel;
                };

                $scope.toggleGroup = function (nota) {
                    if ($scope.isGroupShown(nota)) {
                        $scope.shownGroup = null;
                    } else {
                        $scope.shownGroup = nota;
                    }
                };

                $scope.isGroupShown = function (nota) {
                    return $scope.shownGroup === nota;
                };

                $scope.cambiarEtapa = function (etapa) {
                    $scope.etapaSel = etapa;
                };

                $scope.hayNotasEnMateria1eras5Etapa1 = function (materia) {
                    if (materia.calificacionParcialE101 !== ''
                            || materia.calificacionParcialE102 !== ''
                            || materia.calificacionParcialE103 !== ''
                            || materia.calificacionParcialE104 !== ''
                            || materia.calificacionParcialE105 !== '') {
                        return true;
                    }
                    return false;
                };

                $scope.hayNotasEnMateria2das5Etapa1 = function (materia) {
                    if (materia.calificacionParcialE106 !== ''
                            || materia.calificacionParcialE107 !== ''
                            || materia.calificacionParcialE108 !== ''
                            || materia.calificacionParcialE109 !== ''
                            || materia.calificacionParcialE110 !== '') {
                        return true;
                    }
                    return false;
                };

                $scope.hayNotasEnMateria1eras5Etapa2 = function (materia) {
                    if (materia.calificacionParcialE201 !== ''
                            || materia.calificacionParcialE202 !== ''
                            || materia.calificacionParcialE203 !== ''
                            || materia.calificacionParcialE204 !== ''
                            || materia.calificacionParcialE205 !== '') {
                        return true;
                    }
                    return false;
                };

                $scope.hayNotasEnMateria2das5Etapa2 = function (materia) {
                    if (materia.calificacionParcialE206 !== ''
                            || materia.calificacionParcialE207 !== ''
                            || materia.calificacionParcialE208 !== ''
                            || materia.calificacionParcialE209 !== ''
                            || materia.calificacionParcialE210 !== '') {
                        return true;
                    }
                    return false;
                };

                $scope.hayNotasEnMateria1eras5Etapa3 = function (materia) {
                    if (materia.calificacionParcialE301 !== ''
                            || materia.calificacionParcialE302 !== ''
                            || materia.calificacionParcialE303 !== ''
                            || materia.calificacionParcialE304 !== ''
                            || materia.calificacionParcialE305 !== '') {
                        return true;
                    }
                    return false;
                };

                $scope.hayNotasEnMateria2das5Etapa3 = function (materia) {
                    if (materia.calificacionParcialE306 !== ''
                            || materia.calificacionParcialE307 !== ''
                            || materia.calificacionParcialE308 !== ''
                            || materia.calificacionParcialE309 !== ''
                            || materia.calificacionParcialE310 !== '') {
                        return true;
                    }
                    return false;
                };

                $scope.buscarAsistenciaPersona = function () {

                    $ionicLoading.show({
                        template: '<ion-spinner icon=\"android\" class=\"spinner-energized\"></ion-spinner>'
                    });

                    usuarioService.obtenerAsistenciaPersona(usuarioFactory.personaSel.idPersona)
                            .then(function (data) {
                                $ionicLoading.hide();

                                usuarioFactory.asistenciasPersonaSel = data;

//                                $ionicHistory.nextViewOptions({
//                                    disableBack: true
//                                });
                                if (usuarioFactory.asistenciasPersonaSel.length > 0) {
                                    $state.go('menu.asistencias', {}, {location: "replace"});
                                } else {
                                    $ionicPopup.alert({
                                        title: 'Info',
                                        template: 'No se encontraron inasistencias cargadas'
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

                $scope.getAsistenciasPersonaSel = function () {
                    return usuarioFactory.asistenciasPersonaSel;
                };

                $scope.buscarSancionPersona = function () {

                    $ionicLoading.show({
                        template: '<ion-spinner icon=\"android\" class=\"spinner-energized\"></ion-spinner>'
                    });

                    usuarioService.obtenerSancionPersona(usuarioFactory.personaSel.idPersona)
                            .then(function (data) {
                                $ionicLoading.hide();

                                usuarioFactory.sancionesPersonaSel = data;

//                                $ionicHistory.nextViewOptions({
//                                    disableBack: true
//                                });
                                if (usuarioFactory.sancionesPersonaSel.length > 0) {
                                    $state.go('menu.sanciones', {}, {location: "replace"});
                                } else {
                                    $ionicPopup.alert({
                                        title: 'Info',
                                        template: 'No se encontraron datos cargados'
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

                $scope.getSancionesPersonaSel = function () {
                    return usuarioFactory.sancionesPersonaSel;
                };

                $scope.verDetalleSancionPersonaSel = function (sancion) {
                    let texto = "<ul><li>Fecha: <b>" + sancion.diaDelMes + "/" + sancion.mes + "/" + sancion.anho + "</b></li>";
                    texto += (sancion.motivo === '') ? "" : ("<li>Motivo: <b>" + sancion.motivo + "</b></li>");
                    texto += "<li>Tipo: <b>" + sancion.idSancionAlumnoTipo.nombre + "</b></li>";
                    texto += (sancion.solicitadaPor === '') ? "" : ("<li>Solicitado por: <b>" + sancion.solicitadaPor + "</b></li></ul>");

                    $ionicPopup.alert({
                        title: 'Detalle de los datos registrados',
                        template: texto
                    });
                };


                function unificarHijos() {
                    try {
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
                    } catch (e) {
                        usuarioFactory.usuario.personaCollection = [];
                    }
                }

            }]);
