if (Meteor.isClient) {

  Template.roles.helpers({
    listaUsuarios: function () {
      return  Meteor.users.find();
    },
  });

  Template.roles.events({
    "click .user-role": function (event, template) {
      var userId = $(event.currentTarget).closest('tr').attr('data-id');
      var rol = $(event.currentTarget).attr('data-value');
      var r = confirm("Esta seguro que desea quitar el rol \""+rol+"\" al usuario?");
      if (r == true) {
        Meteor.call('removeRoleFromUser',userId,rol,function(error, result){
          if (error) {
            alert(error.message);
          }          
        });
      }
    },
    "click .add-role": function (event, template) {
      var userId = $(event.currentTarget).closest('tr').attr('data-id');
      var rol = prompt("Que rol desea asignar al usuario?");
      if (rol != null) {
        Meteor.call('addRoleToUser',userId,rol,function(error, result){
          if (error) {
            alert(error.message);
          }          
        });
      }
    }
  });  

//Stubs
  Meteor.methods({
    removeRoleFromUser: function(userId, rol){
      Roles.removeUsersFromRoles(userId, [rol]);
    },

  });
}