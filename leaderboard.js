PlayersList = new Meteor.Collection('players');


if(Meteor.isClient) {
  Template.leaderboard.player = function() {
return PlayersList.find();
  }
Template.leaderboard.selectedClass = function(){
  //return 'selected'
  var playerId = this._id;
  var selectedPlayer = Session.get('selectedPlayer');
  if(selectedPlayer === playerId) {
    return 'selected'
  }
}
  Template.leaderboard.events({
    'click li.player': function(){
      var playerId = this._id;
      Session.set('selectedPlayer', playerId);
      var selectedPlayer = Session.get('selectedPlayer');
      console.log(selectedPlayer);
    },
    'click #increment': function(){
    var selectedPlayer = Session.get('selectedPlayer');

    }
  });

}
if(Meteor.isServer) {
}
