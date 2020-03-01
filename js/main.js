var columns = {
    BEVERAGE_CATEGORY: 'Beverage_category',
    BEVERAGE: 'Beverage',
    IMAGE: 'Image',
    BEVERAGE_PREP: 'Beverage_prep',
    BEVERAGE_PREP_SIZE: 'Beverage_prep_size',
    BEVERAGE_PREP_MILK: 'Beverage_prep_milk',
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

// Data
var allData = [];

d3.csv('data/starbucks-menu/drink_converted.csv', d => {
    var row = {};
    for (elem in columns) {
        row[elem] = d[columns[elem]];
    }
    return row;
}).then(data => {
    allData = data;
    test();
});

function test() {
    d3.select('#test').data(allData).enter().append('p').text(d => d.BEVERAGE).exit().remove();
}
