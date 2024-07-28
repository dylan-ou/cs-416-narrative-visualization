function displayIntroPage() {
  d3.select('.middle')
    .append('h1').text('Introduction')

  const text = 
    'Survivor is an American reality competition show\n' +
    'Hi'

  d3.select('.middle')
    .append('div')
    .append('text')
    .text(text)
}

function displayHomestateChartPage() {
  d3.select('.middle')
    .append('h1').text('Contestants by State')
    .append('div').attr('class', 'homestate-chart')

  d3.select('.homestate-chart')
    .append('svg')
    .attr('width', 1200)
    .attr('height', 600)

  const sortedStates = d3.sort(list_of_contestants, function (d) { return d.homestate})
  let stateCounts = d3.rollup(sortedStates, v => v.length, d => d.homestate)

  const crange = ['green','red'];
  const cdomain = [0,75];
  const cs = d3.scaleLinear().domain(cdomain).range(crange);

  var Tooltip = d3.select(".middle")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "2px")
    .style('position', 'absolute')
    .style('text-align', 'left')

  d3.json("https://d3js.org/us-10m.v2.json").then(function (d) {
    const geojson = topojson.feature(d, d.objects.states).features

    d3.select('svg')
      .append('g')
      .attr('transform', 'translate(150,0)')
      .selectAll('path')
      .data(geojson)
      .enter()
      .append('path')
        .attr('d', d3.geoPath())
        .attr('class', 'states')
        .style('stroke', 'black')
        .style('stroke-width', '1px')
        .style('fill', function (d,i) {
          console.log(d.properties.name)
          return cs(stateCounts.get(d.properties.name))
        })
        .on('mouseover', function(d) {
          Tooltip.style("opacity", 1)
          d3.select(this)
            .style("stroke-width", "3px")
        })
        .on('mousemove', function(d,i) {
          console.log(d3.pointer(d))
          Tooltip
            .html(`${i.properties.name}<br>Num. Contestants: ${(stateCounts.get(i.properties.name) ? stateCounts.get(i.properties.name) : 0)}`)
            .style("left", (d3.pointer(d)[0] + 350) + "px")
            .style("top", (d3.pointer(d)[1] + 150)+ "px")
        })
        .on('mouseleave', function(d) {
          Tooltip.style("opacity", 0)
          d3.select(this)
            .style("stroke-width", "1px")
        })
  })
}

async function displayAgeChartPage() {
  let sortedAges = d3.sort(list_of_contestants, function (d) { return d.age })

  const ageCounts = d3.rollup(sortedAges, v => v.length, d => d.age)
  const ages = [...ageCounts.keys()].map((x) => Number(x))

  const youngestContestant = sortedAges[0]
  const oldestContestant = sortedAges[sortedAges.length - 1]

  const averageAge = Math.round(d3.mean(sortedAges, function (d) { return d.age }))
  const modeAge = d3.mode(sortedAges, function (d) { return d.age })

  x = d3.scaleBand().domain(ages).range([0,650])
  y = d3.scaleLinear().domain([0,50]).range([500,0])

  const crange = ['blue','orange'];
  const cdomain = [0,50];
  const cs = d3.scaleLinear().domain(cdomain).range(crange);

  d3.select('.middle')
    .append('h1').text('Contestants by Age')
  
  d3.select('.middle')
    .append('div').attr('class', 'age-chart')

  d3.select('.age-chart')
  .append('svg')
  .attr('width', 1200)
  .attr('height', 600)
  .append('g')
  .attr('transform', 'translate(350,50)')
  .selectAll()
  .data(ageCounts)
  .enter()
  .append('rect')
    .attr('name', function (d, i) { return 'age-bar-' + d[0] })
    .attr('x', function (d, i) { 
      return (i * x.bandwidth())
    })
    .attr('y', function (d) {
      return y(d[1])
    })
    .attr('width', x.bandwidth() - 1)
    .attr('height',function (d) {
      return (d[1] * 10)
    })
    .style('fill', function (d) { 
      return cs(d[1])
    })

  d3.select('svg')
    .append('g')
    .attr('transform', 'translate(350,50)')
    .call(d3.axisLeft(y))

  d3.select('svg')
    .append('g')
    .attr('transform', 'translate(350,550)')
    .call(d3.axisBottom(x))

  const annotations = [
    {
      note: {
        title: "Youngest Contestant",
        label: `${youngestContestant['first_name'] + ' ' + youngestContestant['last_name']} was ${youngestContestant['age']} years old when he appeared on ${youngestContestant['season_title']}`,
        padding: -15,
        wrap: 150,
      },
      x: 356,
      y: 540,
      dy: -30,
      dx: -50,
    },
    {
      note: {
        title: "Oldest Contestant",
        label: `${oldestContestant['first_name'] + ' ' + oldestContestant['last_name']} was ${oldestContestant['age']} years old when he appeared on ${oldestContestant['season_title']}`,
        padding: -15,
        wrap: 150
      },
      x: 993,
      y: 545,
      dy: -20,
      dx: 20,
    },
    {
      note: {
        title: "Average Age of Contestant",
        label: `The average age for a contestant on Survivor is ${averageAge} years old`,
        padding: -15,
        wrap: 150
      },
      x: 547,
      y: 300,
      dy: -50,
      dx: 50,
    },
    {
      note: {
        title: "Most Common Age",
        label: `${ageCounts.get('24')} contestants appeared on the show at ${modeAge} years old, the most of any age`,
        padding: 10,
        wrap: 150,
        align: 'right',
        color: 'black'
      },
      x: 432,
      y: 100,
      dy: 20,
      dx: -100,
    }
  ]

  d3.select("svg")
    .append("g")
    .call(d3.annotation().annotations(annotations))
    .style("font-size", '12px')
}

function displayGenderPage() {
  let genderCounts = d3.rollup(list_of_contestants, v => v.length, d => d.gender)
  const colors = ['#5499C7', '#EC7063', '#F4D03f']

  d3.select('.middle')
    .append('h1').text('Contestants by Gender')
  
  d3.select('.middle')
    .append('div').attr('class', 'gender-chart')

  genderCounts = d3.sort(genderCounts, function (d) { return -d[1]})
  let counts = genderCounts.map((x) => {return x[1]})

  const nbContestants = d3.filter(list_of_contestants, function (d) { return d.gender == 'N'})

  const pie = d3.pie()
  var arc = d3.arc().innerRadius(0).outerRadius(200);

  d3.select('.gender-chart')
    .append('svg')
    .attr('width', 1200)
    .attr('height', 600)
    .append('g')
    .attr('transform', 'translate(600,300)')
    .selectAll('path')
    .data(pie(counts))
    .enter()
    .append('path')
    .attr('d', function (d) {
      return d
    })
    .attr('d', arc)
    .attr("stroke", "black")
    .style("stroke-width", "1px")
    .style('fill', function (d,i) {
      return colors[i]
    })

  const annotations = [
    {
      note: {
        title: "Male Contestants",
        label: `There have been ${genderCounts[0][1]} male contestants`,
        padding: 10,
        wrap: 150
      },
      x: 700,
      y: 300,
      dy: 50,
      dx: 150,
    },
    {
      note: {
        title: "Female Contestants",
        label: `There have been ${genderCounts[1][1]} female contestants`,
        padding: -10,
        wrap: 150
      },
      x: 500,
      y: 300,
      dy: -50,
      dx: -150,
    },
    {
      note: {
        title: "Non-Binary Contestants",
        label: `There has been one non-binary contestant (${nbContestants[0]['first_name'] + ' ' + nbContestants[0]['last_name']} from ${nbContestants[0]['season_title']})`,
        padding: -10,
        wrap: 150
      },
      x: 600,
      y: 200,
      dy: -50,
      dx: 200,
    },
  ]

  d3.select("svg")
    .append("g")
    .call(d3.annotation().annotations(annotations))
    .style("font-size", '12px')
}

function displayRaceChartPage() {
  let raceCounts = d3.rollup(list_of_contestants, v => v.length, d => d.race)
  const colors = ['#5499C7', '#EC7063', '#F4D03f', '#48C9B0 ']

  d3.select('.middle')
    .append('h1').text('Contestants by Race')
  
  d3.select('.middle')
    .append('div').attr('class', 'race-chart')

  raceCounts = d3.sort(raceCounts, function (d) { return -d[1]})

  console.log(raceCounts)

  let races = raceCounts.map((x) => {return x[0]})
  let counts = raceCounts.map((x) => {return x[1]})

  const pie = d3.pie()
  var arc = d3.arc().innerRadius(0).outerRadius(200);

  d3.select('.race-chart')
    .append('svg')
    .attr('width', 1200)
    .attr('height', 600)
    .append('g')
    .attr('transform', 'translate(600,300)')
    .selectAll('path')
    .data(pie(counts))
    .enter()
    .append('path')
    .attr('d', function (d) {
      return d
    })
    .attr('d', arc)
    .attr("stroke", "black")
    .style("stroke-width", "1px")
    .style('fill', function (d,i) {
      return colors[i]
    })

    const annotations = [
      {
        note: {
          title: "White Contestants",
          label: `There have been ${raceCounts[0][1]} white contestants`,
          padding: 10,
          wrap: 150
        },
        x: 700,
        y: 300,
        dy: 50,
        dx: 150,
      },
      {
        note: {
          title: "African American Contestants",
          label: `There have been ${raceCounts[1][1]} white contestants`,
          padding: 10,
          wrap: 150
        },
        x: 500,
        y: 300,
        dy: 50,
        dx: -150,
      },
      {
        note: {
          title: "Asian American Contestants",
          label: `There have been ${raceCounts[2][1]} white contestants`,
          padding: -5,
          wrap: 150
        },
        x: 500,
        y: 200,
        dy: -50,
        dx: -150,
      },
      {
        note: {
          title: "Latin American Contestants",
          label: `There have been ${raceCounts[3][1]} white contestants`,
          padding: -5,
          wrap: 150
        },
        x: 580,
        y: 150,
        dy: -50,
        dx: 150,
      },
    ]
  
    d3.select("svg")
      .append("g")
      .call(d3.annotation().annotations(annotations))
      .style("font-size", '12px')
}

function displayOrientationChartPage() {
  let orientationCounts = d3.rollup(list_of_contestants, v => v.length, d => d.orientation)
  const colors = ['#5499C7', '#EC7063']

  d3.select('.middle')
    .append('h1').text('Contestants by Sexual Orientation')
  
  d3.select('.middle')
    .append('div').attr('class', 'orientation-chart')

  orientationCounts = d3.sort(orientationCounts, function (d) { return -d[1]})

  console.log(orientationCounts)

  let orientations = orientationCounts.map((x) => {return x[0]})
  let counts = orientationCounts.map((x) => {return x[1]})

  const pie = d3.pie()
  var arc = d3.arc().innerRadius(0).outerRadius(200);

  d3.select('.orientation-chart')
    .append('svg')
    .attr('width', 1200)
    .attr('height', 600)
    .append('g')
    .attr('transform', 'translate(600,300)')
    .selectAll('path')
    .data(pie(counts))
    .enter()
    .append('path')
    .attr('d', function (d) {
      return d
    })
    .attr('d', arc)
    .attr("stroke", "black")
    .style("stroke-width", "1px")
    .style('fill', function (d,i) {
      return colors[i]
    })

    const annotations = [
      {
        note: {
          title: "Straight Contestants",
          label: `There have been ${orientationCounts[0][1]} contestants who identified as straight`,
          padding: 10,
          wrap: 150
        },
        x: 700,
        y: 300,
        dy: 50,
        dx: 150,
      },
      {
        note: {
          title: "LGBT Contestants",
          label: `There have been ${orientationCounts[1][1]} contestants who identified as LGBT`,
          padding: -10,
          wrap: 150
        },
        x: 575,
        y: 200,
        dy: -50,
        dx: -150,
      },
    ]
  
    d3.select("svg")
      .append("g")
      .call(d3.annotation().annotations(annotations))
      .style("font-size", '12px')
}