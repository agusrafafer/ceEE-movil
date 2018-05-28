/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module('app.loginCtrl', [])

        .controller('loginCtrl', ['$scope', '$stateParams', '$state', '$ionicHistory', '$ionicPopup', '$ionicLoading', 'usuarioFactory', 'usuarioService', '$webSql', 'jwtHelper',
            function ($scope, $stateParams, $state, $ionicHistory, $ionicPopup, $ionicLoading, usuarioFactory, usuarioService, $webSql, jwtHelper) {

                $scope.db = $webSql.openDatabase('dbCeEE', '1.0', 'dbCeEE', 2 * 1024 * 1024);

                $scope.usuario = {
                    login: "",
                    clave: ""
                };

                $scope.$on('$ionicView.loaded', function (event) {                   
                    
                    $ionicLoading.show({
                        template: '<ion-spinner icon=\"android\" class=\"spinner-energized\"></ion-spinner>'
                    });

                    $scope.db.createTable('authceEE', {
                        "id": {
                            "type": "INTEGER",
                            "null": "NOT NULL", // default is "NULL" (if not defined)
                            "primary": true, // primary
                            "auto_increment": true // auto increment
                        },
                        "authToken": {
                            "type": "TEXT",
                            "null": "NOT NULL"
                        },
                        "authExpDate": {
                            "type": "INTEGER"
                        }
                    });

                    var authToken = "";
                    var dateAuth = -1;

                    $scope.db.selectAll("authceEE").then(function (results) {
                        if (results.rows.length > 0) {
                            authToken = results.rows.item(0).authToken;
                            dateAuth = results.rows.item(0).authExpDate;
//                            alert(authToken);
                            if (typeof (authToken) !== "undefined" && authToken !== null && authToken !== '') {
                                tratarTokenAutorizacion(authToken);
                                var expira = dateAuth;
                                var fecha = new Date();
                                if (fecha.getTime() > Number.parseInt(expira)) {
                                    alert(usuarioFactory.usuario.login);
                                    alert(usuarioFactory.usuario.contrasenha);
                                    usuarioService.validarLogin(usuarioFactory.usuario.login, usuarioFactory.usuario.contrasenha)
                                            .then(function (response) {
                                                $ionicLoading.hide();
                                                tratarTokenAutorizacion(response.headers()['authorization']);
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
                        } else {
                            $ionicLoading.hide();
                        }
                    });
                });

                function tratarTokenAutorizacion(headerAutorizacion) {
                    usuarioFactory.authToken = headerAutorizacion;
                    var tokenPayload = jwtHelper.decodeToken(usuarioFactory.authToken);
                    usuarioFactory.usuario = JSON.parse(tokenPayload.usuario);
                    usuarioFactory.authExpDate = tokenPayload.exp;
                    guardarAutorizacion();
                }
                ;

                function guardarAutorizacion() {
                    $scope.db.selectAll("authceEE").then(function (results) {
                        var id = -1;
                        if (results.rows.length > 0) {
                            id = results.rows.item(0).id;
                            $scope.db.update("authceEE", {"authToken": JSON.stringify(usuarioFactory.authToken), "authExpDate": usuarioFactory.authExpDate}, {
                                'id': id
                            });
                        } else {
                            $scope.db.insert('authceEE', {"authToken": JSON.stringify(usuarioFactory.authToken), "authExpDate": usuarioFactory.authExpDate}).then(function (results) {

                            });
                        }
                    });

                }
                ;

//                $scope.onloadCtrl = function () {
//                    $ionicLoading.show({
//                        template: '<ion-spinner icon=\"android\" class=\"spinner-energized\"></ion-spinner>'
//                    });
//                    var authToken = $localStorage.getItem("usuarioFactory.authToken");
//                    if (authToken !== null) {
//                        usuarioService.tratarTokenAutorizacion(authToken);
//                        var expira = $localStorage.getItem("usuarioFactory.authExpDate");
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
                                tratarTokenAutorizacion(response.headers()['authorization']);
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

