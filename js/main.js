const columns = {
    TEMPERATURE: 'Temperature',
    RANK: 'Rank',
    CATEGORY1: 'Category1',
    CATEGORY2: 'Category2',
    NAME: 'Name',
    SHORT_NAME: 'Short Name',
    SIZE: 'Size',
    IMAGE: 'Image',
    CALORIES: 'Calories',
    CALORIES_MODIFIED: 'Calories_Modified',
    TOTAL_FAT: 'Total Fat (g)',
    TRANS_FAT: 'Trans Fat (g)',
    SATURATED_FAT: 'Saturated Fat (g)',
    SODIUM: 'Sodium (mg)',
    TOTAL_CARBOHYDRATES: 'Total Carbohydrates (g)',
    CHOLESTEROL: 'Cholesterol (mg)',
    DIETARY_FIBRE: 'Dietary Fibre (g)',
    SUGARS: 'Sugars (g)',
    CAFFEINE: 'Caffeine (mg)',
}

const sizes = {
    SHORT: 'Short',
    TALL: 'Tall',
    GRANDE: 'Grande',
    VENTI: 'Venti',
    SOLO: 'Solo',
    DOPPIO: 'Doppio',
    TRIPLE: 'Triple',
    QUAD: 'Quad',
}

const milks = {
    NONFAT: 'Nonfat Milk',
    TWO_PERCENT: '2% Milk',
    WHOLE: 'Whole Milk',
    SOYMILK: 'Soymilk',
}

const CATEGORIES_COLORS = {
    // spring
    'Hot Coffees': '#c89543',
    'Hot Teas': '#eed350',
    'Hot Drinks': '#edc4c9',
    'Frappuccino\xAE Blended Beverages': '#b6cbd5',
    'Cold Coffees': '#c0d48b',
    'Iced Teas': '#4c9f87',
    'Cold Drinks': '#005e66'
}

const CATEGORIES_1 = ['Hot Coffees', 'Hot Teas', 'Hot Drinks', 'Frappuccino\xAE Blended Beverages', 'Cold Coffees', 'Iced Teas', 'Cold Drinks'];

const CATEGORIES_2 = [
    [
        ['Americanos', 'Brewed Coffees', 'Cappuccinos', 'Espresso Shots', 'Flat Whites', 'Lattes', 'Macchiatos', 'Mochas', 'Clover® Brewed Coffees', 'Coffee Travelers']
    ],
    [
        ['Chai Teas', 'Black Teas', 'Green Teas', 'Herbal Teas', 'White Teas']
    ],
    [
        ['Hot Chocolates', 'Juice', 'Steamers', ]
    ],
    [
        ['Coffee Frappuccino\xAE', 'Creme Frappuccino\xAE']
    ],
    [
        ['Cold Brews', 'Iced Americano', 'Iced Coffees', 'Iced Espresso Shots', 'Iced Flat Whites', 'Iced Lattes', 'Iced Macchiatos', 'Iced Mochas', 'Iced Clover® Brewed Coffees']
    ],
    [
        ['Iced Chai Teas', 'Iced Black Teas', 'Iced Green Teas', 'Iced Herbal Teas', 'Iced White Teas', 'Bottled Teas']
    ],
    [
        ['Iced Coconutmilk Drinks', 'Starbucks Refreshers\u2122', 'Juice', 'Milk', 'Sparkling Water', 'Water']
    ],
];

// Data
var allData = [];
// section 1
var basicFactsData = [];
// section 3
var topDrinksData = [];
var otherDrinksData = [];

var basicFactsTabActive = 'Hot Coffees';
var prefix = '';

// size
let topDrinksPlotWidth = 600;
let topDrinksPlotHeight = 400;
let topDrinksPlotMargin = 50;
let topDrinksOuterWidth = topDrinksPlotWidth + 2 * topDrinksPlotMargin;
let topDrinksOuterHeight = topDrinksPlotHeight + 2 * topDrinksPlotMargin;

// scales
let topDrinksXScale = d3.scaleLinear()
    .domain([0, 65])
    .range([0, topDrinksPlotWidth]);
let topDrinksYScale = d3.scaleLinear()
    .domain([0, 500])
    .range([topDrinksPlotHeight, 0]);

setupBasicFacts();

d3.csv('data/starbucks-menu/drink_manual_grande_only.csv', d => {
    var row = {};
    for (elem in columns) {
        row[elem] = d[columns[elem]];
    }
    return row;
}).then(data => {
    allData = data;

    // size: grande or doppio (for espresso)
    basicFactsData = allData;
    plotBasicFacts();

    topDrinksData = basicFactsData.filter(d => d.RANK !== '');
    topDrinksData = d3.nest()
        .key(d => [d.SUGARS, d.CALORIES])
        .entries(topDrinksData);

    otherDrinksData = d3.nest()
        .key(d => [d.SUGARS, d.CALORIES])
        .entries(basicFactsData);

    setupTopDrinks();
    plotTopDrinks();
    plotTemperature();
});

function setupBasicFacts() {
    let basicFactsTabs = d3.select('#facts-tabs');
    basicFactsTabs.selectAll('div').remove();

    for (const i in CATEGORIES_1) {
        let category1 = CATEGORIES_1[i];
        basicFactsTabs.append('div')
            // don't display full name for Frappuccino
            .text(category1.indexOf('Frappuccino') !== -1 ? 'Frappuccino' : category1)
            .attr('class', category1 == basicFactsTabActive ? 'basic-facts-tabs-active' : 'basic-facts-tabs')
            .on('click', function() {
                basicFactsTabs.selectAll('div').attr('class', 'basic-facts-tabs');
                basicFactsTabActive = category1;
                d3.select(this).attr('class', 'basic-facts-tabs-active');
                updateBasicFactsTabs();
            });
    }

    basicFactsTabs.append('div')
        .text('All Drinks')
        .attr('class', basicFactsTabActive == null ? 'basic-facts-tabs-active' : 'basic-facts-tabs')
        .on('click', function() {
            basicFactsTabs.selectAll('div').attr('class', 'basic-facts-tabs');
            basicFactsTabActive = null;
            d3.select(this).attr('class', 'basic-facts-tabs-active');
            updateBasicFactsTabs();
        });

    // textfields
    // when the input range changes update value
    d3.select('#facts-keyword').on('input', function() {
        prefix = this.value.toLowerCase();
        updateBasicFactsFilter();
    });
}

function updateBasicFactsTabs() {
    // to prevent reloading data too many times
    d3.selectAll('.facts-category1')
        .each(function() {
            if (basicFactsTabActive == null) {
                d3.select(this).style('display', 'block');
            } else {
                d3.select(this).style('display', d3.select(this).attr('id') == basicFactsTabActive ? 'block' : 'none');
            }
        })
}

function updateBasicFactsFilter() {
    basicFactsData = allData.filter(d => d.CATEGORY1.toLowerCase().indexOf(prefix) !== -1 ||
        d.CATEGORY2.toLowerCase().indexOf(prefix) !== -1 ||
        d.NAME.toLowerCase().indexOf(prefix) !== -1);
    plotBasicFacts();
}

function plotBasicFacts() {
    let basicFacts = d3.select('#facts');
    basicFacts.selectAll('div').remove();

    let widget = d3.select('#facts-widget');

    for (const i in CATEGORIES_1) {
        let category1 = CATEGORIES_1[i];
        const data = basicFactsData.filter(d => d.CATEGORY1 == category1);
        if (data.length == 0) {
            continue;
        }

        let container1 = basicFacts.append('div')
            .attr('class', 'facts-category1')
            .attr('id', category1);
        // append header
        container1.append('h2').text(category1);

        for (const j in CATEGORIES_2[i][0]) {
            let category2 = CATEGORIES_2[i][0][j];
            const data2 = data.filter(d => d.CATEGORY2 == category2);
            if (data2.length == 0) {
                continue;
            }

            let container2 = container1.append('div');
            // append header
            container2.append('h3').text(category2);

            // append images
            let imgWidth = 96;
            for (da of data2) {
                let images = container2.append('svg')
                    .attr('class', 'facts-thumbnail-svg')
                    .attr('width', imgWidth)
                    .attr('height', imgWidth)
                    .append('g')
                    .on('mouseenter', d => {
                        widget.style('display', 'block');
                    })
                    .on('mouseleave', d => {
                        widget.style('display', 'none');
                    })
                    .selectAll('images')
                    .data([da]);

                images.enter()
                    .append('image')
                    .attr('width', imgWidth)
                    .attr('height', imgWidth)
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('xlink:href', d => d.IMAGE)
                    .on('mouseenter', d => {
                        d3.select('#facts-widget-img').attr('src', d.IMAGE);
                        d3.select('#facts-widget-name').html(d.NAME);
                        if (d.CALORIES == null) {
                            d3.select('#facts-widget-calories').html('Not Available');
                            d3.select('#facts-widget-cal-bar').attr('style', `width: 0%;`);
                        } else {
                            d3.select('#facts-widget-calories').html(d.CALORIES);
                            d3.select('#facts-widget-cal-bar').attr('style', `width: ${d.CALORIES / 5}%;`);
                        }
                        if (d.SUGARS == null) {
                            d3.select('#facts-widget-sugars').html('Not Available');
                            d3.select('#facts-widget-sugar-bar').attr('style', `width: 0%;`);
                        } else {
                            d3.select('#facts-widget-sugars').html(d.SUGARS);
                            d3.select('#facts-widget-sugar-bar').attr('style', `width: ${d.SUGARS / 65 * 100}%;`);
                        }
                    })
                    .on('mousemove', d => {
                        let margin = 15;
                        let left = d3.event.pageX + margin;
                        let top = d3.event.pageY + margin;
                        // TODO: fix position
                        // top = Math.min(window.innerHeight - 300 - margin, top);
                        // top = Math.max(0, top);
                        widget.style('left', `${left}px`).style('top', `${top}px`);
                    });

                images.exit().remove();



                // let caption = container2.append('p')
                //     .html("Cold Brew Coffee")
                //     .attr('width', imgWidth)
                //     .attr('height', imgWidth);
            }
        }
    };

    updateBasicFactsTabs();
}

function setupTopDrinks() {
    d3.select('#top-drinks-svg')
        .attr('width', topDrinksOuterWidth)
        .attr('height', topDrinksOuterHeight);

    d3.select('#top-drinks-svg-plot')
        .attr('transform', `translate(${topDrinksPlotMargin},${topDrinksPlotMargin})`);

    d3.select('#top-drinks-svg-other').selectAll('circle')
        .data(otherDrinksData)
        .enter()
        .append('circle')
        .attr('class', 'top-drink-dots-others')
        .attr('r', d => 2 + 2 * d.values.length)
        .attr('cx', d => topDrinksXScale(d.key.split(',')[0]))
        .attr('cy', d => topDrinksYScale(d.key.split(',')[1]))
        .exit()
        .remove();

    // axes

    let axesPlot = d3.select('#top-drinks-svg-axes');

    axesPlot.append('g')
        .attr('transform', `translate(0,${topDrinksPlotHeight})`)
        .call(d3.axisBottom(topDrinksXScale));
    axesPlot.append('g')
        .call(d3.axisLeft(topDrinksYScale));

    axesPlot.append('text')
        .attr('transform', `translate(${topDrinksPlotWidth/2}, ${topDrinksPlotHeight + 35})`)
        .style('text-anchor', 'middle')
        .text('CALORIES');

    axesPlot.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - topDrinksPlotMargin)
        .attr('x', 0 - (topDrinksPlotHeight / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('SUGARS');

    // TODO Legend
}

function plotTopDrinks() {
    let details = d3.select('#top-drinks-details');
    let checkBox = document.getElementById('top-drinks-checkbox');

    let topPlot = d3.select('#top-drinks-svg-top');
    topPlot.selectAll('circle').remove();

    if (checkBox.checked) {
        topPlot.selectAll('circle')
            .data(topDrinksData)
            .enter()
            .append('circle')
            .attr('class', 'top-drink-dots')
            .attr('r', d => 1 + 2 * d.values.length)
            .attr('cx', d => topDrinksXScale(d.key.split(',')[0]))
            .attr('cy', d => topDrinksYScale(d.key.split(',')[1]))
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

function plotTemperature() {
    let plotWidth = 560;
    let plotHeight = 600;
    let plotMargin = 40;
    let barMargin = 10;
    let barHeight = 3;
    let sideWidth = 400;
    let outerWidth = plotWidth + sideWidth + 2.5 * plotMargin;
    let outerHeight = plotHeight + 2 * plotMargin;
    let legendHeight = 24;

    let tempYScale = d3.scaleLinear()
        .domain([0, 500])
        .range([plotHeight, 0]);

    let tempXScale = d3.scaleOrdinal()
        .range([0, plotWidth]);

    d3.select('#temp-svg')
        .attr('width', outerWidth)
        .attr('height', outerHeight);

    d3.select('#temp-svg-plot')
        .attr('transform', `translate(${plotMargin}, ${plotMargin})`);

    d3.select('#temp-svg-text-container')
        .attr('transform', `translate(${plotMargin * 1.5 + plotWidth}, ${plotMargin})`);

    let widget = d3.select('#temp-widget');

    let legendPlot = d3.select('#temp-svg-legend')
        .attr('transform', `translate(0, 0)`);

    let axesPlot = d3.select('#temp-svg-axes');

    // axes

    // y-axis
    // Reference: https://observablehq.com/@d3/styled-axes
    axesPlot.append('g')
        .attr('class', 'temp-svg-axes')
        .call(d3.axisRight(tempYScale)
            .tickSize(plotWidth))
        .call(g => g.select('.domain')
            .remove())
        .call(g => g.selectAll('.tick:not(:first-of-type) line')
            .attr('stroke-dasharray', '2,2'))
        .call(g => g.selectAll('.tick text')
            .attr('class', 'temp-svg-axes-text-small')
            .attr('x', -4)
            .attr('dy', -4));

    axesPlot.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - plotMargin)
        .attr('x', 0 - (plotHeight / 2))
        .attr('dy', '1rem')
        .attr('class', 'temp-svg-axes-text')
        .text('CALORIES');

    for (const i in CATEGORIES_1) {
        let category1 = CATEGORIES_1[i];

        axesPlot.append('text')
            .attr('transform', `translate(${plotWidth / 14 + i * plotWidth / 7}, ${plotHeight + 20})`)
            .attr('class', 'temp-svg-axes-text-small')
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
            .attr('class', 'temp-svg-axes-text-small')
            .style('text-anchor', 'start');
    }

    axesPlot.append('line')
        .attr('x1', plotWidth / 7 * 3)
        .attr('y1', - plotMargin / 2)
        .attr('x2', plotWidth / 7 * 3)
        .attr('y2', plotHeight)
        .attr('class', 'temp-svg-axes')
        .style('stroke-width', 1);

    axesPlot.append('text')
        .attr('transform', `translate(${plotWidth / 14 * 3}, -10)`)
        .attr('class', 'temp-svg-axes-text')
        .text('Hot');

    axesPlot.append('text')
        .attr('transform', `translate(${plotWidth / 7 * 5}, -10)`)
        .attr('class', 'temp-svg-axes-text')
        .text('Cold');

    // text info

    d3.select('#temp-svg-text-this');
    d3.select('#temp-svg-text-small-this')
        .attr('transform', `translate(0, 20)`);
    d3.select('#temp-svg-text-other')
        .attr('transform', `translate(0, 60)`);
    d3.select('#temp-svg-text-small-other')
        .attr('transform', `translate(0, 80)`);

    // plot
    let mainPlot = d3.select('#temp-svg-main');
    mainPlot.selectAll('rect')
        .data(allData)
        .enter()
        .append('rect')
        .attr('class', 'temp-dot')
        .attr('x', d => CATEGORIES_1.indexOf(d.CATEGORY1) * plotWidth / 7 + barMargin)
        .attr('y', d => tempYScale(d.CALORIES_MODIFIED) - barMargin)
        .attr('width', plotWidth / 7 - 2 * barMargin)
        .attr('height', barHeight)
        .style('fill', d => CATEGORIES_COLORS[d.CATEGORY1])
        .on('mouseenter', d => {
            let margin = 15;
            let left = d3.event.pageX + margin;
            let top = d3.event.pageY + margin;
            // TODO: fix position
            widget.style('left', `${left}px`).style('top', `${top}px`);
            widget.style('display', 'block');
            d3.select('#temp-widget-img').attr('src', d.IMAGE);
            d3.select('#temp-widget-name').html(d.NAME);
        })
        .on('mouseleave', d => {
            widget.style('display', 'none');
        })
        .on('click', d => {
            let hasPair = d.SHORT_NAME !== '';
            if (hasPair) {
                d3.select('#temp-svg-text-this').text(`(${d.TEMPERATURE}) ${d.SHORT_NAME}`);
                d3.select('#temp-svg-text-small-this').text(`Calories: ${d.CALORIES}`);

                d3.select('#temp-svg-main').selectAll('.temp-dot')
                    .each(function() {
                        if (d3.select(this).data()[0].SHORT_NAME == d.SHORT_NAME) {
                            d3.select(this).classed('temp-dot-highlight', true);
                            if (d3.select(this).data()[0].TEMPERATURE != d.TEMPERATURE) {
                                d3.select('#temp-svg-text-other').text(`(${d3.select(this).data()[0].TEMPERATURE}) ${d3.select(this).data()[0].SHORT_NAME}`);
                                d3.select('#temp-svg-text-small-other').text(`Calories: ${d3.select(this).data()[0].CALORIES}`);
                            }
                        } else {
                            d3.select(this).classed('temp-dot-highlight', false);
                        }
                    })
            } else {
                d3.select('#temp-svg-text-this').text(d.NAME);
                d3.select('#temp-svg-text-small-this').text(`Calories: ${d.CALORIES}`);

                let tempOther = d.TEMPERATURE === 'Hot' ? 'cold' : 'hot';
                d3.select('#temp-svg-text-other').text(`Corresponding ${tempOther} option not available`);
                d3.select('#temp-svg-text-small-other').text('');

                d3.select('#temp-svg-main').selectAll('.temp-dot')
                    .each(function() {
                        d3.select(this).classed('temp-dot-highlight', d3.select(this).data()[0].NAME == d.NAME);
                    });
            }
        });
}
