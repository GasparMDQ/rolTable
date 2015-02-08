Meteor.startup(function(){
});

Meteor.subscribe('userData');

Deps.autorun(function(){
  Meteor.subscribe('allUsersData', Meteor.user());
});

Deps.autorun(function(){
  //Al pasar el usuario y no el ID, se resuscribe cada vez que se modifica el mismo
  //Posible problema de performance!!
  Meteor.subscribe('mapas', Meteor.user(), Session.get('map'));
});

/*
Deps.autorun(function(){
  Meteor.subscribe('celdas', Session.get('map'), Meteor.user());
});
*/
