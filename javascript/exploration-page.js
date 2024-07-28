function contestantCard(c) {
  return `<p><b>${c.first_name} ${c.last_name}</b><br>${c.season_title}<hr><b>Age</b>: ${c.age}<br><b>Birthday</b>: ${c.birthdate}<br><b>Profession: </b>: ${c.profession}<br><b>Hometown</b>: ${c.hometown + ', ' + c.homestate}<br><b>Gender</b>: ${c.gender}<br><b>Race</b>: ${c.race}<br><b>Orientation</b>: ${c.orientation}<br><b>Finish: </b>${c.finish == 1 ? 'Winner' : c.finish}</p>`
}

function updateListOfCustomers(triggers) {
  d3.select('.contestant-list').html('')

  const {season, homestate, age, gender, race, orientation, winner} = triggers

  let filtered_contestants = list_of_contestants

  if (season > 0) filtered_contestants = d3.filter(filtered_contestants, function (d) { return d.season == season })
  if (homestate) filtered_contestants = d3.filter(filtered_contestants, function (d) { return d.homestate == homestate })
  if (age) filtered_contestants = d3.filter(filtered_contestants, function (d) { return d.age > (age - 10) && d.age < age })
  if (gender) filtered_contestants = d3.filter(filtered_contestants, function (d) { return d.gender == gender })
  if (race) filtered_contestants = d3.filter(filtered_contestants, function (d) { return d.race == race })
  if (orientation) filtered_contestants = d3.filter(filtered_contestants, function (d) { return d.orientation == orientation })
  if (winner) { filtered_contestants = d3.filter(filtered_contestants, function (d) { return d.finish == 1 })}
  
  d3.select('.contestant-list')
    .selectAll()
    .data(filtered_contestants)
    .enter()
    .append('div')
      .html(function (d) {
        return contestantCard(d)
      })
      .style('border', '1px solid black')
      .style('border-radius', '5px')
      .style('text-align', 'left')
      .style('padding-left', '5px')
      .style('width', '380px')
      .style('background-color', function (d) {
        if (d.gender == 'M') return '#5499C7'
        else if (d.gender == 'F') return '#EC7063'
        else return '#F4D03f'
      })
}

function displayHomestateChange(filters) {
  const options = ['All Locations', 'Alabama','Alaska', 'Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine', 'Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont', 'Virginia','Washington','West Virginia','Wisconsin','Wyoming', 'Quebec', 'Ontario']

  filters.append('label')
    .attr('for', 'homestate')
    .text('Home State: ')

  filters.append('select')
    .attr('class', 'homestate')
    .on('change', function (d,i) {
      if (this.selectedIndex > 0)
        triggers['homestate'] = options[this.selectedIndex]
      else
        triggers['homestate'] = null
    })
    .selectAll()
    .data(options)
    .enter()
    .append('option')
      .attr('id', 'homestate')
      .attr('value', function (d,i) {
        return i
      })
      .text(function (d,i) {
        return d
      })
}

function displaySeasonChange(filters) {
  filters.append('label')
    .attr('for', 'season')
    .text('Season: ')

  filters.append('select')
    .attr('class', 'season')
    .on('change', function (d,i) {
      triggers['season'] = this.selectedIndex
    })
    .append('option')
      .attr('id', 'season')
      .attr('value', function (d,i) {
        return 0
      })
      .text(function (d,i) {
        return 'All Seasons'
      })
  
  filters.select('.season')
    .selectAll()
    .data(d3.rollup(list_of_contestants, (v) => v.length, (d) => d.season_title))
    .enter()
    .append('option')
      .attr('id', 'season')
      .attr('value', function (d,i) {
        return i+1
      })
      .text(function (d,i) {
        return d[0]
      })
}

function displayAgeChange(filters) {
  const options = ['All Ages', '<20', '20 to 30', '30 to 40', '40 to 50', '50 to 60','60 to 70', '>70']
  filters.append('label')
    .attr('for', 'ages')
    .text('Age: ')

  filters.append('select')
    .attr('class', 'age')
    .on('change', function (d,i) {
      let result = null
      switch(options[this.selectedIndex]) {
        case 'All Ages':
          result = null
          break
        case '<20':
          result = 20
          break
        case '20 to 30':
          result = 30
          break
        case '30 to 40':
          result = 40
          break
        case '40 to 50':
          result = 50
          break
        case '50 to 60':
          result = 60
          break
        case '60 to 70':
          result = 70
          break
        case '>70':
          result = 80
          break
      }

      triggers['age'] = result
    })
    .selectAll()
    .data(options)
    .enter()
    .append('option')
      .attr('id', 'age')
      .attr('value', function (d,i) {
        return i+1
      })
      .text(function (d,i) {
        return d
      })
}

function displayGenderChange(filters) {
  const options = ['All Genders', 'Male', 'Female', 'Non-Binary']
  filters.append('label')
    .attr('for', 'gender')
    .text('Gender: ')

  filters.append('select')
    .attr('class', 'gender')
    .on('change', function (d,i) {
      let result = null
      switch(options[this.selectedIndex]) {
        case 'All Genders':
          result = null
          break
        case 'Male':
          result = 'M'
          break
        case 'Female':
          result = 'F'
          break
        case 'Non-Binary':
          result = 'N'
          break
      }

      triggers['gender'] = result
    })
    .selectAll()
    .data(options)
    .enter()
    .append('option')
      .attr('id', 'gender')
      .attr('value', function (d,i) {
        return i
      })
      .text(function (d,i) {
        return d
      })
}

function displayRaceChange(filters) {
  const options = ['All Races', 'White', 'African American', 'Asian American', 'Latin American']
  filters.append('label')
    .attr('for', 'race')
    .text('Race: ')

  filters.append('select')
    .attr('class', 'race')
    .on('change', function (d,i) {
      if (this.selectedIndex > 0)
        triggers['race'] = options[this.selectedIndex]
      else
        triggers['race'] = null
    })
    .selectAll()
    .data(options)
    .enter()
    .append('option')
      .attr('id', 'race')
      .attr('value', function (d,i) {
        return i
      })
      .text(function (d,i) {
        return d
      })
}

function displayOrientationChange(filters) {
  const options = ['All Orientations', 'Straight', 'LGBT']
  filters.append('label')
    .attr('for', 'orientation')
    .text('Orientation: ')

  filters.append('select')
    .attr('class', 'orientation')
    .on('change', function (d,i) {
      if (this.selectedIndex > 0)
        triggers['orientation'] = options[this.selectedIndex]
      else
      triggers['orientation'] = null
    })
    .selectAll()
    .data(options)
    .enter()
    .append('option')
      .attr('id', 'orientation')
      .attr('value', function (d,i) {
        return i
      })
      .text(function (d,i) {
        return d
      })
}

function displayFilters() {
  const filters = d3.select('.filters')
  filters.style('text-align', 'left')
  filters.style('padding', '0 100px')
  
  filters.append('h1')
    .text('Filters')
    .style('text-align', 'center')

  filters.on('change', function (d) {
    updateListOfCustomers(triggers)
  })

  displayHomestateChange(filters)
  filters.append('br')
  filters.append('br')
  displaySeasonChange(filters)
  filters.append('br')
  filters.append('br')
  displayAgeChange(filters)
  filters.append('br')
  filters.append('br')
  displayGenderChange(filters)
  filters.append('br')
  filters.append('br')
  displayRaceChange(filters)
  filters.append('br')
  filters.append('br')
  displayOrientationChange(filters)
  filters.append('br')
  filters.append('br')

  filters.append('input')
    .attr('type', 'checkbox')
    .attr('id', 'winner')
    .on('change', function (d,i) {
      triggers['winner'] = !triggers['winner']
      updateListOfCustomers(triggers)
    })
  filters.append('label')
    .attr('for', 'winner')
    .text('Winner')
}

function displayExplorationPage() {
  d3.select('.middle')
    .append('div')
      .attr('class', 'filters')
      .style('height', '80vh')
      .style('width', '600px')
      .style('float', 'left')

  d3.select('.middle')
    .append('div')
      .attr('class', 'contestant-list')
      .style('height', '80vh')
      .style('width', '400px')
      .style('overflow-y', 'scroll')
      .style('border', '1px solid black')
      .style('padding', '20px')
      .style('float', 'right')

  displayFilters()
  updateListOfCustomers(
    {
      season: 0,
      homestate: null,
      age: null,
      gender: null,
      race: null,
      orientation: null,
      winner: false
    }
  )
}

