angular.module('app.usuarioService', [])

        .service('usuarioService', ['$http', '$q', 'wsFactory', 'usuarioFactory',
            function ($http, $q, wsFactory, usuarioFactory) {

                this.validarLogin = function (login, password) {
                    return $http.put(wsFactory.url + '/usuario', {login: login, clave: password})
//                            //$http.get(wsFactory.url + '/usuario' + login + '/' + password)
                            .then(function (response) {
                                //todo ok
                                //The response object has these properties:
                                //data – {string|Object} – The response body transformed with the transform functions.
                                //status – {number} – HTTP status code of the response.
                                //headers – {function([headerName])} – Header getter function.
                                //config – {Object} – The configuration object that was used to generate the request.
                                //statusText – {string} – HTTP status text of the response.
                                //xhrStatus – {string} – Status of the XMLHttpRequest (complete, error, timeout or abort).
                                return response;
                            }, function (response) {
                                //Todo mal
                                throw "Hubo un error al intentar ingresar";
                            });
                };

                this.obtenerMensajesUsuario = function (idUsuario, banderaLeidos) {
                    var token = usuarioFactory.authToken;

                    var configuracion = {
                        headers: {
                            'authorization': token
                        }
                    };

                    return $http.get(wsFactory.url + '/usuario/mensaje/' + idUsuario + '/' + banderaLeidos, configuracion)
                            .then(function (response) {
                                //todo ok
                                //The response object has these properties:
                                //data – {string|Object} – The response body transformed with the transform functions.
                                //status – {number} – HTTP status code of the response.
                                //headers – {function([headerName])} – Header getter function.
                                //config – {Object} – The configuration object that was used to generate the request.
                                //statusText – {string} – HTTP status text of the response.
                                //xhrStatus – {string} – Status of the XMLHttpRequest (complete, error, timeout or abort).
                                return response.data;
                            }, function (response) {
                                //Todo mal
                                throw "Hubo un error al cargar los mensajes";
                            });
                };

                this.marcarMensajeUsuarioComoLeido = function (idMensaje) {
                    var token = usuarioFactory.authToken;

                    var configuracion = {
                        headers: {
                            'authorization': token
                        }
                    };

                    return $http.put(wsFactory.url + '/usuario/mensaje/', {'idMensaje': idMensaje}, configuracion)
                            .then(function (response) {
                                //todo ok
                                //The response object has these properties:
                                //data – {string|Object} – The response body transformed with the transform functions.
                                //status – {number} – HTTP status code of the response.
                                //headers – {function([headerName])} – Header getter function.
                                //config – {Object} – The configuration object that was used to generate the request.
                                //statusText – {string} – HTTP status text of the response.
                                //xhrStatus – {string} – Status of the XMLHttpRequest (complete, error, timeout or abort).
                                return response.data;
                            }, function (response) {
                                //Todo mal
                                throw "Hubo un error al cargar los mensajes";
                            });
                };


            }




        ]);