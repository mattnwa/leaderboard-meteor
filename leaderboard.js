PlayersList = new Meteor.Collection('players');

//Create Client side js viewable by browser.
if(Meteor.isClient) {

  Meteor.subscribe('thePlayers');

Template.leaderboard.helpers({
  'player': function(){
    var currentUserId = Meteor.userId();
    //Create player and sort by points, then by name
return PlayersList.find({}, {sort: {score: -1, name: 1}});
  },
  'selectedClass': function() {
    //return 'selected when clicked'
    var playerId = this._id;
    var selectedPlayer = Session.get('selectedPlayer');
    if(selectedPlayer === playerId) {
      return 'selected'
  }
},
  'showSelectedPlayer': function() {
    //function to show current selected player under the add points button
    var selectedPlayer = Session.get('selectedPlayer');
    return PlayersList.findOne(selectedPlayer);
  }
});
/* - I just learned teplate has been deprecated. use the helper keyword  to create helper functions seperated by comma.
  Template.leaderboard.player = function() {
    var currentUserId = Meteor.userId();
    //Create player and sort by points, then by name
return PlayersList.find({}, {sort: {score: -1, name: 1}});
  }
Template.leaderboard.selectedClass = function(){
  //return 'selected when clicked'
  var playerId = this._id;
  var selectedPlayer = Session.get('selectedPlayer');
  if(selectedPlayer === playerId) {
    return 'selected'
  }
}
  Template.leaderboard.showSelectedPlayer = function() {
    //function to show current selected player under the add points button
    var selectedPlayer = Session.get('selectedPlayer');
    return PlayersList.findOne(selectedPlayer);
  } */

  Template.leaderboard.events({
    'click li.player': function(){
      var playerId = this._id;
      Session.set('selectedPlayer', playerId);
      var selectedPlayer = Session.get('selectedPlayer');
      //console.log(selectedPlayer);
    },
    'click #increment': function(){
    var selectedPlayer = Session.get('selectedPlayer');
    Meteor.call('modifyPlayerScore', selectedPlayer, 5);
  },
  'click #decrement': function(){
  var selectedPlayer = Session.get('selectedPlayer');
    Meteor.call('modifyPlayerScore', selectedPlayer, -5);
},
  'click #remove': function() {
  var selectedPlayer =  Session.get('selectedPlayer');
    Meteor.call('removePlayer', selectedPlayer)
  }
  });
//Create add button details. 1. preventDefault 2. using submit form for .on function instead
//of click so client can use alternative submit options.
Template.addPlayerForm.events({
  'submit form': function(event, template) {
    event.preventDefault();

    var playerNameVar = template.find('#playerName').value;
 if (playerNameVar.length !== 0) {
    Meteor.call('insertPlayerData', playerNameVar);
  }
}
});
}
if(Meteor.isServer) {
Meteor.publish('thePlayers', function() {
var currentUserId = this.userId;
  return PlayersList.find({ createdBy: currentUserId});
});

Meteor.methods({
  'insertPlayerData': function(playerNameVar) {
    var currentUserId = Meteor.userId();
    PlayersList.insert({
      name: playerNameVar,
      score: 0,
      createdBy: currentUserId
    });
    // console.log(playerNameVar);
  },
  'removePlayer': function(selectedPlayer) {
    PlayersList.remove(selectedPlayer);
  },
  'modifyPlayerScore': function(selectedPlayer, scoreValue) {
    PlayersList.update({_id: selectedPlayer}, {$inc: {score: scoreValue}});
  }
});
}
