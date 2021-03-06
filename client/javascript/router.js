// Routing data
Router.configure({
  layoutTemplate: 'layout'
});

var mustBeSignedIn = function(){
  if(!Meteor.loggingIn() && !Meteor.user()) {
    this.redirect('home');
  }
  this.next();
};

//Global rules
Router.onBeforeAction(mustBeSignedIn, {except: ['home']});

Router.route('/', function () {
    this.render('home', {
    });
  }, {
    name: 'home'
});

Router.route('/roles/', function () {
    this.render('roles', {
    });
  }, {
    name: 'roles'
});

Router.route('/mapa/new', function () {
    this.render('mapaNew', {
      //data: function () { return Items.findOne({_id: this.params._id}); }
    });
  }, {
    name: 'nuevoMapa'
});

Router.route('/mapa', function () {
    this.render('mapaList', {
      data: function () { Session.set('map', false); }
    });
  }, {
    name: 'listaMapas'
});

Router.route('/mapa/edit/:_id', function () {
    this.render('mapaEdit', {
      data: function () {
        Session.set('map', this.params._id);
        Session.set('action', 'edit');
        return Mapas.findOne({_id: this.params._id});
      }
    });
  }, {
    name: 'editMapa'
});

Router.route('/mapa/play/:_id', function () {
    this.render('mapaPlay', {
      data: function () {
        Session.set('map', this.params._id);
        Session.set('action', 'play');
        return Mapas.findOne({_id: this.params._id});
      }
    });
  }, {
    name: 'playMapa'
});
