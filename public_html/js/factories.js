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
//                url: "http://66.97.37.195:8080/cepmariareina/webresources"
//                url: "http://www.escolarweb.com.ar:8080/cepmariareina/webresources"
                url: "http://www.gruposistemas.com.ar:8080/cepmariareina/webresources"
            };
        })
        
        .factory('urlFotoFactory', function () {
            return {
//                url: "http://www.escolarweb.com.ar:8080/cepmariareina/faces/resources/images/fotos/"
                url:"http://www.gruposistemas.com.ar:8080/cepmariareina/faces/resources/images/fotos/"
            };
        });

