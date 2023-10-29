const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
d3.json(url).then(function(data){
    console.log(data);
});

function init(){
    let dropDown = d3.select("#selDataset");

    //append each id to drodown
    d3.json(url).then(function(data){
        let name = data.names;
        name.forEach(function(id){
        dropDown.append("option").text(id).property("value")
        });

        let firstId = name[0];
        console.log(firstId);

        //initialize graphs and demographic info
        metaData(firstId);
        barChart(firstId);
        bubbleChart(firstId);

    });
};

function metaData(selectedID){
    d3.json(url).then(function(data){

        //all metadata
        let Metadata = data.metadata;

        //filter based on selectedID
        let item = Metadata.filter(result => result.id == selectedID);
        console.log(item);
        d3.select("#sample-metadata").html("");

        //add key and value to dialog box
        Object.entries(item[0]).forEach(([key, value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key} : ${value}`);
        });

    });
}

function barChart(selectedID){

    d3.json(url).then((data) => {

        //all data
        let samples = data.samples;

        //filter based on selectedID
        let item = samples.filter(result => result.id == selectedID);
        console.log(item);

        //retrieve relevant arrays
        let otu_ids =  item[0].otu_ids;
        let sample_values = item[0].sample_values;
        let labels = item[0].otu_labels;

        console.log(otu_ids, sample_values, labels);

        //select only first ten items
        let firstTenOtu = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let firstTenSampleValues = sample_values.slice(0,10).reverse();
        let firstTenLabels = labels.slice(0,10).reverse();
        console.log(firstTenOtu, firstTenSampleValues, firstTenLabels);

        //set variables for create bar chart
        let trace1 = {
            x: firstTenSampleValues,
            y: firstTenOtu,
            text: firstTenLabels,
            type: "bar",
            orientation: "h"   
        };

        let data1 = [trace1];

        let layout = {
            title: "Top 10 OTU",
            height: 600,
            width: 500
        };

        Plotly.newPlot("bar", data1, layout);
    })

}

function bubbleChart(selectedID){

    d3.json(url).then((data) => {

        //all data
        let samples = data.samples;

        //filter based on selectedID
        let item = samples.filter(result => result.id == selectedID);
        console.log(item);

        //retrieve x, y values and labels
        let otu_ids =  item[0].otu_ids;
        let sample_values = item[0].sample_values;
        let labels = item[0].otu_labels;

        console.log(otu_ids, sample_values, labels);

        //set the variables for create bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: labels,
            mode: 'markers',
            marker: {
                color: otu_ids,
                colorscale: 'Earth',
                size: sample_values
            }
        };

        let data1 =[trace1];

        let layout ={
            title: 'Bubble chart for each sample',
            showlegend: false,
            height: 500,
            width: 1000
        };

        Plotly.newPlot("bubble", data1, layout);
    })
}

function optionChanged(newID){
    metaData(newID);
    barChart(newID);
    bubbleChart(newID);
}

init();