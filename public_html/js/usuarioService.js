angular.module('app.usuarioService', [])

        .service('usuarioService', ['$http', '$q', 'wsFactory', 'usuarioFactory', 'jwtHelper', 
            function ($http, $q, wsFactory, usuarioFactory, jwtHelper) {

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

                this.tratarTokenAutorizacion = function (headerAutorizacion) {
                    usuarioFactory.authToken = headerAutorizacion;
                    var tokenPayload = jwtHelper.decodeToken(usuarioFactory.authToken);
                    usuarioFactory.usuario = JSON.parse(tokenPayload.usuario);
                    usuarioFactory.authExpDate = tokenPayload.exp;
                    //localStorage.setItem("usuarioFactory.usuario", usuarioFactory.usuario);
                    localStorage.setItem("usuarioFactory.authToken", usuarioFactory.authToken);
                    localStorage.setItem("usuarioFactory.authExpDate", usuarioFactory.authExpDate);
                };
                
                this.verificarExpiraToken = function () {
                    var expira = localStorage.getItem("usuarioFactory.authExpDate");
                    var fecha = new Date();
                    //fecha.
                    if(fecha.getMilliseconds() > expira){
                        var response = this.validarLogin(usuarioFactory.usuario.login, usuarioFactory.usuario.clave);
                        this.tratarTokenAutorizacion(response.headers()['authorization']);
                    }
                    
                };


                this.obtenerMensajesUsuario = function (idUsuario) {
                    var token = usuarioFactory.authToken;

                    var configuracion = {
                        headers: {
                            'authorization': token 
                        }
                    };

                    return $http.get(wsFactory.url + '/usuario/mensaje/' + idUsuario, configuracion)
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