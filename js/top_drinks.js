import {
    CATEGORIES_1,
    CATEGORIES_COLORS_FOUR
} from './constants.js'

// size

let plotWidth = 600;
let plotHeight = 400;
let plotMargin = 50;
let outerWidth = plotWidth + 2 * plotMargin;
let outerHeight = plotHeight + 2 * plotMargin;

let legendMargin = 4;
let legendHeight = 16;
let legendWidth = 160;

// scales

let xScale = d3.scaleLinear()
    .domain([0, 500]) // 500: max sugars for grande size
    .range([0, plotWidth]);

let ySugarsScale = d3.scaleLinear()
    .domain([0, 75])
    .range([plotHeight, 0]);

let yCaffeineScale = d3.scaleLinear()
    .domain([0, 400])
    .range([plotHeight, 0]);

let yScale = ySugarsScale;

let yEntry = 'sugars';

// data

var topDrinksSugarsData = [];
var allDrinksSugarsData = [];
var allDrinksSugarsDataByCategory = [];
var topDrinksCaffeineData = [];
var allDrinksCaffeineData = [];
var allDrinksCaffeineDataByCategory = [];

function setup(otherDrinksData) {

    // setups

    d3.select('#top-drinks-svg')
        .attr('width', outerWidth)
        .attr('height', outerHeight);

    d3.select('#top-drinks-svg-plot')
        .attr('transform', `translate(${plotMargin}, ${plotMargin})`);

    // axes

    plotAxes();

    let legendPlot = d3.select('#top-drinks-svg-legend')
        .attr('transform', `translate(${6 * legendMargin}, ${legendMargin})`);
        let legendPlotColor = d3.select('#top-drinks-svg-legend-color');
        let legendPlotSize = d3.select('#top-drinks-svg-legend-size');

    // all drinks

    legendPlotColor.append('text')
        .text('All Drinks')
        .attr('class', 'top-drink-legend')
        .style('text-anchor', 'start')
        .attr('x', legendMargin)
        .attr('y', legendHeight / 2);

    var top = legendHeight + 2 * legendMargin;

    for (const i of [0, 1, 2, 3]) {
        legendPlotColor.append('rect')
            .attr('x', legendMargin)
            .attr('y', top)
            .attr('width', legendHeight * 0.8)
            .attr('height', legendHeight * 0.8)
            .style('fill', CATEGORIES_COLORS_FOUR[CATEGORIES_1[i]]);

        legendPlotColor.append('text')
            .text(i == 3 ? 'Frappuccino' : `${CATEGORIES_1[i]}, ${CATEGORIES_1[i + 4]}`)
            .attr('x', legendMargin + legendHeight * 1.2)
            .attr('y', top + legendHeight * 0.6)
            .attr('class', 'temp-svg-axes-text-small')
            .style('text-anchor', 'start');

        top += legendHeight + legendMargin;
    }

    // top drinks

    legendPlotSize.append('text')
        .text('Top Drinks')
        .attr('class', 'top-drink-legend')
        .style('text-anchor', 'start')
        .attr('x', legendMargin + legendWidth)
        .attr('y', legendHeight / 2);

    top = legendHeight + legendMargin;
    for (const i of [1, 2, 3, 4]) {
        let lineHeight = Math.max(legendHeight, getDotWidthForAllDrinks(i) * 2);

        legendPlotSize.append('circle')
            .style('fill', '#006241')
            .attr('cx', getDotWidthForAllDrinks(4) + legendWidth + legendMargin)
            .attr('cy', top + lineHeight / 2)
            .attr('r', getDotWidthForAllDrinks(i));

        legendPlotSize.append('text')
            .text(i)
            .attr('class', 'top-drink-legend')
            .attr('x', getDotWidthForAllDrinks(4) * 2 + legendWidth + legendMargin * 3)
            .attr('y', top + lineHeight / 2);
        top += lineHeight + legendMargin;
    }

    // actions

    d3.select('#top-drinks-checkbox').on('click', function() {
        refreshLegends();
        plotDots();
    });

    d3.selectAll(("input[name='top-drinks-y']")).on('change', function(){
        yEntry = this.value;
        plotAxes();
        plotDots();
    });
}

function passData(grandeData) {
    var topDrinksData = grandeData.filter(d => d.RANK !== '');

    topDrinksSugarsData = d3.nest()
        .key(d => [d.SUGARS, d.CALORIES])
        .entries(topDrinksData);

    allDrinksSugarsData = d3.nest()
        .key(d => [d.SUGARS, d.CALORIES])
        .entries(grandeData);

    allDrinksSugarsDataByCategory = d3.nest()
        .key(d => [d.SUGARS, d.CALORIES, d.CATEGORY1])
        .entries(grandeData);

    topDrinksCaffeineData = d3.nest()
        .key(d => [d.CAFFEINE, d.CALORIES])
        .entries(topDrinksData);

    allDrinksCaffeineData = d3.nest()
        .key(d => [d.CAFFEINE, d.CALORIES])
        .entries(grandeData);

    allDrinksCaffeineDataByCategory = d3.nest()
        .key(d => [d.CAFFEINE, d.CALORIES, d.CATEGORY1])
        .entries(grandeData);

    refreshLegends();
    plotDots();
}

function getDotWidthForAllDrinks(i) {
    return 2 + 2 * i;
}

function refreshLegends() {
    if (document.getElementById('top-drinks-checkbox').checked) {
        d3.select('#top-drinks-svg-legend-color').style('opacity', 0.5);
        d3.select('#top-drinks-svg-legend-size').style('opacity', 1);
    } else {
        d3.select('#top-drinks-svg-legend-color').style('opacity', 1);
        d3.select('#top-drinks-svg-legend-size').style('opacity', 0.5);
    }
}

function plotAxes() {
    yScale = yEntry === 'sugars' ? ySugarsScale : yCaffeineScale;

    let axesPlot = d3.select('#top-drinks-svg-axes');
    axesPlot.selectAll('g').remove();
    axesPlot.selectAll('text').remove();

    axesPlot.append('g')
        .attr('transform', `translate(0, ${plotHeight})`)
        .call(d3.axisBottom(xScale));

    axesPlot.append('g')
        .call(d3.axisLeft(yScale));

    axesPlot.append('text')
        .attr('transform', `translate(${plotWidth / 2}, ${plotHeight + 35})`)
        .style('text-anchor', 'middle')
        .text('CALORIES');

    axesPlot.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -plotMargin)
        .attr('x', -plotHeight / 2)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text(yEntry === 'sugars' ? 'SUGARS (g)' : 'CAFFEINE (mg)');
}

// plot

function plotDots() {
    plotAllDrinks();
    plotTopDrinks();
}

function plotAllDrinks() {
    let color = !document.getElementById('top-drinks-checkbox').checked;
    let otherPlot = d3.select('#top-drinks-svg-other');
    otherPlot.selectAll('circle').remove();

    let data;
    if (yEntry === "sugars") {
        data = color ? allDrinksSugarsDataByCategory : allDrinksSugarsData;
    } else {
        data = color ? allDrinksCaffeineDataByCategory : allDrinksCaffeineData;
    }

    otherPlot.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .style('fill', d => color ? CATEGORIES_COLORS_FOUR[d.key.split(',')[2]] : '#f2f0eb')
        .style('opacity', color ? 0.5 : 1)
        .attr('r', d => 2 + 2 * d.values.length)
        .attr('cx', d => xScale(d.key.split(',')[1]))
        .attr('cy', d => yScale(d.key.split(',')[0]))
        .exit()
        .remove();
}

function plotTopDrinks() {
    let details = d3.select('#top-drinks-details');
    let checkBox = document.getElementById('top-drinks-checkbox');

    let data = yEntry === "sugars" ? topDrinksSugarsData : topDrinksCaffeineData;

    let topPlot = d3.select('#top-drinks-svg-top');
    topPlot.selectAll('circle').remove();

    if (checkBox.checked) {
        topPlot.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'top-drink-dots')
            .attr('r', d => 1 + 2 * d.values.length)
            .attr('cx', d => xScale(d.key.split(',')[1]))
            .attr('cy', d => yScale(d.key.split(',')[0]))
            .on('mouseenter', d => {
                // sort by ranking
                const values = d.values;
                values.sort(function(x, y) {
                    return d3.ascending(x.RANK, y.RANK);
                })

                for (const i in values) {
                    let container = details.append('div');
                    container.append('p')
                        .attr('class', 'top-drinks-details-name')
                        .text(`#${d.values[i].RANK} ${d.values[i].NAME}`);
                    container.append('p')
                        .attr('class', 'top-drinks-details-others')
                        .text(`Calories: ${d.values[i].CALORIES}, Sugars: ${d.values[i].SUGARS}`);
                }
            })
            .on('mouseleave', d => {
                details.selectAll('div').remove();
            })
            .exit()
            .remove();
    }
}

export default {
    setup,
    passData
}
