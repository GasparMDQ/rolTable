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

Meteor.publish('mapas', function(userId){
  if (Roles.userIsInRole(userId, ['jugador', 'master'])){
    //Todos
    return Mapas.find();
  }
  this.stop();
  return;
});

