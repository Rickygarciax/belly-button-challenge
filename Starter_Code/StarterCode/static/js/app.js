// Set url
const baseUrl = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

// Get data from url 
d3.json(baseUrl).then(function(data) {
    console.log(data);
});

// Create charts function
function charts(sample) {
  
  // Grab the sample data from the url
  d3.json(baseUrl).then((data) => {
    var samplesData= data.samples;
    var results= samplesData.filter(sampleobject => 
        sampleobject.id == sample);
    var result= results[0]
  
    var ids = result.otu_ids;
    var labels = result.otu_labels;
    var values = result.sample_values;

    // Create bar chart
    var barData =[
    {
      y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      x:values.slice(0,10).reverse(),
      text:labels.slice(0,10).reverse(),
      type:"bar",
      orientation:"h"

    }
    ];

     var barDesign = {
    title: "Top 10 Bacteria Cultures Found",
    margin: { t: 30, l: 150 }
    };

     // Plot it
    Plotly.newPlot("bar", barData, barDesign);


    // Create bubble chart
    var bubbleChart = {
      margin: { t: 0 },
      xaxis: { title: "OTU ID" },
      hovermode: "closest",
      };
  
      var bubbleData = [ 
      {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
          color: ids,
          size: values,
          }
      }
    ];
    
    // Plot it
    Plotly.newPlot("bubble", bubbleData, bubbleChart);
    });
}

// Create the MetaData
function metaData(sample) {
    d3.json(baseUrl).then((data) => {
        var metadata= data.metadata;
        var metaResults= metadata.filter(sampleobject => 
            sampleobject.id == sample);
        var result= metaResults[0]
        var board = d3.select("#sample-metadata");
        board.html("");
        Object.entries(result).forEach(([key, value]) => {
            board.append("h6").text(`${key}: ${value}`);
        });
    });
}

// Create a function to change the charts 
function create() {

    var selecting = d3.select("#selDataset"); 

    d3.json(baseUrl).then((data) => {
        var samples = data.names;
        samples.forEach((sample) => {
            selecting
            .append("option")
            .text(sample)
            .property("value", sample);
        });

        // Use the first sample from the list to build the initial plots
        const firstSample = samples[0];
        charts(firstSample);
        metaData(firstSample);
    });
}

// Create charts when new sample is selected
function newCharts(newSample) {
    charts(newSample);
    metaData(newSample);
}

// Create the dashboard
create();