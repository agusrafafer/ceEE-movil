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
                mensajes: [],
                mensajesNoLeidos: [],
                mensajeSel: "",
                authToken: "",
                authExpDate: -1,
                tokenPushNotif: "",
                personaSel: null,
                notasPersonaSel: [],
                asistenciasPersonaSel: [],
                sancionesPersonaSel: []
            };
        })


        .factory('wsFactory', function () {
            return {
                url: "http://www.gruposistemas.com.ar:8080/azules/webresources"
//                url: "http://108.160.155.140:8080/azules/webresources"
            };
        })
        
        .factory('urlFotoFactory', function () {
            return {
//                url: "http://108.160.155.140:8080/azules/faces/resources/images/fotos/"
                url: "http://www.gruposistemas.com.ar:8080/azules/faces/resources/images/fotos/"
            };
        });

