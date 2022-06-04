"use strict";




const configs = {
  endpointCovid: "https://api.covid19api.com/",
  global: "summary",
  country: "live/country/", // + slug country
  endpointFlags: "https://countryflagsapi.com/svg/"  // + slug country
};



const render = (htmlContent) => {

  const main = document.querySelector("main");
  main.appendChild(htmlContent);

}



const makeLi = (ul, feature, data) => {


  let li = document.createElement("li");
  let textLi = document.createTextNode(data);
  li.appendChild(textLi);

  let featureCSS = feature;

  if (feature != "casos" && feature != "mortes") {
    featureCSS = "regioes";
  }

  li.className = featureCSS;

  let span = document.createElement("span");
  let textSpan = document.createTextNode(feature);
  span.appendChild(textSpan);

  li.appendChild(span);
  ul.appendChild(li);

};


const buildCountries = (countries) => {

  countries.forEach(currentCountry => country(currentCountry));

}


const buildRegions = (regions) => {

  const Country = regions[0].Country;
  const CountryCode = regions[0].CountryCode;


  const article = document.createElement("article");
  article.className = "region";
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  var srcFlag = configs.endpointFlags + CountryCode;

  img.setAttribute("src", srcFlag);
  img.setAttribute("loading", "lazy");
  figure.appendChild(img);
  article.appendChild(figure);

  const h1 = document.createElement("h1");
  const span = document.createElement("span");
  const textSpan = document.createTextNode(Country);

  span.appendChild(textSpan);
  h1.appendChild(span);
  article.appendChild(h1);


  regions.forEach(currentRegion => region(article, currentRegion));

  render(article);

}






const country = (currentCountry) => {

  const {
    Country,
    TotalConfirmed,
    TotalDeaths,
    Slug,
    CountryCode } = currentCountry;

  const article = document.createElement("article");

  article.setAttribute("id", CountryCode);
  article.setAttribute("data-slug", Slug);

  const figure = document.createElement("figure");
  const img = document.createElement("img");




  var srcFlag = configs.endpointFlags + CountryCode;


  img.setAttribute("src", srcFlag);
  img.setAttribute("loading", "lazy");
  figure.appendChild(img);
  article.appendChild(figure);

  const h1 = document.createElement("h1");
  const span = document.createElement("span");
  const textSpan = document.createTextNode(Country);

  span.appendChild(textSpan);
  h1.appendChild(span);
  article.appendChild(h1);

  const ul = document.createElement("ul");


  const features = [
    "casos",
    "mortes"
  ];


  const datas = [
    TotalConfirmed,
    TotalDeaths
  ];



  for (let item = 0; item < features.length; item++) {
    makeLi(ul, features[item], datas[item]);
  }






  article.appendChild(ul);


  const seeMore = document.createElement("a");
  seeMore.setAttribute("href", "?" + Slug);

  const seeMoreText = document.createTextNode("ver dados de estados/regiões");
  seeMore.appendChild(seeMoreText);

  article.appendChild(seeMore);

  render(article);

}


const region = (article, currentRegion) => {

  const {
    Province,
    Confirmed,
    Deaths } = currentRegion;

  const ul = document.createElement("ul");
  ul.className = "region";

  const features = [
    "região/estado",
    "casos",
    "mortes"
  ];

  const datas = [
    Province === "" ? "nome indisponível" : Province,
    Confirmed,
    Deaths
  ];

  for (let item = 0; item < features.length; item++) {
    makeLi(ul, features[item], datas[item]);
  }

  article.appendChild(ul);

}




const requestAPI = (target, url) => {

  const xhr = new XMLHttpRequest();
  xhr.responseType = "json";
  xhr.open("GET", url);

  xhr.onload = () => {


    if (xhr.status === 200) {

      const response = xhr.response;


      if (target == "all") {
        return buildCountries(response.Countries);
      }
      else {
        return buildRegions(response);
      }


    }


    console.log(xhr.status);
    alert('Ops. Algo inesperado aconteceu, dados indisponíveis, tente mais tarde por favor');

  }

  xhr.send();

}





const oneCountry = (slugCountry) => {


  const {
    Country,
    TotalConfirmed,
    TotalDeaths,
    Slug,
    CountryCode } = currentCountry;

  const article = document.createElement("article");

  article.setAttribute("id", CountryCode);
  article.setAttribute("data-slug", Slug);

  const figure = document.createElement("figure");
  const img = document.createElement("img");




  var srcFlag = configs.endpointFlags + CountryCode;


  img.setAttribute("src", srcFlag);
  img.setAttribute("loading", "lazy");
  figure.appendChild(img);
  article.appendChild(figure);

  const h1 = document.createElement("h1");
  const span = document.createElement("span");
  const textSpan = document.createTextNode(Country);

  span.appendChild(textSpan);
  h1.appendChild(span);
  article.appendChild(h1);

  const ul = document.createElement("ul");


  const features = [
    "casos",
    "mortes"
  ];


  const datas = [
    TotalConfirmed,
    TotalDeaths
  ];



  for (let item = 0; item < features.length; item++) {
    makeLi(ul, features[item], datas[item]);
  }






  article.appendChild(ul);


  const seeMore = document.createElement("a");
  seeMore.setAttribute("href", "?" + Slug);

  const seeMoreText = document.createTextNode("ver dados por estado/regiões");
  seeMore.appendChild(seeMoreText);

  article.appendChild(seeMore);


  render(article);

}



const buttonBackBegin = () => {

  const button = document.createElement("button");
  button.setAttribute("id", "back");
  const textButton = document.createTextNode("Voltar para países");
  button.appendChild(textButton);


  const currentLocation = String(window.location);

  console.log(currentLocation.replace(/\?.*/, ""));

  const urlBase = currentLocation.replace(/\?.*/, "");

  button.onclick = () => { location = urlBase; };

  render(button);

};






const main = () => {


  const url = String(window.location);
  let urlAPI;

  if (/\?/.test(url)) {


    const [, slug] = url.split('?');

    urlAPI = configs.endpointCovid + configs.country + slug;
    requestAPI("region", urlAPI);
    buttonBackBegin();
    return;

  }

  urlAPI = configs.endpointCovid + configs.global;

  requestAPI("all", urlAPI);


};




window.addEventListener("load", () => { main(); });
