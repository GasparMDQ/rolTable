Meteor.publish('userData', function(){
  return Meteor.users.find({_id:this.userId});
});

Meteor.publish('allUsersData', function(userId){
  if (Roles.userIsInRole(userId, ['admin'])){
    //Con perfil completo
    return Meteor.users.find({},{
      fields: {
        '_id': 1,
        'profile': 1,
        'roles': 1,
        'services.google.email': 1
      }
    });
  } else {
    return Meteor.users.find({},{
      fields: {
        '_id': 1,
        'profile.nombre': 1,
        'profile.name': 1
      }
    });
  }

});

Meteor.publish('mapas', function(userId, mapId){
  if (Roles.userIsInRole(userId, ['jugador', 'master'])){
    if(mapId){
      return Mapas.find({'_id': mapId});
    } else {
      return Mapas.find({},{
            fields: {
              '_id': 1,
              'info': 1
            },
            sort: {
              'info.descripcion':1
            }
          });
    }
  }
  this.stop();
  return;
});

Meteor.publish('celdas', function(mapId, userId){
  if (Roles.userIsInRole(userId, ['jugador', 'master'])){
    return Celdas.find({'mapaId': mapId});
  }
  this.stop();
  return;
});

