// Fetch data from the JSON file
function fetchData() {
  return d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json");
}

// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    let metadata = data.metadata;
    let resultArray = metadata.filter(obj => obj.id == sample);
    let result = resultArray[0];
    let panel = d3.select("#sample-metadata");
    panel.html(""); // Clear existing metadata

    // Loop through each key-value pair and create a text string
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  });
}

// Build a Bar Chart
function buildBarChart(sample) {
  fetchData().then((data) => {
    const samples = data.samples;
    const result = samples.find((obj) => obj.id === sample);
    const { otu_ids, otu_labels, sample_values } = result;

    const barTrace = {
      x: sample_values.slice(0, 10).reverse(),
      y: otu_ids.slice(0, 10).reverse().map((id) => `OTU ${id}`),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
    };
    const barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Number of Bacteria" },
      yaxis: { title: "OTU ID" },
    };
    Plotly.newPlot("bar-chart", [barTrace], barLayout);
  });
}

// Build a Bubble Chart
function buildBubbleChart(sample) {
  fetchData().then((data) => {
    const samples = data.samples;
    const result = samples.find((obj) => obj.id === sample);
    const { otu_ids, otu_labels, sample_values } = result;

    const bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Viridis",
      },
    };
    const bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number of Bacteria" },
    };
    Plotly.newPlot("bubble-chart", [bubbleTrace], bubbleLayout);
  });
}

// Initialize the dashboard
function init() {
  fetchData().then((data) => {
    const names = data.names;
    const dropdown = d3.select("#selDataset");
    names.forEach((name) => {
      dropdown.append("option").text(name).property("value", name);
    });
    const firstSample = names[0];
    buildBarChart(firstSample);
    buildBubbleChart(firstSample);
    buildMetadata(firstSample);
  });
}

// Event listener for dropdown change
function optionChanged(newSample) {
  buildBarChart(newSample);
  buildBubbleChart(newSample);
  buildMetadata(newSample);
}

// Call init() to set up the dashboard
init();



