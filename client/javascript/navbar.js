if (Meteor.isClient) {

  Template.navbarLogged.helpers({
    pic: function () {
      if (Meteor.user() && Meteor.user().services ){
        return Meteor.user().services.google.picture;
      }
    },
  });



  Template.navbarLogged.events({
    'click .dropdown-toggle': function (e) {
      e.preventDefault();
      $(e.target).closest('.dropdown').toggleClass('open');
    },

    'click #exitLnk' : function () {
      Meteor.logout();
    }
  });

}