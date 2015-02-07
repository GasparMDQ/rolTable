if (Meteor.isClient) {
  Template.home.helpers({
    homeType: function () {
      if ( Meteor.user() ){
        return Template['homeLogged'];
      } else {
        return Template['homeAnonymous'];
      }
    },
  });
}