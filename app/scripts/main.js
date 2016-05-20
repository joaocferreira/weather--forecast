const Form__city = document.getElementById('form__city');
const Results = document.getElementById('results');
const City = document.getElementById('input__city');
const Submit = document.getElementById('form__city--btn');

const Query = "select * from weather.forecast where woeid in (select woeid from geo.places(1) where text=\"%s\")";
const Url = "https://query.yahooapis.com/v1/public/yql?format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&q=";

const Xhttp = new XMLHttpRequest();
const internals = {};

const TitleIn = document.title;
const TitleOut = ":( I miss you";

document.addEventListener('visibilitychange', function () {

  if (document.hidden) {
    document.title = TitleOut;
  } else {
    document.title = TitleIn;
  }

});

Form__city.addEventListener("submit", event => {

  event.preventDefault();

  Submit.classList.remove('form__city--btn--active');

  internals.makeQuery(City.value);
  document.title = 'Wheather in ' + City.value;
  City.value = '';
  Results.innerHTML = '<div class="progress"><div class="indeterminate"></div></div>';

});

City.addEventListener("input", event => {

  if (City.value){
    if (!Submit.classList.contains('form__city--btn--active')) {
      Submit.classList.add('form__city--btn--active');
    }
  } else {
      Submit.classList.remove('form__city--btn--active');
  }

});

internals.makeQuery = (city) => {
  let endpoint = Url + escape(Query.replace("%s", city));

  Xhttp.open('GET', endpoint, true);
  Xhttp.send();
  Xhttp.onreadystatechange = internals.renderResults;

};

internals.renderResults = (event) => {

  if (Xhttp.readyState == 4 && Xhttp.status == 200) {

    let response = JSON.parse(Xhttp.responseText);

    if (response.query.count) {

      let resultsTemplate = internals.createResultsTemplate(response.query.results.channel);

      Results.innerHTML  = '<ul class="collection with-header col s12 m8 offset-m2">' +
        resultsTemplate + '</ul>';

    } else {
      Results.innerHTML = '<img class="responsive-img img__no-results" ' +
      'src="http://adoptapet.news4jax.com/images/noresults.png">';
    }

  } else {
      Results.innerHTML = '<div class="col s12 m8 offset-m2">' +
          '<div class="card">' +
          '<div class="card-image">' +
          '<img src="http://vignette2.wikia.nocookie.net/lostpedia/images/1/16/Lost-season1.jpg/revision/latest?cb=20070303221754">' +
          '<span class="card-title">' + Xhttp.status +' Error</span>' +
          '</div>' +
          '</div>' +
          '</div>';
    }
};

internals.createResultsTemplate = (results) => {

  let templateHead = internals.createResultsTemplateHead(results.location);
  let templateBody = internals.createResultsTemplateBody(results.item.forecast.splice(0,5));
  let template = templateHead + templateBody;

  return template;
};

internals.createResultsTemplateHead = location => {

  let template = '<li class="collection-header"><h4>' +
    location.city + ', ' +
    location.country + '</h4></li>';

  return template;
};

internals.createResultsTemplateBody = forecast => {
  let template = '';

  for(let i = 0, size = forecast.length; i < size; i++) {
    template += '<li class="collection-item">' +
    forecast[i].date + ' - ' + forecast[i].text + '</li>';
  }

  return template;
};
