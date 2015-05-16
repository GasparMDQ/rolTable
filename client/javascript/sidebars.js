if (Meteor.isClient) {
  Template.charTools.rendered = function (){
    Session.set('alert-type', 'warning');
    Session.set('alert-text', 'seleccione un PJ');
    Session.set('char-selected', false);
  };

  Template.charTools.helpers({
    criaturas: function (){
      if(Session.get('action') == 'play') {
        return Criaturas.find({'positionSet': false});
      }
      return null;
    },

    alertType: function(){
      return Session.get('alert-type');
    },

    alertText: function(){
      return Session.get('alert-text');
    },

  });

  Template.charTools.events({
    'submit .newCharForm': function (e) {
      var data = {};
      e.preventDefault();

      data.nombre = $('#nameInput').val();
      data.clase = $('#classInput').val();
      data.estilo = $('#styleInput').val();
      data.tamanio = $('#tamanioInput').val();
      data.map = Session.get('map');

      //Como el terreno se usa como clase de CSS, debe ser lowerCase
      //@todo limpiar el string para evitar simbolos raros y espacios
      
      //data.terrenoDefault = data.terrenoDefault.toLowerCase();

      //Session.set('updating-cells', true);
      $('.btn-crear-char').addClass('disabled');
      Meteor.call('createChar',data,function(error, result){
        if (error) {
          alert(error.message);
          //@todo desbloquear boton de crear
        } else {
          $('#nameInput').val('');
        }
        $('.btn-crear-char').removeClass('disabled');
      });
      //@todo bloquear boton de crear  

    },
    'click .criaturaSB': function (e) {
      var id = $(e.currentTarget).attr('data-id');
      $('.criaturaSB.selected').toggleClass('selected');
      $(e.currentTarget).toggleClass('selected');
      Session.set('char-selected', id);
      Session.set('alert-type', 'success');
      Session.set('alert-text', 'Ubique el PJ en el mapa');
    }
  });  
}