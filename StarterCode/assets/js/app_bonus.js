// @TODO: YOUR CODE HERE! BOnus
function makeResponsive() {
  var svgArea = d3.select("body").select("svg");
  if (!svgArea.empty()) {
    svgArea.remove();
  }
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  var margin = {
    top: 50,
    right: 50,
    bottom: 80,
    left: 75
  };

  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
  var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Initial Params
  var chosenXaxis = "poverty";
  var chosenYaxis = "healthcareLow";

  /* All functions */

  // Updating x- or y-scale var upon click on axis
  function xScale(HData, chosenXaxis) {
    //create x scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(HData, d => d[chosenXaxis] * 0.8),
      d3.max(HData, d => d[chosenXaxis] * 1.2)])
      .range([0, width]);

    return xLinearScale;
  };

  function yScale(HData, chosenYaxis) {
    //create y scales
    let yLinearScale = d3.scaleLinear()
      .domain([d3.min(HData, d => d[chosenYaxis] * 0.8),
      d3.max(HData, d => d[chosenYaxis] * 1.2)
    ])
    .range([height, 0]);

    return yLinearScale;
  };

  // function used for updating axises vars upon click on axis labels
  function renderXAxes(xScale, htmlxAxis) {
    var bottomAxis = d3.axisBottom(xScale);
  
    htmlxAxis.transition()
      .duration(1000)
      .call(bottomAxis);

    return htmlxAxis;
  };

  function renderYAxes(yScale, htmlyAxis) {
    var leftAxis = d3.axisLeft(yScale);

    htmlyAxis.transition()
      .duration(1000)
      .call(leftAxis);

    return htmlyAxis;
  };

  // function used for updating circles group with a transition to
  // new circles
  function renderCircles(circlesGroup, xScale, chosenXaxis, yScale, chosenYaxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => xScale(d[chosenXaxis]))
      .attr("cy", d => yScale(d[chosenYaxis]));

    return circlesGroup;
  };

  // Function to update the state labels!!!@TODO


  function renderLabels(chartGroup, xLinearScale, chosenXaxis, yLinearScale, chosenYaxis) {
    console.log(chartGroup.selectAll("text"))
    chartGroup.selectAll(".stateText")
      .transition()
      .duration(1000)
      .attr("x", d => xLinearScale(d[chosenXaxis]))
      .attr("y", d => yLinearScale(d[chosenYaxis]));
  };
  


  // function used for updating circles group with new tooltip

  function updateToolTip(xvalue, yvalue, circlesGroup) {
    
    var xlabel;

    if (xvalue === "poverty") {
      xlabel = "In Poverty:";
    } else if (xvalue === "age") {
      xlabel = "Age:"
    } else {
      xlabel = "Household Income: $"
    }

    var Ylabel;

    if (yvalue === "healthcareLow") {
      Ylabel = "Lacks Healthcare:"
    }
    else if (yvalue === "obesity") {
      Ylabel = "Obesity:"
    } else {
      Ylabel = "Smokes:";
    }


    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${xlabel} ${d[xvalue]}<br>${Ylabel} ${d[yvalue]}%`);
      });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
      d3.select(this).style("stroke", "#323232");
    })
      // onmouseout event
      .on("mouseout", function(data) {
        toolTip.hide(data);
        d3.select(this).style("stroke", "#e3e3e3");
      });

    return circlesGroup;
  };



  /* Retrieve data from CSV */

  // Import Data
  d3.csv("assets/data/data.csv").then(function(HData, error) {
    if (error) throw error;

      // Step 1: Parse Data/Cast as numbers
      // ==============================
      
      HData.forEach(function(data) {
        data.state = data.state;
        data.abbr = data.abbr;
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
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
      var xLinearScale = xScale(HData, chosenXaxis);
      var yLinearScale = yScale(HData, chosenYaxis);

      
      // Step 3: Create axis functions
      // ==============================
      var xAxis = d3.axisBottom(xLinearScale);
      var yAxis = d3.axisLeft(yLinearScale);

    
      // Step 4: Append Axes to the chart
      // ==============================
      var htmlxAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

      var htmlyAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(yAxis);


    

      // Step 5: Create Circles
      // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
      .data(HData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXaxis]))
      .attr("cy", d => yLinearScale(d[chosenYaxis]))
      .attr("r", "10")
      .attr("fill", "skyblue")
      .attr("opacity", "1")


    // Create state labels inside of circles
   
    chartGroup.selectAll(".text")
      .data(HData)
      .enter()
      .append("text")
      .text((d) => d.abbr)
      .attr("x", d => xLinearScale(d[chosenXaxis]))
      .attr("y", d => yLinearScale(d[chosenYaxis]))
      .attr("class", "stateText")
      .attr("font-size", "10px")
      .attr("dy", ".3em");

    // // method 2
    // chartGroup.selectAll(".text")
    //   .data(HData)
    //   .enter()
    //   .append("text")
    //   .text((d) => d.abbr)
    //   .attr("x", d => xLinearScale(d[chosenXaxis]))
    //   .attr("y", d => yLinearScale(d[chosenYaxis]))
    //   .attr("class", "stateText")
    //   .attr("font-size", "10px")
    //   .attr("dy", ".3em");
    
    
    // Create group for two x-axis labels

    var xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 12)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("In Poverty (%)");

    var ageLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 30)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Median)");

    var incomeLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 48)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Household Income (Median)");

    //append y axis
    var ylabelsGroup = chartGroup.append("g")
      .attr("transform", "rotate(-90)");

    var obesityLabel = ylabelsGroup.append("text")
      .attr("x", 0 - (height / 2))
      .attr("y", 0 - margin.left - 2)
      .attr("dy", "1em")
      .attr("value", "obesity")
      .classed("inactive", true)
      .classed("axis-text", true)
      .text("Obese (%)");

    var smokesLabel = ylabelsGroup.append("text")
      .attr("x", 0 - (height / 2))
      .attr("y", 0 - margin.left + 13)
      .attr("dy", "1em")
      .attr("value", "smokes")
      .classed("inactive", true)
      .classed("axis-text", true)
      .text("Smokes (%)");

    var nocareLabel = ylabelsGroup.append("text")
      .attr("x", 0 - (height / 2))
      .attr("y", 0 - margin.left + 30)
      .attr("dy", "1em")
      .attr("value", "healthcareLow")
      .classed("active", true)
      .classed("axis-text", true)
      .text("Lacks Healthcare (%)");

  // Update ToolTip function above
    var circlesGroup = updateToolTip(chosenXaxis, chosenYaxis, circlesGroup);

  // x axis labels event listener
    xlabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var xvalue = d3.select(this).attr("value");
        console.log(xvalue);

        if (xvalue !== chosenXaxis) {

        // replaces chosenXAxis with value
        chosenXaxis = xvalue;

        // updates x scale for new data
        xLinearScale = xScale(HData, chosenXaxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, htmlxAxis);

        // updates circles with new x values
        circlesGroup1 = renderCircles(circlesGroup, xLinearScale, chosenXaxis, yLinearScale, chosenYaxis);

        // updates tooltips with new info
        circlesGroup2 = updateToolTip(xvalue, chosenYaxis, circlesGroup);

        // updates state labels with new info
        chartGroup1 = renderLabels(chartGroup, xLinearScale, xvalue, yLinearScale, chosenYaxis);

        // changes classes to change bold text

        if (chosenXaxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true)
        }
        if (chosenXaxis === "age") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
        incomeLabel
            .classed("active", false)
            .classed("inactive", true)
        }
        if (chosenXaxis === "income") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
        incomeLabel
            .classed("active", true)
            .classed("inactive", false)
        }
      }
    });


  // y axis labels event listener
  ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var yvalue = d3.select(this).attr("value");
      console.log(yvalue);
      if (yvalue !== chosenYaxis) {
      
        // y axis
        chosenYaxis = yvalue;

        yLinearScale = yScale(HData, chosenYaxis);

        yAxis = renderYAxes(yLinearScale, htmlyAxis);

        circlesGroup1 = renderCircles(circlesGroup, yLinearScale, chosenYaxis, xLinearScale, chosenXaxis);

        circlesGroup2 = updateToolTip(chosenXaxis, yvalue, circlesGroup);

        // updates state labels with new info
        chartGroup1 = renderLabels(chartGroup, xLinearScale, chosenXaxis, yLinearScale, yvalue);

        // changes classes to change bold text
        if (chosenYaxis === "healthcareLow") {
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          nocareLabel
            .classed("active", true)
            .classed("inactive", false)
        }
        if (chosenYaxis === "smokes") {
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          nocareLabel
            .classed("active", false)
            .classed("inactive", true)
        }
        if (chosenYaxis === "obesity") {
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          nocareLabel
            .classed("active", false)
            .classed("inactive", true)
        }
      }
    });
  }).catch(function(error) {
    console.log(error);
  });
}

  // When the browser loads, makeResponsive() is called.
  makeResponsive();
  
  // When the browser window is resized, makeResponsive() is called.
  d3.select(window).on("resize", makeResponsive);
