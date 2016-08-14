var phraseApp = phraseApp || {};
$(document).ready(function () {

  phraseApp.AppView = Backbone.View.extend({
    el: $('#conversational-latin'),

    events: {
      "click #random": "randomPhrase"
    },

    initialize: function () {
        window.phrases = new phraseApp.PhraseCollection;
        console.log(phrases.length, 'phrases available');
    },

    randomPhrase: function () {
        var id = phrases.randomID();

        // If we don't get an ID, the collection is probably still populating.
        id && Backbone.history.navigate('phrase/' + id, true);
        return false;
    },

    render: function () {
        console.log('app render');
    }
  });
  var PhraseBook = new phraseApp.AppView();
});