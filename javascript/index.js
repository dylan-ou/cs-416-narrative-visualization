let contestants = 'data/cleaned_contestant_table.csv'
let toggle, list_of_contestants, triggers
let currentPage
let numPages

async function init() {
  currentPage = 0
  numPages = 6
  toggle = false
  list_of_contestants = await d3.csv(contestants)
  triggers = {
    season: 0,
    homestate: null,
    age: null,
    gender: null,
    race: null,
    orientation: null,
    winner: false
  }
  
  clearDisplay()
  showButtons()
  pageSelection(0)
}

function clearDisplay() {
  d3.select('.middle').html('')
}

function showButtons() {
  if (currentPage > 0) {
    d3.select('.prev-button').style('visibility', 'visible')
  } else {
    d3.select('.prev-button').style('visibility', 'hidden')
  }

  if (currentPage < numPages) {
    d3.select('.next-button').style('visibility', 'visible') 
  } else {
    d3.select('.next-button').style('visibility', 'hidden')
  }
}

function pageSelection(page) {
  clearDisplay()
  switch(page) {
    case 0:
      displayIntroPage()
      break;
    case 1:
      displayHomestateChartPage()
      break;
    case 2:
      displayAgeChartPage()
      break;
    case 3:
      displayGenderPage()
      break;
    case 4:
      displayRaceChartPage()
      break;
    case 5:
      displayOrientationChartPage()
      break;
    case 6:
      displayExplorationPage()
      break;
  }
}

function prevPage() {
  currentPage = (currentPage - 1) > 0 ? (currentPage - 1) : 0

  showButtons()
  pageSelection(currentPage)
}

function nextPage() {
  currentPage = (currentPage + 1) <= numPages ? (currentPage + 1) : currentPage
  
  showButtons()
  pageSelection(currentPage)
}