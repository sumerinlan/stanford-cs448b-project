import {
    columns,
    CATEGORIES_COLORS,
    CATEGORIES_1,
    CATEGORIES_2
} from './constants.js'
import basicFacts from './basic_facts.js'
import topDrinks from './top_drinks.js'
import temperatureComparator from './temperature_comparator.js'

basicFacts.setup();
topDrinks.setup();
temperatureComparator.setup();

d3.csv('data/starbucks-menu/drink_manual_grande_only.csv', d => {
    var row = {};
    for (const elem in columns) {
        row[elem] = d[columns[elem]];
    }
    return row;
}).then(data => {
    var grandeData = data;
    basicFacts.plot(grandeData);

    var topDrinksData = grandeData.filter(d => d.RANK !== '');
    var topDrinksData = d3.nest()
        .key(d => [d.SUGARS, d.CALORIES])
        .entries(topDrinksData);

    var otherDrinksData = d3.nest()
        .key(d => [d.SUGARS, d.CALORIES])
        .entries(grandeData);

    topDrinks.plotAllDrinks(otherDrinksData);
    topDrinks.plotTopDrinks(topDrinksData);
    temperatureComparator.plot(grandeData);

    // actions

    d3.select('#top-drinks-checkbox').on('click', function() {
        topDrinks.plotTopDrinks(topDrinksData);
    });

    // when the input range changes update value
    d3.select('#facts-keyword').on('input', function() {
        let prefix = this.value.toLowerCase();
        let basicFactsData = grandeData.filter(d => d.CATEGORY1.toLowerCase().indexOf(prefix) !== -1 ||
            d.CATEGORY2.toLowerCase().indexOf(prefix) !== -1 ||
            d.NAME.toLowerCase().indexOf(prefix) !== -1);
        basicFacts.plot(basicFactsData);
    });
});
