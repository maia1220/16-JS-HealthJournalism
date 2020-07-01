// @TODO: YOUR CODE HERE!
// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {
    var svgArea = d3.select("body").select("svg");
    if (!svgArea.empty()) {
      svgArea.remove();
    }
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;
  
    var margin = {
      top: 50,
      bottom: 50,
      right: 50,
      left: 50
    };
  
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;
  
    // Append SVG element
    var svg = d3
      .select("#scatter")
      .append("svg")
      .attr("height", svgHeight)
      .attr("width", svgWidth);
  
    // Append group element
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(HData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    
    HData.forEach(function(data) {
      data.state = data.state;
      data.abbr = data.abbr;
      data.poverty = +data.poverty;
      data.povertyMoe = +data.povertyMoe;
      data.age = +data.age;
      data.ageMoe = +data.ageMoe;
      data.income = +data.income;
      data.incomeMoe = +data.incomeMoe;
      data.healthcare = +data.healthcare;
      data.healthcareLow = +data.healthcareLow;
      data.healthcareHigh = +data.healthcareHigh;
      data.obesity = +data.obesity;
      data.obesityLow = +data.obesityLow;
      data.smokes = +data.smokes;
      data.smokesLow = +data.smokesLow;
      data.smokesHigh = +data.smokesHigh;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(HData, d => d.poverty) * 0.8,
      d3.max(HData, d => d.poverty) * 1.2
    ])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(HData, d => d.healthcareLow) * 0.8,
        d3.max(HData, d => d.healthcareLow) * 1.2
      ])
      .range([height, 0]);

    
    // Step 3: Create axis functions
    // ==============================
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale).ticks(10);

  
    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

    chartGroup.append("g")
     .call(yAxis);


  

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(HData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcareLow))
    .attr("r", "10")
    .attr("fill", "skyblue")
    .attr("opacity", "1")
    .attr("class", "stateCircle");

    // fill state labels 
    chartGroup.selectAll(".text")
    .data(HData)
    .enter()
    .append("text")
    .text((d) => d.abbr)
    .attr("x", (d) => xLinearScale(d.poverty))
    .attr("y", (d) => yLinearScale(d.healthcareLow))
    .attr("class", "stateText")
    .attr("font-size", "10px")
    .attr("dy", ".3em");


    // Create axes labels
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left -5)
    .attr("x", 0 - (height / 1.5))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)");

   chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top - 5})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");


    // Step 6: Initialize tool tip
    // ==============================
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>Poverty: ${d.poverty}%<br>Lacks Healthcare: ${d.healthcareLow}%`);
    });



    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);


    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(d) {
      toolTip.show(d, this);
    })
    // Step 4: Create "mouseout" event listener to hide tooltip
      .on("mouseout", function(d) {
        toolTip.hide(d);
      });
    }).catch(function(error) {
        console.log(error);
 });
}
       
  
  // When the browser loads, makeResponsive() is called.
  makeResponsive();
  
  // When the browser window is resized, makeResponsive() is called.
  d3.select(window).on("resize", makeResponsive);
