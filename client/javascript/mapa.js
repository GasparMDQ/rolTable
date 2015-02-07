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

      Meteor.call('createMapa',data,function(error, result){
        if (error) {
          alert(error.message);
        } else {
          //Redirect to id
          Router.go('editMapa', {_id: result.id});
        }
      });

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

  Template.mapaEdit.helpers({
    altura: function (){
      if(this.grid){
        var pos = "height:"+this.info.alto *50+"px;";
        return pos;
      }
    },
    position: function (){
      var pos = "top:"+this.index.r *50+"px; left:"+this.index.c *50+"px;";
      return pos;
    },
  });

  Template.mapaEdit.events({
    'click .celda': function(event){
      var mapId = $(event.currentTarget).closest('div#canvas').attr('data-id');
      var mapa = Mapas.findOne({_id:mapId});
      for(var i =0;i<mapa.grid.cells.length;i++){
        var celda = mapa.grid.cells[i];
        if(celda.index.r == this.index.r && celda.index.c == this.index.c) {
          celda.terreno = $('#cellTerrain').val();
          celda.bloqueo = $('#cellBlock').is(':checked');
          celda.movimiento = $('#cellMovimiento').val();
          break;
        }
      }
      //Update Mapa
      Meteor.call('updateMapa', mapa, function(error, result){
        if (error) {
          alert(error.message);
        }          
      });
    }
  });

  Meteor.methods({
    createMapa: function(data){
      var mapa = {};
      mapa.info = data;
      mapa.grid = {cells : []};
      for(var i = 0;i<data.alto;i++){
        for(var j = 0;j<data.ancho;j++){
          mapa.grid.cells.push({
            index: {r:i, c:j},
            //Sacar esta info de la DB, coleccion terrenos
            terreno: data.terrenoDefault,
            bloqueo: false, //db Data
            movimiento: "1", //db Data
            visibilidad: "1",
            criaturas: [],
            artefactos: []
          });
        }
      }
      console.log(mapa);
    },
    removeMapa: function(mapId){
      Mapas.remove(mapId);
    },
    updateMapa: function(data){
      Mapas.update(data._id, data);
    }


  });

}