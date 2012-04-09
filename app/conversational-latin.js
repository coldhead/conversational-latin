$(document).ready(function () {
    var Phrase = Backbone.Model.extend({
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

    var PhraseCollection = Backbone.Collection.extend({
	model: Phrase,
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


    var PhraseView = Backbone.View.extend({
	tagName: 'article',
	template: _.template($('#phrase-template').html()),

	render: function () {
	    $(this.el).html(this.template(this.model.toJSON()));
	    return this;
	}
    });

    var AppView = Backbone.View.extend({
	el: $('#conversational-latin'),

	events: {
	    "click #random": "randomPhrase"
	},

	initialize: function () {
	    window.phrases = new PhraseCollection;
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


    var AppRouter = Backbone.Router.extend({
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

	    var view = new PhraseView({model: phrase});

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

    var PhraseBook = new AppView();

    var app_router = new AppRouter();
    Backbone.history.start();

});
