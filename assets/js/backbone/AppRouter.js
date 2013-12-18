var phraseApp = phraseApp || {};
$(document).ready(function () {

    phraseApp.AppRouter = Backbone.Router.extend({
      routes: {
          "phrase/:id": "showPhrase",
          "random": "randomPhrase",
          "nuke": "reset",
          "*actions": "defaultRoute"
      },

      showPhrase: function (id) {
          if (phrases.length === 0) return; // Collection is still populating.

          var phrase = phrases.get(id);

          if (! phrase) {
            return; // Phrase not found!
          }

          var view = new phraseApp.PhraseView({model: phrase});

          var $dest = $('#conversational-latin');
          $dest.empty();
          $dest.prepend(view.render().el);
      },

      randomPhrase: function () {
          PhraseBook.randomPhrase();
      },

      reset: function () {
          console.log('Nuking ', phrases.length, 'phrases');
          phrases.reset();
          localStorage.clear();
          console.log(phrases.length, 'phrases remain');
      },

      defaultRoute: function () {
          // Unless we're given something else to do, we forward to a random entry.
          Backbone.history.navigate('random', {trigger: true});
      }
    });

    var app_router = new phraseApp.AppRouter();
    Backbone.history.start();
  });