  Meteor.methods({
    addRoleToUser: function(userId, rol){
      var loggedInUser = Meteor.user();

      if (Roles.userIsInRole(loggedInUser, ['admin'])) {
        Roles.addUsersToRoles(userId, [rol.toLowerCase()]);
      } else {
        throw new Meteor.Error(403, "Not authorized to add users to rol");      
      }

    },
    
    removeRoleFromUser: function(userId, rol){
      var loggedInUser = Meteor.user();

      if (Roles.userIsInRole(loggedInUser, ['admin'])) {
        Roles.removeUsersFromRoles (userId, [rol.toLowerCase()]);
      } else {
        throw new Meteor.Error(403, "Not authorized to remove users from rol");      
      }

    },

    createMapa: function(data){
      var loggedInUser = Meteor.user();

      if (Roles.userIsInRole(loggedInUser, ['master'])) {
        var mapa = {};
        mapa.info = data;
        mapa.grilla = [];
        if(data.alto<1 || data.alto>50 || data.ancho<1 || data.ancho>50) {
          throw new Meteor.Error(403, "Wrong size");
        }
        for(var i = 0;i<data.alto;i++){
          for(var j = 0;j<data.ancho;j++){
            mapa.grilla.push({
              index: {r:i, c:j},
              //Sacar esta info de la DB, coleccion terrenos
              terreno: data.terrenoDefault,
              bloqueo: false, //db Data
              movimiento: "1", //db Data
              visibilidad: "1"
            });
          }
        }
        var newId = Mapas.insert(mapa);
        return {id: newId};
      } else {
        throw new Meteor.Error(403, "Not authorized to create maps");      
      }
      
    },

    removeMapa: function(mapId){
      var loggedInUser = Meteor.user();

      if (Roles.userIsInRole(loggedInUser, ['master'])) {
        //Celdas.remove({'mapaId':mapId});
        Mapas.remove(mapId);
      } else {
        throw new Meteor.Error(403, "Not authorized to remove maps");      
      }
    },

    updateMapa: function(data){
      var loggedInUser = Meteor.user();

      if (Roles.userIsInRole(loggedInUser, ['master'])) {
        Mapas.update(data._id, data);
      } else {
        throw new Meteor.Error(403, "Not authorized to modify maps");      
      }
    },

    createChar: function(data){
      var loggedInUser = Meteor.user();
      if(data.nombre == ''){ throw new Meteor.Error(500, "Debe ingresar un nombre");}
      if(data.clase == ''){ throw new Meteor.Error(500, "Debe ingresar una clase");}
      if(data.estilo == ''){ throw new Meteor.Error(500, "Debe ingresar un estilo");}
      if(data.tamanio == ''){ throw new Meteor.Error(500, "Debe ingresar un tamanio");}

      if (Roles.userIsInRole(loggedInUser, ['master','jugador'])) {
        data.owner = loggedInUser._id;
        data.index = {r:0, c:0};
        data.positionSet = false;

        var newId = Criaturas.insert(data);
        return {id: newId};
      } else {
        throw new Meteor.Error(403, "Not authorized to create characters");      
      }
      
    },

    setCharPosition: function(charId, row, col){
      Criaturas.update({'_id':charId},{'$set': {'index':{'r':row, 'c':col}, 'positionSet': true}});
    },

  });