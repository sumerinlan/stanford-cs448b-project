var drinksData = [];
var foodData = [];

var drinksTopTen = [];
var foodTopTen = [];

// size

// donuts
let outerRadius = 60; // outer radius of donut
let innerRadius = outerRadius * 0.6; // inner radius of donut
let donutTextHeight = 16; // height of text below donut
let donutHeight = outerRadius * 2 + donutTextHeight * 5; // height of a donut
let donutMargin = 100;
// dots
let dotRadius = 3; // radius for dot
let dotHeight = 8; // space fot dot, to calculate svg height
// svg
let plotMargin = 30;
let plotWidth = outerRadius * 10 + donutMargin * 4;
let donutPlotHeight = donutHeight * 2 + donutMargin;
let outerWidth = plotWidth + 2 * plotMargin;
let donutOuterHeight = donutPlotHeight + 2 * plotMargin;

// scale

let xScaleDrinks = d3.scaleLinear()
    .domain([0, 500]) // 500: max sugars for grande size
    .range([0, plotWidth]);

let xScaleFood = d3.scaleLinear()
    .domain([0, 700])
    .range([0, plotWidth]);

const DRINKS = 'drinks';
const FOOD = 'food';

function passData(drinksAll, foodAll) {

    drinksData = d3.nest().key(d => d.CALORIES).entries(drinksAll);
    foodData = d3.nest().key(d => d.CALORIES).entries(foodAll);

    drinksTopTen = drinksAll.filter(d => d.RANK != '' && 1 <= parseInt(d.RANK) && parseInt(d.RANK) <= 10);
    drinksTopTen.sort((a, b) => d3.ascending(parseInt(a.RANK), parseInt(b.RANK)));

    foodTopTen = foodAll.filter(d => d.RANK != '' && 1 <= parseInt(d.RANK) && parseInt(d.RANK) <= 10);
    foodTopTen.sort((a, b) => d3.ascending(parseInt(a.RANK), parseInt(b.RANK)));

    plotDots(DRINKS);
    plotDots(FOOD);
    plotDonuts(DRINKS);
    plotDonuts(FOOD);
}

function plotDots(item) {
    let height = (item === DRINKS ? 9 : 4) * dotHeight;
    let outerHeight = height + plotMargin * 2;
    let xScale = item === DRINKS ? xScaleDrinks : xScaleFood;

    let svg = d3.select(`#donut-${item}-dots-svg`)
        .attr('width', outerWidth)
        .attr('height', outerHeight);

    let plot = svg.append('g')
        .attr('transform', `translate(${plotMargin}, ${plotMargin})`);

    plot.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickValues([]).tickSize(0));

    plot.append('text')
        .text(0)
        .attr('transform', `translate(-5, ${height})`)
        .attr('class', 'legend-small')
        .style('text-anchor', 'end');

    plot.append('text')
        .text(item === DRINKS ? 500 : 700)
        .attr('transform', `translate(${plotWidth + 5}, ${height})`)
        .attr('class', 'legend-small')
        .style('text-anchor', 'start');

    let data = item === DRINKS ? drinksData : foodData;
    for (const i in data) {
        plot.append('g')
            .selectAll('circle')
            .data(data[i].values)
            .enter()
            .append('circle')
            .attr('class', d => `donut-dots-${item}-rank-${d.RANK}`)
            .style('opacity', 0.3)
            // .style('filter', `url(#dropshadow)`)
            .style('fill', '#006241')
            .attr('r', dotRadius)
            .attr('cx', d => xScale(data[i].key))
            .attr('cy', (d, i) => height - (i + 0.5) * dotHeight)
            .exit()
            .remove();
    }
}

function plotDonuts(item) {

    let data = item === DRINKS ? drinksTopTen : foodTopTen;
    let keys = [
        'Calories from Carbohydrates',
        'Calories from Protein',
        'Calories from Fat',
    ]
    let pieData = data.map(function(d) {
        let carb = 4 * d.TOTAL_CARBOHYDRATES;
        let protein = 4 * d.PROTEIN;
        let fat = 9 * d.TOTAL_FAT;
        let total = carb + protein + fat;
        return [{
                'name': keys[0],
                'value': total == 0 ? total : carb / (carb + protein + fat) * 100
            },
            {
                'name': keys[1],
                'value': total == 0 ? total : protein / (carb + protein + fat) * 100
            },
            {
                'name': keys[2],
                'value': total == 0 ? total : fat / (carb + protein + fat) * 100
            },
        ]
    });

    let svg = d3.select(`#donut-${item}-donuts-svg`)
        .attr('width', outerWidth)
        .attr('height', donutOuterHeight);

    let mainPlot = svg.append('g')
        .attr('transform', `translate(${plotMargin}, ${plotMargin})`);

    // Reference: https://observablehq.com/@d3/donut-chart

    let pie = d3.pie()
        .padAngle(0.005)
        .sort(null)
        .value(d => d.value);
    let arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

    let color = {
        'Calories from Carbohydrates': '#005e66',
        'Calories from Protein': '#4c9f87',
        'Calories from Fat': '#c0d48b'
    };

    for (const i in d3.range(10)) {
        let arcs = pie(pieData[i]);

        let dx = (donutMargin + outerRadius * 2) * (i % 5) + outerRadius;
        let dy = (plotMargin + donutHeight) * Math.floor(i / 5) + outerRadius;
        let plot = mainPlot.append('g')
            .attr('transform', `translate(${dx}, ${dy})`);

        let piePlot = plot.append('g')
        .on('mouseover', d => {
            dot.style('opacity', 1);
            dot.style('filter', `url(#dropshadow)`);
            piePlot.selectAll('path').style('filter', `url(#dropshadow)`);
            piePlot.selectAll('text').style('fill', 'grey');
        })
        .on('mouseleave', d => {
            dot.style('opacity', 0.3);
            dot.style('filter', null);
            piePlot.selectAll('path').style('filter', null);
            piePlot.selectAll('text').style('fill', 'black');
        });

        piePlot.append('circle')
            .style('fill', 'white')  // background
            .attr('r', outerRadius);

        piePlot.append('text')
            .text(data[i].CALORIES)
            .attr('class', 'donut-donut-calories-large');

        piePlot.append('text')
            .text('Calories')
            .attr('y', 14)
            .attr('class', 'donut-donut-calories-small');

        let dot = d3.select(`.donut-dots-${item}-rank-${data[i].RANK}`);

        piePlot.selectAll('path')
            .data(arcs)
            .join('path')
            .attr('fill', d => color[d.data.name])
            .attr('d', arc);

        // hack: break down name that is too long
        if (data[i].NAME.length > 21) {
            let name1;
            let name2;
            if (data[i].NAME.split(' ').slice(0, 3).join(' ').length > 23) {
                name1 = data[i].NAME.split(' ').slice(0, 2).join(' ');
                name2 = data[i].NAME.split(' ').slice(2).join(' ');
            } else {
                name1 = data[i].NAME.split(' ').slice(0, 3).join(' ');
                name2 = data[i].NAME.split(' ').slice(3).join(' ');
            }
            plot.append('text')
                .text(name1)
                .attr('y', outerRadius + donutTextHeight)
                .attr('class', 'donut-donut-name');
            plot.append('text')
                .text(name2)
                .attr('y', outerRadius + donutTextHeight * 2)
                .attr('class', 'donut-donut-name');
        } else {
            plot.append('text')
                .text(data[i].NAME)
                .attr('y', outerRadius + donutTextHeight * 1.5)
                .attr('class', 'donut-donut-name');
        }

        for (const j in d3.range(3)) {
            plot.append('text')
                .attr('class', 'donut-donut-percentage')
                .attr('y', outerRadius + donutTextHeight * (3 + parseInt(j)))
                .append('tspan')
                // .style('font-weight', 'bold')
                .text(`${parseFloat(pieData[i][j].value).toFixed(0)}%`)
                .append('tspan')
                .style('font-weight', 'normal')
                .text(' from ')
                .append('tspan')
                .style('font-weight', 'bold')
                .style('fill', color[pieData[i][j].name])
                .text(pieData[i][j].name.split(' ')[2]);
        }
    }

    // adding drop shadow for dots
    // Container for the gradients
    var defs = d3.select('#donut-drinks-dots-svg').append("defs");

    // Filter for the outside glow
    var filter = defs.append("filter")
        .attr("id","dropshadow")
        .attr("x", "-20%")
        .attr("y", "-20%")
        .attr("width", "120%")
        .attr("height", "120%")
        .attr("filterUnits", "userSpaceOnUse");
    filter.append("feGaussianBlur")
        // .attr("in", "SourceAlpha")
        .attr("stdDeviation","2")
        .attr("result", "coloredBlur");
    // filter.append("feOffset")
    //     .attr("dx", "5")
    //     .attr("dy", "5")
    //     .attr("result","offsetblur");
    // filter.append("feOffset")
    //     .attr("dx", "-5")
    //     .attr("dy", "-5")
    //     .attr("result","offsetblur");
    var feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode")
        .attr("in","coloredBlur");
    feMerge.append("feMergeNode")
        .attr("in","SourceGraphic");
}

export default {
    passData
}
