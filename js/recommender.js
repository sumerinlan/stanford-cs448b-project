import {
    columns,
    CATEGORIES_1,
    CATEGORIES_2
} from './constants.js'

var currentCategory = 'Hot Coffees'; // active categories
var currentSize = ''; //
var drinkImages = [];
var foodImages = [];

var drinkImageIdx = 2;
var foodImageIdx = 2;
var drinkIdx = 1;
var foodIdx = 1;

// sizes
let imgMargin = 10;
let imgSmall = 100;
let imgMedium = 150;
let imgLarge = 250;
let plotWidth = imgLarge + imgMargin * 2;
let plotHeight = imgLarge + imgMedium * 2 + imgMargin * 4;

// data
var drinkData = []; // all drink data
var drinkCurrent = []; // drink data for current category
var foodAll = []; // all food data
var foodCurrent = []; // food data based on current drink
var drinkSize = []; // size information for drinks

function setup() {
    let tabs = d3.select('#recommender-drink-category');
    tabs.selectAll('div').remove();

    for (const i in CATEGORIES_1) {
        let category1 = CATEGORIES_1[i];
        // tab for one category
        tabs.append('div')
            // don't display full name for Frappuccino
            .html(category1.indexOf('Frappuccino') !== -1 ? 'Frappuccino' : category1)
            .classed('active', category1 == currentCategory)
            .on('click', function() {
                currentCategory = category1;
                tabs.selectAll('div').classed('active', false);
                d3.select(this).classed('active', true);
                setDrinkData();
            });
    }

    d3.select('#recommender-drink-svg')
        .attr('width', plotWidth)
        .attr('height', plotHeight);

    d3.select('#recommender-food-svg')
        .attr('width', plotWidth)
        .attr('height', plotHeight);

    for (const i in [0, 1, 2, 3, 4]) {
        drinkImages.push(d3.select('#recommender-drink-plot').append('image'));
        foodImages.push(d3.select('#recommender-food-plot').append('image'));
    }

    d3.json('data/starbucks-menu/drink_manual_by_size.json').then(data => {
        drinkSize = data;
    });

    d3.csv('data/starbucks-menu/food_manual.csv', d => {
        var row = {};
        for (const elem in columns) {
            row[elem] = d[columns[elem]];
        }
        return row;
    }).then(data => {
        foodAll = data;
    });
}

function plot(allData) {
    drinkData = allData;
    setDrinkData();
}

/*
 *  Set drink data based on current category
 */
function setDrinkData() {
    drinkImageIdx = 2;
    drinkIdx = 1;
    drinkCurrent = drinkData.filter(d => d.CATEGORY1 === currentCategory);
    setImages(0, true);
}

/*
 *  Set food data based on current drink selection
 */
function setFoodData(drinkCalories = 0) {
    foodImageIdx = 2;
    foodIdx = 1;
    foodCurrent = foodAll.filter(d => parseInt(d.CALORIES) + drinkCalories <= 500);
    setImages(0, false);
}

// helpers
function idxMod5(idx, offset) {
    var res = idx + offset;
    if (offset < 0) {
        res += 5;
    }
    return res % 5;
}

/*
 *  Set images and events for drink (left) and food (right)
 */
function setImages(duration, isDrink) {
    let transition = d3.transition().duration(duration);

    let images = isDrink ? drinkImages : foodImages;
    let imageIdx = isDrink ? drinkImageIdx : foodImageIdx;
    let idx = isDrink ? drinkIdx : foodIdx;
    let current = isDrink ? drinkCurrent : foodCurrent;

    let opacities = [0, 0.5, 1, 0.5, 0];
    let sizes = [imgSmall, imgMedium, imgLarge, imgMedium, imgSmall];
    let xs = [
        imgMargin + imgLarge / 2 - imgSmall / 2,
        imgMargin + imgLarge / 2 - imgMedium / 2,
        imgMargin,
        imgMargin + imgLarge / 2 - imgMedium / 2,
        imgMargin + imgLarge / 2 - imgSmall / 2,
    ];
    let ys = [
        -imgSmall / 2,
        imgMargin,
        imgMedium + imgMargin * 2,
        plotHeight - imgMedium - imgMargin,
        plotHeight - imgSmall / 2,
    ];

    // image positions
    for (const i of [0, 1, 2, 3, 4]) {
        images[idxMod5(imageIdx, i - 2)]
            .on('mouseenter', function() {
                d3.select(this).style('opacity', 0 < i && i < 4 ? 1 : 0);
            })
            .on('mouseleave', function() {
                d3.select(this).style('opacity', opacities[i]);
            })
            .on('click', () => {})
            .transition(transition)
            .attr('width', sizes[i])
            .attr('height', sizes[i])
            .attr('x', xs[i])
            .attr('y', ys[i])
            .style('opacity', opacities[i]);
    }

    // events

    images[(imageIdx + 4) % 5].on('click', function() {
        if (idx > 0) {
            if (isDrink) {
                drinkImageIdx = (drinkImageIdx + 4) % 5;
                drinkIdx -= 1;
            } else {
                foodImageIdx = (foodImageIdx + 4) % 5;
                foodIdx -= 1;
            }
            setImages(400, isDrink);
        }
    });

    images[(imageIdx + 1) % 5].on('click', function() {
        if (idx + 1 < current.length) {
            if (isDrink) {
                drinkIdx += 1;
                drinkImageIdx = (drinkImageIdx + 1) % 5;
            } else {
                foodIdx += 1;
                foodImageIdx = (foodImageIdx + 1) % 5;
            }
            setImages(400, isDrink);
        }
    });

    // image sources
    for (const i of [0, 1, 2, 3, 4]) {
        images[idxMod5(imageIdx, i - 2)].attr('xlink:href', 0 <= idx + i - 2 && idx + i - 2 < current.length ? current[idx + i - 2].IMAGE : '');
    }

    d3.select(isDrink ? '#recommender-drink-text' : '#recommender-food-text').text(current[idx].NAME);

    if (isDrink) {
        let sizeContainer = d3.select('#recommender-drink-size');
        sizeContainer.selectAll('div').remove();
        let name = drinkCurrent[drinkIdx].NAME;
        currentSize = Object.keys(drinkSize[name])[0];

        for (const size in drinkSize[name]) {
            sizeContainer.append('div')
                .html(size)
                .classed('active', size == currentSize)
                .on('click', function() {
                    sizeContainer.selectAll('div').classed('active', false);
                    d3.select(this).classed('active', true);
                    currentSize = size;
                    setDrinkSize();
                });
        }
        setDrinkSize();
    } else {
        d3.select('#recommender-food-calories').html(current[idx].CALORIES);
    }
}

function setDrinkSize() {
    let drinkCalories = drinkSize[drinkCurrent[drinkIdx].NAME][currentSize];
    d3.select('#recommender-drink-calories').html(drinkCalories);
    if (foodAll != []) {
        setFoodData(drinkCalories);
    }
}

export default {
    setup,
    plot
}
