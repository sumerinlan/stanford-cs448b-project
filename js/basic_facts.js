import {
    CATEGORIES_1,
    CATEGORIES_2
} from './constants.js'

var activeTab = 'Hot Coffees';

function setup() {
    let tabs = d3.select('#facts-tabs');
    tabs.selectAll('div').remove();

    for (const i in CATEGORIES_1) {
        let category1 = CATEGORIES_1[i];
        // tab for one category
        tabs.append('div')
            // don't display full name for Frappuccino
            .text(category1.indexOf('Frappuccino') !== -1 ? 'Frappuccino' : category1)
            .classed('active', category1 == activeTab)
            .on('click', function() {
                tabs.selectAll('div').classed('active', false);
                activeTab = category1;
                d3.select(this).classed('active', true);
                updateTabs();
            });
    }

    // tab for all categories
    tabs.append('div')
        .text('All Drinks')
        .classed('active', activeTab == null)
        .on('click', function() {
            tabs.selectAll('div').classed('active', false);
            activeTab = null;
            d3.select(this).classed('active', true);
            updateTabs();
        });
}

function updateTabs() {
    // change 'display' to prevent reloading data too many times
    d3.selectAll('.facts-category1')
        .each(function() {
            if (activeTab == null) {
                d3.select(this).style('display', 'block');
            } else {
                d3.select(this).style('display', d3.select(this).attr('id') == activeTab ? 'block' : 'none');
            }
        })
}

function plot(data) {
    let basicFacts = d3.select('#facts');
    basicFacts.selectAll('div').remove();

    let widget = d3.select('#facts-widget');

    for (const i in CATEGORIES_1) {
        let category1 = CATEGORIES_1[i];
        let data1 = data.filter(d => d.CATEGORY1 == category1);
        if (data1.length == 0) {
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
            for (const da of data2) {
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

    updateTabs();
}

export default {
    setup,
    plot
}
