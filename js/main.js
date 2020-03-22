import {
    columns,
    CATEGORIES_COLORS,
    CATEGORIES_1,
    CATEGORIES_2
} from './constants.js'
import basicFacts from './basic_facts.js'
import topDrinks from './top_drinks.js'
import temperatureComparator from './temperature_comparator.js'
import foodRecommender from './recommender.js'
import donutChart from './donut_chart.js'

basicFacts.setup();
topDrinks.setup();
temperatureComparator.setup();
foodRecommender.setup();

d3.csv('data/starbucks-menu/drink_manual_grande_only.csv', d => {
    var row = {};
    for (const elem in columns) {
        row[elem] = d[columns[elem]];
    }
    return row;
}).then(drinkData => {
    d3.csv('data/starbucks-menu/food_manual.csv', d => {
        var row = {};
        for (const elem in columns) {
            row[elem] = d[columns[elem]];
        }
        return row;
    }).then(foodData => {
        // plot: food recommender
        foodRecommender.passData(drinkData, foodData);

        // plot: donut charts
        donutChart.passData(drinkData, foodData);
    });

    // plot: basic facts
    basicFacts.plot(drinkData);

    // plot: top drinks & caffeine
    topDrinks.passData(drinkData);

    // plot: temperature
    temperatureComparator.plot(drinkData);

    // actions

    // when the input range changes update value
    d3.select('#facts-keyword').on('input', function() {
        let prefix = this.value.toLowerCase();
        let basicFactsData = drinkData.filter(d => d.CATEGORY1.toLowerCase().indexOf(prefix) !== -1 ||
            d.CATEGORY2.toLowerCase().indexOf(prefix) !== -1 ||
            d.NAME.toLowerCase().indexOf(prefix) !== -1);
        basicFacts.plot(basicFactsData);
    });
});
