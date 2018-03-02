/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('app.factories', [])
        .factory('usuarioFactory', function () {
            return {
                usuario: "",
                tituloMenu: "Escolar App",
                clientIdMp: "",
                clientSecretMp: "",
                idAuth: -1,
                auth: {},
                authDate: -1
            };
        })


        .factory('wsFactory', function () {
            return {
                url: "http://localhost:8080/azules/webresources"
            };
        });


