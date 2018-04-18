
var cannedShows = [
  {
    img: './img/shows/somethingInTheRain.png',
    title: 'Something in the Rain',
    description: 'DESCRIPTION',
    rating: 8.9,
    release: 2018,
    episodes: 16,
    usersSeen: 278,
    status: 'Airing',
    airDays: ['Friday', 'Saturday'],
    genres: ['Romance', 'Drama', 'Melodrama'],
    tags: ['Older Woman/Younger Man'],
    actors: ['Son Ye Jin', 'Jung Hae In'],
    streamingServices: ['Netflix']
  },
  {
    img: './img/shows/dancingKnives.jpg',
    title: 'Dancing Knives',
    description: 'DESCRIPTION',
    rating: 9.3,
    release: 2018,
    episodes: 23,
    usersSeen: 978,
    status: 'Airing',
    airDays: ['Monday', 'Tuesday'],
    genres: ['Triller', 'Drama', 'Horror'],
    tags: ['Fast'],
    actors: ['Kim So Hyun', 'Kim Soo Hyun'],
    streamingServices: ['DramaFever', 'Hulu']
  },
];

var showNumber = 0;
const stockShowImg = './img/shows/stockShowImg.jpg'
var statuses = ['Completed', 'Airing', 'Upcoming'];
var daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday', 'Sunday'];
var genres = ['Action', 'Horror', 'Adventure', 'Music', 'Comedy', 'Mystery', 'Crime', 'Romance', 'Sci-fi', 'Drama', 'Fantasy', 'War', 'Historical', 'Western', 'Animals', 'Melodrama', 'Detective', 'Food', 'Psychological', 'Supernatural', 'Medical', 'School', 'Thriller'];
var tags = ['Death', 'Feels', 'Disabilities', 'OTP', 'Fast', 'Slow', 'Older Woman/Younger Man'];
var actors = ['Lee Min Ho', 'Lee Jong Suk', 'Park Shin Hye', 'Ji Change Wook', 'Song Joong Ki', 'Mike D\'Angelo', 'Kim So Hyun', 'Kim Soo Hyun', 'Zhao Zanilia', 'Lee Joon Gi', 'Kim Woo Bin', 'L', 'Kim Hyun Joong', 'Jang Geun Suk', 'So Ji Sub', 'Park Bo Gum', 'Nam Joo Hyuk', 'Park Hae Jin', 'Suzy', 'Jung II Woo', 'Park Min Young', 'Seo In Guk', 'Park Seo Joon', 'Son Ye Jin', 'Jung Hae In'];
var streamingServices = ['Netflix', 'Hulu', 'DramaFever', 'Viki', 'Kocowa'];

function generateRandomShow() {
  let show = generateRandomAiringShow();
  let status1 = generateElementsFromArray(statuses, 1, 1)[0];
  let status2 = generateElementsFromArray(statuses, 1, 1)[0];
  if (status1 !== 'Completed' && status2 !== 'Completed') {
    if (status1 === 'Upcoming') {
      show.status = status1;
      show.release = getRandomDiscreteNumber(2018, 2020);
    }
  } else {
    show.airDays = [];
    show.status = 'Completed';
    show.release = getRandomDiscreteNumber(1960, 2017);
  }
  return show;
}

function generateRandomAiringShow() {
  showNumber += 1;
  let showGenres = generateElementsFromArray(genres, 1, 3);
  return {
    img: stockShowImg,
    title: 'Title '  + showNumber,
    description: 'DESCRIPTION',
    rating: getRandomNumber(1, 10),
    release: getRandomDiscreteNumber(2017, 2018),
    episodes: getRandomDiscreteNumber(10, 80),
    usersSeen: getRandomDiscreteNumber(200, 300000),
    status: 'Airing',
    airDays: generateElementsFromArray(daysOfWeek, 1, 2),
    genres: showGenres,
    tags: showGenres.concat(generateElementsFromArray(tags, 1, 3)),
    actors: generateElementsFromArray(actors, 1, 5),
    streamingServices: generateElementsFromArray(streamingServices, 1, 2)
  };
}

function generateElementsFromArray(array, minElements, maxElements) {
  let numElements = getRandomDiscreteNumber(minElements, maxElements);
  array.sort( function() { return 0.5 - Math.random() } );
  return array.slice(-1 * numElements);
}

function getRandomNumber(start, end) {
  return (Math.random() * (end - start) + start).toFixed(1);
}

function getRandomDiscreteNumber(start, end) {
  return Math.floor(getRandomNumber(start, end + 1));
}
