  var phraseApp = phraseApp || {};

$(document).ready(function () {
  phraseApp.Phrase = Backbone.Model.extend({
    defaults: function () {
      return {
        id: null,
        phrase: '',
        translation: '',
        url: '',
        notes: ''
      };
    },

    validate: function (attrs) {
      var valid;

      // Phrases without translations are next to worthless.
      valid = attrs.translation || console.log('Missing translation', attrs) && false;

      if (! valid) return 'invalid';
    }
  });

  phraseApp.PhraseCollection = Backbone.Collection.extend({
    model: phraseApp.Phrase,
    localStorage: new Store("latin-phrases"),

    initialize: function () {
      this.fetch();
      if (this.length === 0) {
        this.populate();
      }
    },

    populate: function () {
      var phrases = this;
      console.log('Fetching phrases from Wikipedia...');

      $.ajax({
        url: 'http://en.wikipedia.org/w/api.php',
        data: {
            action: 'parse',
            page: 'List_of_Latin_phrases_(full)',
            format: 'json',
            prop: 'text'
        },
        dataType: 'jsonp',
        success: function(wikipedia) {
          var $page = $('<div>').html(wikipedia.parse.text['*']);

          $page.find('.wikitable tr').each(function(i) {
            var $cells = $(this).find('td');
            if (!$cells.length) return;

            // Surely there is a cleaner way to pick these apart.
            var entry = {
                id: i,
                phrase: $($cells[0]).text(),
                translation: $($cells[1]).text(),
                url: $($cells[0]).find('a').attr('href'),
                notes: $($cells[2]).text()
            };

            phrases.create(entry) || console.log('Validation failure', $cells);
          });

          console.log("Phrasebook has", phrases.length, "entries");
          window.location.reload();
        }
      });
    },

    randomID: function () {
        return _.shuffle(this.pluck('id'))[0];
    }
  });
});