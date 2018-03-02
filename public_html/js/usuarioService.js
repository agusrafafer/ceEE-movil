angular.module('app.usuarioService', [])

        .service('usuarioService', ['$http', '$q', 'wsFactory', 'usuarioFactory',
            function ($http, $q, wsFactory, usuarioFactory) {

                this.validarLogin = function (login, password) {
                    //defered = diferido (asincrono)
                    var defered = $q.defer();
                    var promise = defered.promise;

                    $http.put(wsFactory.url + '/usuario', {login: login, clave: password})
                            //$http.get(wsFactory.url + '/usuario' + login + '/' + password)
                            .success(function (data) {
                                defered.resolve(data);
                            })
                            .error(function (data, status) {
                                defered.reject(data, status);
                            });

                    return promise;
                };


            }]);