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

// data

var topDrinksSugarsData = [];
var allDrinksSugarsData = [];
var allDrinksCaffeineData = [];

const TOP_DRINKS = 'top-drinks';
const CAFFEINE = 'caffeine';

function setup() {
    setupByType(TOP_DRINKS)
    setupByType(CAFFEINE)
}

function setupByType(type) {
    // setups

    d3.select(`#${type}-svg`)
        .attr('width', outerWidth)
        .attr('height', outerHeight);

    d3.select(`#${type}-svg-plot`)
        .attr('transform', `translate(${plotMargin}, ${plotMargin})`);

    // axes

    plotAxes(type);

    // legend

    let legendPlot = d3.select(`#${type}-svg-legend`)
        .attr('transform', `translate(${6 * legendMargin}, ${legendMargin})`);
    let legendPlotColor = d3.select(`#${type}-svg-legend-color`);
    let legendPlotSize = d3.select(`#${type}-svg-legend-size`);

    // colors

    var top = legendMargin;

    if (type == TOP_DRINKS) {

        // all drinks

        legendPlotColor.append('rect')
            .attr('x', legendMargin)
            .attr('y', top)
            .attr('width', legendHeight * 0.8)
            .attr('height', legendHeight * 0.8)
            .style('fill', '#f2f0eb');

        legendPlotColor.append('text')
            .text('All Drinks')
            .attr('x', legendMargin + legendHeight * 1.2)
            .attr('y', top + legendHeight * 0.6)
            .attr('class', 'temp-svg-axes-text-small')
            .style('text-anchor', 'start');

        top += legendHeight + legendMargin;

        // top drinks

        legendPlotColor.append('rect')
            .attr('x', legendMargin)
            .attr('y', top)
            .attr('width', legendHeight * 0.8)
            .attr('height', legendHeight * 0.8)
            .style('fill', '#006241');

        legendPlotColor.append('text')
            .text('Top Drinks')
            .attr('x', legendMargin + legendHeight * 1.2)
            .attr('y', top + legendHeight * 0.6)
            .attr('class', 'temp-svg-axes-text-small')
            .style('text-anchor', 'start');

    } else {
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
    }

    // sizes

    top = legendMargin;
    let legendWidth = type == TOP_DRINKS ? 100 : 160;
    for (const i of type == TOP_DRINKS ? [1, 2, 3, 4] : [1, 3, 5]) {
        let lineHeight = Math.max(legendHeight, getDotWidthForAllDrinks(i) * 2);

        legendPlotSize.append('circle')
            .style('fill', '#006241')
            .attr('cx', getDotWidthForAllDrinks(5) + legendWidth + legendMargin)
            .attr('cy', top + lineHeight / 2)
            .attr('r', getDotWidthForAllDrinks(i));

        legendPlotSize.append('text')
            .text(i)
            .attr('class', 'scatter-plot-legend')
            .attr('x', getDotWidthForAllDrinks(5) * 2 + legendWidth + legendMargin * 3)
            .attr('y', top + lineHeight / 2 + 6);
        top += lineHeight + legendMargin;
    }

    // actions

    d3.select(`#${type}-checkbox`).on('click', function() {
        plotDots(type);
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

    allDrinksCaffeineData = d3.nest()
        .key(d => [d.CAFFEINE, d.CALORIES, d.CATEGORY1])
        .entries(grandeData);

    plotDots(TOP_DRINKS);
    plotDots(CAFFEINE);
}

function getDotWidthForAllDrinks(i) {
    return 2 + 2 * i;
}

function plotAxes(type) {
    let yScale = type == TOP_DRINKS ? ySugarsScale : yCaffeineScale;

    let axesPlot = d3.select(`#${type}-svg-axes`);
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
        .text(type == TOP_DRINKS ? 'SUGARS (g)' : 'CAFFEINE (mg)');
}

// plot

function plotDots(type) {
    plotAllDrinks(type);
    plotTopDrinks(type);
}

function plotAllDrinks(type) {
    if (type == CAFFEINE) {
        return;
    }
    let otherPlot = d3.select(`#${type}-svg-other`);
    otherPlot.selectAll('circle').remove();

    let data = allDrinksSugarsData;
    let yScale = ySugarsScale;

    otherPlot.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .style('fill', '#f2f0eb')
        .attr('r', d => 2 + 2 * d.values.length)
        .attr('cx', d => xScale(d.key.split(',')[1]))
        .attr('cy', d => yScale(d.key.split(',')[0]))
        .exit()
        .remove();
}

function plotTopDrinks(type) {
    let details = d3.select(`#${type}-details`);
    let checkBox = document.getElementById(`${type}-checkbox`);

    let data = type == TOP_DRINKS ? topDrinksSugarsData : allDrinksCaffeineData;
    let yScale = type == TOP_DRINKS ? ySugarsScale : yCaffeineScale;

    let topPlot = d3.select(`#${type}-svg-top`);
    topPlot.selectAll('circle').remove();

    if (type == CAFFEINE || checkBox.checked) {
        topPlot.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'scatter-plot-dots')
            .style('fill', d => type == TOP_DRINKS ? '#006241' : CATEGORIES_COLORS_FOUR[d.key.split(',')[2]])
            .style('opacity', type == TOP_DRINKS ? 0.5 : 0.8)
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
                        .attr('class', 'scatter-plot-details-name')
                        .text(`#${d.values[i].RANK} ${d.values[i].NAME}`);
                    container.append('p')
                        .attr('class', 'scatter-plot-details-others')
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
