var phraseApp = phraseApp || {};

$(document).ready(function () {
  phraseApp.PhraseView = Backbone.View.extend({
    tagName: 'article',
    template: _.template($('#phrase-template').html()),

    render: function () {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    }
  });
});

