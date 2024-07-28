function displayExplorationPage() {
  d3.select('.middle')
    .append('div')
    .attr('class', 'row')
  
  d3.select('.middle')
    .select('.row')
    .append('div')
      .attr('class', 'col')

  d3.select('.middle')
    .select('.row')
    .append('div')
      .attr('class', 'col')
}