// size

let plotWidth = 600;
let plotHeight = 400;
let plotMargin = 50;
let outerWidth = plotWidth + 2 * plotMargin;
let outerHeight = plotHeight + 2 * plotMargin;

let legendMargin = 4;
let legendHeight = 12;
let legendWidth = 80;

// scales

let xScale = d3.scaleLinear()
    .domain([0, 65]) // 500: max sugars for grande size
    .range([0, plotWidth]);

let yScale = d3.scaleLinear()
    .domain([0, 500]) // 500: max calories for grande size
    .range([plotHeight, 0]);

function setup(otherDrinksData) {

    // setups

    d3.select('#top-drinks-svg')
        .attr('width', outerWidth)
        .attr('height', outerHeight);

    d3.select('#top-drinks-svg-plot')
        .attr('transform', `translate(${plotMargin}, ${plotMargin})`);

    // axes

    let axesPlot = d3.select('#top-drinks-svg-axes');

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
        .text('SUGARS');

    // TODO Legend

    let legendPlot = d3.select('#top-drinks-svg-legend')
        .attr('transform', `translate(${legendMargin}, ${legendMargin})`);

    // all drinks

    legendPlot.append('text')
        .text('All Drinks')
        .attr('class', 'top-drink-legend')
        .style('text-anchor', 'start')
        .attr('x', legendMargin)
        .attr('y', legendHeight / 2);

    var top = legendHeight + legendMargin;
    for (const i of [1, 3, 5, 7, 9]) {
        let lineHeight = Math.max(legendHeight, getDotWidthForAllDrinks(i) * 2);

        legendPlot.append('circle')
            .style('fill', '#f2f0eb')
            .attr('cx', getDotWidthForAllDrinks(9) + legendMargin)
            .attr('cy', top + lineHeight / 2)
            .attr('r', getDotWidthForAllDrinks(i));

        legendPlot.append('text')
            .text(i)
            .attr('class', 'top-drink-legend')
            .attr('x', getDotWidthForAllDrinks(9) * 2 + legendMargin * 3)
            .attr('y', top + lineHeight / 2);
        top += lineHeight + legendMargin;
    }

    // top drinks

    legendPlot.append('text')
        .text('Top Drinks')
        .attr('class', 'top-drink-legend')
        .style('text-anchor', 'start')
        .attr('x', legendMargin + legendWidth)
        .attr('y', legendHeight / 2);

    top = legendHeight + legendMargin;
    for (const i of [1, 2, 3, 4]) {
        let lineHeight = Math.max(legendHeight, getDotWidthForAllDrinks(i) * 2);

        legendPlot.append('circle')
            .style('fill', '#006241')
            .attr('cx', getDotWidthForAllDrinks(9) + legendWidth + legendMargin)
            .attr('cy', top + lineHeight / 2)
            .attr('r', getDotWidthForAllDrinks(i));

        legendPlot.append('text')
            .text(i)
            .attr('class', 'top-drink-legend')
            .attr('x', getDotWidthForAllDrinks(9) * 2 + legendWidth + legendMargin * 3)
            .attr('y', top + lineHeight / 2);
        top += lineHeight + legendMargin;
    }
}

function getDotWidthForAllDrinks(i) {
    return 2 + 2 * i;
}

function plotAllDrinks(data) {
    d3.select('#top-drinks-svg-other').selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'top-drink-dots-others')
        .attr('r', d => 2 + 2 * d.values.length)
        .attr('cx', d => xScale(d.key.split(',')[0]))
        .attr('cy', d => yScale(d.key.split(',')[1]))
        .exit()
        .remove();
}

function plotTopDrinks(data) {
    let details = d3.select('#top-drinks-details');
    let checkBox = document.getElementById('top-drinks-checkbox');

    let topPlot = d3.select('#top-drinks-svg-top');
    topPlot.selectAll('circle').remove();

    if (checkBox.checked) {
        topPlot.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'top-drink-dots')
            .attr('r', d => 1 + 2 * d.values.length)
            .attr('cx', d => xScale(d.key.split(',')[0]))
            .attr('cy', d => yScale(d.key.split(',')[1]))
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
    plotAllDrinks,
    plotTopDrinks
}
