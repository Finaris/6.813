
var cannedShows = [
  {
    img: './img/shows/somethingInTheRain.png',
    title: 'Something in the Rain',
    description: 'DESCRIPTION',
    rating: 8.9,
    releaseYear: 2018,
    numEpisodes: 16,
    numRated: 278,
    status: 'Airing',
    airDays: ['Friday', 'Saturday'],
    genres: ['Romance', 'Drama', 'Melodrama']
  },
  {
    img: './img/shows/dancingKnives.jpg',
    title: 'Dancing Knives',
    description: 'DESCRIPTION',
    rating: 9.3,
    releaseYear: 2018,
    numEpisodes: 23,
    numRated: 978,
    status: 'Airing',
    airDays: ['Monday', 'Tuesday'],
    genres: ['Triller', 'Drama', 'Horror']
  },
];

var showNumber = 0;
const stockShowImg = './graphics/shows/stockShowImg.jpg';
var stockImgs =
  ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg',
  '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg',
  '20.jpg', '21.jpg', '22.jpg', '23.jpg', '24.jpg', '25.jpg', '26.jpg', '27.jpg', '28.jpg',
  '29.jpg', '30.jpg', '31.jpg', '32.jpg', '33.jpg', '34.jpg', '35.jpg'];
var statuses = ['Completed', 'Airing', 'Upcoming'];
var lists = ['Completed', 'Watching', 'To Watch', 'Airing'];
var daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
var genres = ['Action', 'Horror', 'Adventure', 'Music', 'Comedy', 'Mystery', 'Crime', 'Romance', 'Sci-fi', 'Drama', 'Fantasy', 'War', 'Historical', 'Western', 'Animals', 'Melodrama', 'Detective', 'Food', 'Psychological', 'Supernatural', 'Medical', 'School', 'Thriller'];
var actors = ['Lee Min Ho', 'Lee Jong Suk', 'Park Shin Hye', 'Ji Chang Wook', 'Song Joong Ki']

function generateRandomShow() {
  return generateRandomShowOfType(generateElementsFromArray(statuses, 1, 1)[0]);
}

function generateRandomShowOfType(type) {
  showNumber += 1;
  let numEpisodes = getRandomDiscreteNumber(10, 80);
  let show = {
    status: type,
    img: './graphics/shows/' + generateElementsFromArray(stockImgs, 1, 1)[0],
    description: 'DESCRIPTION',
    title: 'Title '  + showNumber,
    rating: getRandomNumber(1, 10),
    numRated: getRandomDiscreteNumber(200, 300000),
    genres: generateElementsFromArray(genres, 1, 3),
    airDays: generateElementsFromArray(daysOfWeek, 1, 2),
    numEpisodes: numEpisodes,
    userRating: getRandomNumber(1, 10)
  };
  if (type === 'Upcoming') {
    show.releaseYear = getRandomDiscreteNumber(2018, 2020);
    show.currentEpisode = 0;
    show.userCurrentEpisode = 0;
  } else if (type === 'Airing') {
    show.releaseYear = getRandomDiscreteNumber(2017, 2018);
    show.currentEpisode = getRandomDiscreteNumber(1, numEpisodes-1);
    show.userCurrentEpisode = getRandomDiscreteNumber(0, show.currentEpisode);
  } else {
    show.status = 'Completed';
    show.releaseYear = getRandomDiscreteNumber(1960, 2017);
    show.currentEpisode = numEpisodes;
    show.userCurrentEpisode = getRandomDiscreteNumber(0, numEpisodes);
  }
  return show;
}

function generateNumRandomShow(num) {
  let shows = [];
  for (let i = 0; i < num; i++) {
    shows.push(generateRandomShow());
  }
  return shows;
}

function generateNumRandomShowOfType(num, type) {
  let shows = [];
  for (let i = 0; i < num; i++) {
    shows.push(generateRandomShowOfType(type));
  }
  return shows;
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

function getMyListsData() {
  let userLists = {
    'Completed': {
      'Amazing': generateNumRandomShowOfType(2, 'Completed'),
      'Good': generateNumRandomShowOfType(3, 'Completed'),
      'Okay': generateNumRandomShowOfType(4, 'Completed'),
      'Bad': generateNumRandomShowOfType(1, 'Completed')
    },
    'Watching': {
      'Completed Shows': generateNumRandomShowOfType(5, 'Completed'),
      'Airing Shows': []
    },
    'To Watch': {
      'Feels': generateNumRandomShow(2),
      'Romance': generateNumRandomShow(3),
      'Comedy': generateNumRandomShow(1),
      'Action': generateNumRandomShow(1),
      'Thriller': generateNumRandomShow(2),
      'Psycholgical': generateNumRandomShow(4)
    },
    'Airing': {
      'Monday': [],
      'Tuesday': [],
      'Wednesday': [],
      'Thursday': [],
      'Friday': [],
      'Saturday': [],
      'Sunday': []
    }
  };

  // Add airing shows
  let airingShows = generateNumRandomShowOfType(7, 'Airing');
  userLists['Watching']['Airing Shows'] = airingShows;
  for (let show of airingShows) {
    for (let day of show.airDays) {
      userLists['Airing'][day].push(show);
    }
  }

  // Make All sections
  for (let list in userLists) {
    userLists[list].All = getAllShowsInList(userLists[list]);
  }
  userLists['All Dramas'] = getAllShowsInAllLists(userLists);
  return userLists;
}

function getAiringShowsData(numOfShows) {
  let airingShowsByDay = {
    'Monday': [],
    'Tuesday': [],
    'Wednesday': [],
    'Thursday': [],
    'Friday': [],
    'Saturday': [],
    'Sunday': []
  };
  let airingShows = generateNumRandomShowOfType(numOfShows, 'Airing');
  for (let show of airingShows) {
    dayLoop:
    for (let day of show.airDays) {
      // Temporary fix for making sure that duplicate shows aren't on the same day
      for (let currentShow of airingShowsByDay[day]) {
        if (currentShow.img === show.img) {
          break dayLoop;
        }
      }
      airingShowsByDay[day].push(show);
    }
  }
  return airingShowsByDay;
}

function getAllShowsData(numOfShows) {
  let allShows = generateNumRandomShow(numOfShows);
  return allShows;
}

function getAllShowsInList(listDict) {
  let allShowsSet = new Set([]);
  for (let header in listDict) {
    for (let show of listDict[header]) {
      allShowsSet.add(show);
    }
  }
  return Array.from(allShowsSet);
}

function getAllShowsInAllLists(userLists) {
  let allShowsSet = new Set([]);
  for (let list in userLists) {
    for (let show of userLists[list].All) {
      allShowsSet.add(show);
    }
  }
  return Array.from(allShowsSet);
}
