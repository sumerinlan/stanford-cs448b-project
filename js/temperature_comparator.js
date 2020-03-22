import {
    CATEGORIES_COLORS,
    CATEGORIES_1
} from './constants.js'

// sizes

let plotWidth = 560;
let plotHeight = 600;
let plotMargin = 40;
let barMargin = 10;
let barHeight = 3;
let sideWidth = 400;
let outerWidth = plotWidth + sideWidth + 2.5 * plotMargin; // 0.5 margin between two plots
let outerHeight = plotHeight + 2 * plotMargin;

let sidebarTextHeight = 10;
let legendHeight = 24;

// scales

let yScale = d3.scaleLinear()
    .domain([0, 500]) // 500: max calories for grande size
    .range([plotHeight, 0]);

let xScale = d3.scaleOrdinal()
    .range([0, plotWidth]);

function setup() {

    // setups

    d3.select('#temp-svg')
        .attr('width', outerWidth)
        .attr('height', outerHeight);

    d3.select('#temp-svg-plot')
        .attr('transform', `translate(${plotMargin}, ${plotMargin})`);

    d3.select('#temp-svg-side')
        .attr('transform', `translate(${plotMargin * 1.5 + plotWidth}, ${plotMargin})`);

    let legendPlot = d3.select('#temp-svg-legend');

    // axes

    let axesPlot = d3.select('#temp-svg-axes');

    // y axis
    // Reference: https://observablehq.com/@d3/styled-axes
    axesPlot.append('g')
        .attr('class', 'temp-svg-axes')
        .call(d3.axisRight(yScale)
            .tickSize(plotWidth))
        .call(g => g.select('.domain')
            .remove()) // no line for y axis
        .call(g => g.selectAll('.tick:not(:first-of-type) line')
            .attr('stroke-dasharray', '2,2'))
        .call(g => g.selectAll('.tick text')
            .attr('class', 'legend-small')
            .attr('x', -4)
            .attr('dy', -4));

    axesPlot.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -plotMargin)
        .attr('x', -plotHeight / 2)
        .attr('dy', '0.5rem')
        .attr('class', 'legend')
        .text('CALORIES');

    for (const i in CATEGORIES_1) {
        let category1 = CATEGORIES_1[i];

        // x axis
        axesPlot.append('text')
            .attr('transform', `translate(${plotWidth * (1 + 2 * i) / 14}, ${plotHeight + 20})`)
            .attr('class', 'legend-small')
            // don't display full name for Frappuccino
            .text(category1.indexOf('Frappuccino') !== -1 ? 'Frappuccino' : category1);

        // legends

        legendPlot.append('rect')
            .attr('x', 0)
            .attr('y', plotHeight - legendHeight * (7 - i))
            .attr('width', legendHeight * 0.8)
            .attr('height', legendHeight * 0.8)
            .style('fill', CATEGORIES_COLORS[category1]);

        legendPlot.append('text')
            .text(category1)
            .attr('x', legendHeight * 1.2)
            .attr('y', plotHeight - legendHeight * (7 - i) + legendHeight * 0.6)
            .attr('class', 'legend-small')
            .style('text-anchor', 'start');
    }

    axesPlot.append('line')
        .attr('x1', plotWidth / 7 * 3)
        .attr('y1', -plotMargin / 2)
        .attr('x2', plotWidth / 7 * 3)
        .attr('y2', plotHeight)
        .attr('class', 'temp-svg-axes')
        .style('stroke-width', 1);

    axesPlot.append('text')
        .attr('transform', `translate(${plotWidth / 14 * 3}, -10)`)
        .attr('class', 'legend')
        .text('Hot');

    axesPlot.append('text')
        .attr('transform', `translate(${plotWidth / 7 * 5}, -10)`)
        .attr('class', 'legend')
        .text('Cold');

    // text info

    d3.select('#temp-svg-text-this');
    d3.select('#temp-svg-rect-this')
        .attr('transform', `translate(0, ${sidebarTextHeight})`)
        .attr('height', sidebarTextHeight);
    d3.select('#temp-svg-text-small-this')
        .attr('transform', `translate(0, ${2 * sidebarTextHeight})`);
    d3.select('#temp-svg-text-other')
        .attr('transform', `translate(0, ${6 * sidebarTextHeight})`);
    d3.select('#temp-svg-rect-other')
        .attr('transform', `translate(0, ${7 * sidebarTextHeight})`)
        .attr('height', sidebarTextHeight);
    d3.select('#temp-svg-text-small-other')
        .attr('transform', `translate(0, ${8 * sidebarTextHeight})`);

    d3.select('#temp-svg-bg')
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', plotWidth)
        .attr('height', plotHeight)
        .style('fill', 'white')
        .on('mouseover', function() {

            // reset information
            d3.select('#temp-svg-text-this').text('');
            d3.select('#temp-svg-text-other').text('');
            d3.select('#temp-svg-text-small-this').text('').attr('x', 0);
            d3.select('#temp-svg-text-small-other').text('').attr('x', 0);
            d3.select('#temp-svg-rect-this').attr('width', 0);
            d3.select('#temp-svg-rect-other').attr('width', 0);

            setBarActive('', '');
        });
}

function plot(data) {
    let mainPlot = d3.select('#temp-svg-main');

    mainPlot.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'temp-dot')
        .attr('x', d => plotWidth * CATEGORIES_1.indexOf(d.CATEGORY1) / 7 + barMargin)
        .attr('y', d => yScale(d.CALORIES_MODIFIED) - barHeight)
        .attr('width', plotWidth / 7 - 2 * barMargin)
        .attr('height', barHeight)
        .style('fill', d => CATEGORIES_COLORS[d.CATEGORY1])
        .on('mouseover', d => {

            // display text information
            let tempOther = d.TEMPERATURE === 'Hot' ? 'cold' : 'hot';
            d3.select('#temp-svg-text-this').text(d.NAME);
            plotCalories('#temp-svg-rect-this', '#temp-svg-text-small-this', d.CALORIES);

            if (d.SHORT_NAME !== '') {
                d3.select('#temp-svg-text-other')
                    .text(`Corresponding ${tempOther} option:`)
                    .style('fill', '#000000');

                d3.select('#temp-svg-main').selectAll('.temp-dot')
                    .each(function() {
                        if (d3.select(this).data()[0].SHORT_NAME == d.SHORT_NAME && d3.select(this).data()[0].TEMPERATURE != d.TEMPERATURE) {
                            plotCalories('#temp-svg-rect-other', '#temp-svg-text-small-other', d3.select(this).data()[0].CALORIES);
                        }
                    })
            } else {
                d3.select('#temp-svg-text-other')
                    .text(`Corresponding ${tempOther} option not available`)
                    .style('fill', '#999999');
                // reset information
                d3.select('#temp-svg-text-small-other').text('').attr('x', 0);
                d3.select('#temp-svg-rect-other').attr('width', 0);
            }

            // highlight
            setBarActive(d.SHORT_NAME, d.NAME);
        });
}

function setBarActive(shortName, name) {
    if (shortName === '') {
        if (name === '') {
            d3.select('#temp-svg-main').selectAll('.temp-dot')
                .each(function() {
                    d3.select(this).classed('temp-dot-muted', false);
                });
        } else {
            d3.select('#temp-svg-main').selectAll('.temp-dot')
                .each(function() {
                    d3.select(this).classed('temp-dot-muted', d3.select(this).data()[0].NAME != name);
                });
        }
    } else {
        d3.select('#temp-svg-main').selectAll('.temp-dot')
            .each(function() {
                d3.select(this).classed('temp-dot-muted', d3.select(this).data()[0].SHORT_NAME != shortName);
            });
    }
}

function plotCalories(rectId, textId, calories) {
    let width = calories / 500 * sideWidth * 0.8;
    d3.select(rectId)
        .transition(d3.transition().duration(0))
        .attr('width', width);
    d3.select(textId)
        .transition(d3.transition().duration(0))
        .attr('x', width + 10)
        .text(`${calories}`);
}

export default {
    setup,
    plot
}
