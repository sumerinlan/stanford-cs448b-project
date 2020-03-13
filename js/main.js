const columns = {
    RANK: 'Rank',
    CATEGORY1: 'Category1',
    CATEGORY2: 'Category2',
    NAME: 'Name',
    SIZE: 'Size',
    IMAGE: 'Image',
    CALORIES: 'Calories',
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

const CATEGORIES = [
    ['Hot Coffees', ['Americanos', 'Brewed Coffees', 'Cappuccinos', 'Espresso Shots', 'Flat Whites', 'Lattes', 'Macchiatos', 'Mochas', 'Clover® Brewed Coffees', 'Coffee Travelers']],
    ['Hot Teas', ['Chai Teas', 'Black Teas', 'Green Teas', 'Herbal Teas', 'White Teas']],
    ['Hot Drinks', ['Hot Chocolates', 'Juice', 'Steamers', ]],
    ['Frappuccino\xAE Blended Beverages', ['Coffee Frappuccino\xAE', 'Creme Frappuccino\xAE']],
    ['Cold Coffees', ['Cold Brews', 'Iced Americano', 'Iced Coffees', 'Iced Espresso Shots', 'Iced Flat Whites', 'Iced Lattes', 'Iced Macchiatos', 'Iced Mochas', 'Iced Clover® Brewed Coffees']],
    ['Iced Teas', ['Iced Chai Teas', 'Iced Black Teas', 'Iced Green Teas', 'Iced Herbal Teas', 'Iced White Teas', 'Bottled Teas']],
    ['Cold Drinks', ['Iced Coconutmilk Drinks', 'Starbucks Refreshers\u2122', 'Juice', 'Milk', 'Sparkling Water', 'Water']],
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
let topDrinksOuterMargin = topDrinksPlotWidth + 2 * topDrinksPlotMargin;
let topDrinksOuterHeight = topDrinksPlotHeight + 2 * topDrinksPlotMargin;

// scales
let topDrinksXScale = d3.scaleLinear()
    .domain([0, 65])
    .range([0, topDrinksPlotWidth]);
let topDrinksYScale = d3.scaleLinear()
    .domain([0, 500])
    .range([topDrinksPlotHeight, 0]);

setupBasicFacts();

d3.csv('data/starbucks-menu/drink_manual.csv', d => {
    var row = {};
    for (elem in columns) {
        row[elem] = d[columns[elem]];
    }
    return row;
}).then(data => {
    allData = data;

    // size: grande or doppio (for espresso)
    basicFactsData = allData.filter(d => d.SIZE == sizes.GRANDE || d.SIZE == sizes.DOPPIO);
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
});

function setupBasicFacts() {
    let basicFactsTabs = d3.select('#facts-tabs');
    basicFactsTabs.selectAll('div').remove();

    for (const i in CATEGORIES) {
        let category1 = CATEGORIES[i][0];
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
    basicFactsData = allData.filter(d => d.SIZE == sizes.GRANDE || d.SIZE == sizes.DOPPIO);
    basicFactsData = basicFactsData.filter(d => d.CATEGORY1.toLowerCase().indexOf(prefix) !== -1 ||
        d.CATEGORY2.toLowerCase().indexOf(prefix) !== -1 ||
        d.NAME.toLowerCase().indexOf(prefix) !== -1);
    plotBasicFacts();
}

function plotBasicFacts() {
    let basicFacts = d3.select('#facts');
    basicFacts.selectAll('div').remove();

    let widget = d3.select('#facts-widget');

    for (const i in CATEGORIES) {
        let category1 = CATEGORIES[i][0];
        const data = basicFactsData.filter(d => d.CATEGORY1 == category1);
        if (data.length == 0) {
            continue;
        }

        let container1 = basicFacts.append('div')
            .attr('class', 'facts-category1')
            .attr('id', category1);
        // append header
        container1.append('h2').text(category1);

        for (const j in CATEGORIES[i][1]) {
            let category2 = CATEGORIES[i][1][j];
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
        .attr('width', topDrinksOuterMargin)
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

    let axesPlot = d3.select('#top-drinks-svg-top');
    axesPlot.selectAll('circle').remove();

    if (checkBox.checked) {
        axesPlot.selectAll('circle')
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
