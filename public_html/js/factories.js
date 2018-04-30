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
                mensajes: "",
                mensajeSel: "",
                authToken: "",
                authExpDate: -1,
                cont: 0
            };
        })


        .factory('wsFactory', function () {
            return {
                url: "http://localhost:8080/azules/webresources"
            };
        })
        
        .factory('urlFoto', function () {
            return {
                url: "http://108.160.155.140:8080/azules/faces/resources/images/fotos/"
            };
        });


