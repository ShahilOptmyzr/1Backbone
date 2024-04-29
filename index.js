var model = Backbone.Model.extend({
  urlRoot: 'https://api.openweathermap.org/data/2.5/weather'
});

var modelObj = new model();

var DataView = Backbone.View.extend({
  events: {
    'click button': 'handleDelete'
  },
  initialize: function () {
    this.collection.on('remove', this.render, this); // Bind the 'remove' event directly to the view
  },
  handleDelete: function () {
    this.model.destroy(); // Remove the model from the collection
    this.remove(); // Remove the view from the DOM
  },
  render: function () {
    var city = this.model.get('name');
    var temp = kelvinToCelsius(this.model.get('main').temp).toFixed(1);;
    var icon = this.model.get('weather')[0].icon;
    this.$el.html(`<div class="citydata">
      <p class="icondiv">${city}<span><img src="https://openweathermap.org/img/wn/${icon}@2x.png"></span></p>
          <p>${temp}</p>
          <button>Delete</button>
          </div>`);
    return this;
  }
});

var Container = Backbone.Collection.extend({
  model: model // Specify the model for the collection
});
var c = new Container();

var Alldataview = Backbone.View.extend({
  render: function () {
    this.$el.empty(); // Clear the existing content in #data div
    this.collection.each(function (model) {
      var dataObj = new DataView({
        model: model,
        collection: this.collection // Pass the collection to the DataView
      });
      this.$el.append(dataObj.render().el); // Append each model's data to #data div
    }, this); // Pass 'this' as the context to access the view instance inside the each loop
  }
});

var d = new Alldataview({
  el: '#data',
  collection: c
});

function kelvinToCelsius(kelvin) {
  return kelvin - 273.15;;
}

// Form View 
var FormView = Backbone.View.extend({
  events: {
    'click #add': 'handleAdd',
  },
  render: function () {
    console.log("Form View");
  },
  handleAdd: function (e) {
    e.preventDefault();
    var city = this.$('#city').val();
    this.$('#city').val('');

    this.$('#data').html('Loading...');

    var modelInstance = new model();

    modelInstance.fetch({
      data: {
        q: city,
        APPID: '41ef2b9511e085d236913b5776da559a'
      },
      success: (model, res) => {
        c.add(modelInstance); // Add the fetched model to the collection
        d.render(); // Render the Alldataview to display all models' data
        console.log(res);
      },
      error: (model, res) => {
        $('#error').css('display', 'block');
        $('#error').html("Sorry can't find the city! <span class='close' onclick=\"this.parentNode.style.display = 'none';\">&times;</span>");
      }
    });

  }
});

var formv = new FormView({
  el: '#weatherform',
});