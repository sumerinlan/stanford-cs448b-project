const columns = {
    BEVERAGE_CATEGORY: 'Beverage_category',
    BEVERAGE: 'Beverage',
    NOTES: 'Notes',
    IMAGE: 'Image',
    BEVERAGE_PREP_SIZE: 'Beverage_prep_size',
    BEVERAGE_PREP_MILK: 'Beverage_prep_milk',
    IS_DEFAULT: 'Is_default',
    CALORIES: 'Calories',
    TOTAL_FAT: 'Total Fat (g)',
    TRANS_FAT: 'Trans Fat (g)',
    SATURATED_FAT: 'Saturated Fat (g)',
    SODIUM: 'Sodium (mg)',
    TOTAL_CARBOHYDRATES: 'Total Carbohydrates (g)',
    CHOLESTEROL: 'Cholesterol (mg)',
    DIETARY_FIBRE: 'Dietary Fibre (g)',
    SUGARS: 'Sugars (g)',
    VITAMIN_A: 'Vitamin A (% DV)',
    VITAMIN_C: 'Vitamin C (% DV)',
    CALCIUM: 'Calcium (% DV)',
    CAFFEINE: 'Caffeine (mg)',
}

const sizes = {
    SHORT: 'Short',
    TALL: 'Tall',
    GRANDE: 'Grande',
    VENTI: 'Venti',
    SOLO: 'Solo',
    DOPPIO: 'Doppio',
}

const milks = {
    NONFAT: 'Nonfat Milk',
    TWO_PERCENT: '2% Milk',
    WHOLE: 'Whole Milk',
    SOYMILK: 'Soymilk',
}

var beverageCategories = [];

// Data
var allData = [];
var filteredData = [];

initializeBasicFacts();

d3.csv('data/starbucks-menu/drink_converted.csv', d => {
    var row = {};
    for (elem in columns) {
        row[elem] = d[columns[elem]];
    }
    if (!beverageCategories.includes(row.BEVERAGE_CATEGORY)) {
        beverageCategories.push(row.BEVERAGE_CATEGORY);
    }
    return row;
}).then(data => {
    allData = data;
    filteredData = allData;
    plotBasicFacts();
});

function initializeBasicFacts() {
    // textfields
    // when the input range changes update value
    d3.select('#facts-keyword').on('input', function() {
        prefix = this.value.toLowerCase();
        updateBasicFactsFilter();
    });
}

function updateBasicFactsFilter() {
    filteredData = allData.filter(d => d.BEVERAGE_CATEGORY.toLowerCase().indexOf(prefix) !== -1 || d.BEVERAGE.toLowerCase().indexOf(prefix) !== -1);
    plotBasicFacts();
}

function plotBasicFacts() {
    let basicFacts = d3.select('#facts');
    basicFacts.selectAll('div').remove();

    let widget = d3.select('#facts-widget');

    for (const category of beverageCategories) {
        // showing data with default options
        // TODO: use better filter
        const data = filteredData.filter(d => d.BEVERAGE_CATEGORY == category)
            .filter(d => d.IS_DEFAULT);
        // size: grande or solo (for espresso)
        // tempData = data.filter(d => d.BEVERAGE_PREP_SIZE == sizes.GRANDE || d.BEVERAGE_PREP_SIZE == sizes.SOLO);
        // milk: 2%, whole milk (for frappuccino), nonfat (for drink) or solo (for espresso)
        // var data = data.filter(d => d.BEVERAGE_PREP_MILK == milks.TWO_PERCENT || d.BEVERAGE_PREP_MILK == milks.WHOLE || d.BEVERAGE_PREP_MILK === '');
        if (data.length == 0) {
            continue;
        }

        let container = basicFacts.append('div');
        // append header
        container.append('h2').text(category);

        // append images
        let imgWidth = 96;
        for (da of data) {
            let images = container.append('svg')
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
                    d3.select('#facts-widget-name').html(d.BEVERAGE);
                    d3.select('#facts-widget-notes').html(d.NOTES);
                    d3.select('#facts-widget-calories').html(d.CALORIES);
                    d3.select('#facts-widget-sugars').html(d.SUGARS);
                    d3.select('#facts-widget-caffeine').html(d.CAFFEINE);
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
        }
    };
}
