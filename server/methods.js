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
      var mapa = {};
      mapa.info = data;
      mapa.grid = {rows : []};
      for(var i = 0;i<data.alto;i++){
        mapa.grid.rows[i] = {columns : []};
        for(var j = 0;j<data.ancho;j++){
          mapa.grid.rows[i].columns[j] = {
            index: {r:i, c:j},
            //Sacar esta info de la DB, coleccion terrenos
            terreno: data.terrenoDefault,
            bloqueo: false, //db Data
            movimiento: 1, //db Data
            visibilidad: 1,
            criaturas: [],
            artefactos: []
          };
        }
      }
      var loggedInUser = Meteor.user();

      if (Roles.userIsInRole(loggedInUser, ['master'])) {
        var newId = Mapas.insert(mapa);
        return {id: newId};
      } else {
        throw new Meteor.Error(403, "Not authorized to create maps");      
      }
      
    },

    removeMapa: function(mapId){
      var loggedInUser = Meteor.user();

      if (Roles.userIsInRole(loggedInUser, ['master'])) {
        Mapas.remove(mapId);
      } else {
        throw new Meteor.Error(403, "Not authorized to remove maps");      
      }
    },


  });