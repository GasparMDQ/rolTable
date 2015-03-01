if (Meteor.isClient) {
  Template.mapaNew.rendered = function (){
    Session.set('nuevoMapaInfo',{ancho:1, alto:1, tipo: 'pasto'});
  };

  Template.mapaNew.helpers({
    piesAncho: function () {
      var info = Session.get('nuevoMapaInfo');
      if (typeof info != 'undefined'){
        return info.ancho *5 + " pies";
      }
    },
    piesAlto: function () {
      var info = Session.get('nuevoMapaInfo');
      if (typeof info != 'undefined'){
        return info.alto *5 + " pies";
      }
    },
  });

  Template.mapaNew.events({
    'change #anchoMapa, keyup #anchoMapa': function (e) {
      var info = Session.get('nuevoMapaInfo');
      info.ancho = $(e.target).val();
      Session.set('nuevoMapaInfo', info);
    },
    'change #altoMapa, keyup #altoMapa': function (e) {
      var info = Session.get('nuevoMapaInfo');
      info.alto = $(e.target).val();
      Session.set('nuevoMapaInfo', info);
    },
    'submit .newMapForm': function (e) {
      var data = {};
      e.preventDefault();

      data.ancho = $('#anchoMapa').val();
      data.alto = $('#altoMapa').val();
      data.descripcion = $('#descripcionMapa').val();
      data.terrenoDefault = $('#terrenoMapa').val();
      if(data.terrenoDefault == '') { data.terrenoDefault = 'default'; }
      
      //Como el terreno se usa como clase de CSS, debe ser lowerCase
      //@todo limpiar el string para evitar simbolos raros y espacios
      data.terrenoDefault = data.terrenoDefault.toLowerCase();

      Session.set('updating-cells', true);
      Meteor.call('createMapa',data,function(error, result){
        if (error) {
          alert(error.message);
          //@todo desbloquear boton de crear
        } else {
          //Redirect to id
          Session.set('updating-cells', false);
          Router.go('editMapa', {_id: result.id});
        }
      });
      //@todo bloquear boton de crear  

    },
  });

  Template.mapaList.helpers({
    listaMapas: function () {
      return  Mapas.find();
    },
  });

  Template.mapaList.events({
    'click .del-mapa': function (event) {
      var mapId = $(event.currentTarget).closest('tr').attr('data-id');
      var r = confirm("Esta seguro que desea borrar el mapa?\nESTA ACCION NO SE PUEDE DESHACER");
      if (r == true) {
        Meteor.call('removeMapa', mapId, function(error, result){
          if (error) {
            alert(error.message);
          }          
        });
      }
    },

    'click .edit-mapa': function (event) {
      var mapId = $(event.currentTarget).closest('tr').attr('data-id');
      Router.go('editMapa', {_id: mapId});
    }

  });


  Template.mapaLayout.helpers({
    altura: function (){
      if(this.info){
        var altura = "height:"+this.info.alto *50+"px;";
        return altura;
      }
    },
    position: function (){
      var pos = "top:"+this.index.r *50+"px; left:"+this.index.c *50+"px;";
      return pos;
    },
    backgroundSize: function (){
      var size = "height:"+this.info.alto *50+"px; width:"+this.info.ancho *50+"px;";
      return size;
    },
    desc: function (){
      var description = this.info.descripcion.replace(/\s+/g, '-').toLowerCase();;
      return description;
    },
  });

  Template.mapaLayout.events({
    'click .tresd-toggle': function(event){
      $('#canvas').toggleClass('tresD');
    },
    
    'click .sidebar-toggle': function(event){
      $('#wrapper').toggleClass('toggled');
    },
    
    'click .celda': function(event){
      var mapId = $(event.currentTarget).closest('div#canvas').attr('data-id');
      var mapa = Mapas.findOne({_id:mapId});

      var cellRow = $(event.currentTarget).attr('data-row');
      var cellCol = $(event.currentTarget).attr('data-column');

      switch(Session.get('action')){
        case 'edit':
          for(var i=0;i<mapa.grilla.length;i++){
            if(mapa.grilla[i].index.r == cellRow && mapa.grilla[i].index.c == cellCol){
                mapa.grilla[i].terreno = $('#cellTerrain').val().toLowerCase();
                mapa.grilla[i].bloqueo = $('#cellBlock').is(':checked');
                mapa.grilla[i].movimiento = $('#cellMovimiento').val();
              break;
            }
          }
          //Update Celda
          Meteor.call('updateMapa', mapa, function(error, result){
            if (error) {
              alert(error.message);
            }          
          });
          break;
        case 'play':
          break;
        default:
          break;
      }


    }
  });

  Meteor.methods({
    removeMapa: function(mapId){
      Mapas.remove(mapId);
    },
    updateMapa: function(data){
      Mapas.update(data._id, data);
    },

  });

}