// https://observablehq.com/d/fd9ee9f86bb53e5d@646
export default function define(runtime, observer) {
    const main = runtime.module();
    main.variable(observer()).define(["md"], function(md) {
        return (
            md ``
        )
    });
    main.variable(observer("chart")).define("chart", ["d3", "DOM", "width", "height", "xAxis", "data", "y", "x", "color", "legend"], function(d3, DOM, width, height, xAxis, data, y, x, color, legend) {
        // const svg = d3.select(DOM.svg(width, height));
        const svg = d3.select('#extreme-calories-svg');


        svg.append("g")
            .call(xAxis);

        const g = svg.append("g")
            .attr("text-anchor", "end")
            .style("font", "10px sans-serif")
            .selectAll("g")
            .data(data)
            .join("g")
            .attr("transform", (d, i) => `translate(0,${y(data.names[i])})`);

        g.append("line")
            .attr("stroke", "#aaa")
            .attr("x1", d => x(d3.min(d)))
            .attr("x2", d => x(d3.max(d)));


        g.append("text")
            .attr("dy", "0.35em")
            .attr("x", d => x(d[d.length - 1]) + 40) // [d.length -1] +22
            .text((d, i) => data.names[i]);


        



        g.append("g")
            .selectAll("circle")
            .data(d => d)
            .join("circle")
            .attr("cx", d => x(d))
            .attr("fill", (d, i) => color(data.keys[i]))
            .attr("r", 4.5)
            .attr("class", "calories-circle")//append class for animation
            .on('mouseenter', (d, i) => {
                d3.select('#calories-widget-img').attr('src', data.images[i] );
                d3.select('#calories-widget-main').style('display', 'block');
                d3.select('#calories-widget-text').html(d);//entering with text 
                console.log("mouse entered! " + d +", image source: " + data.images[i]);

            })
            .on('mouseover', function () {
                d3.select(this).transition()
                    .delay(0)
                    .duration(750)
                    .attr("r", 8);
            })
            .on('mousemove', d =>{
                let offset = 10;
                let left = d3.event.pageX + offset;
                let top = d3.event.pageY + offset;
                d3.select('#calories-widget-main').style('left', `${left}px`).style('top', `${top}px`);
            })
            .on('mouseleave', function() {
                d3.select(this).transition()
                    .duration(750)
                    .attr("r", 4.5);
                d3.select('#calories-widget-main').style('display', 'none');
            });




        // slider
        g.append("g")
            .selectAll("circle")
            .data(d => d)
            .join("circle")
            .attr("cx", d => x(d / 2))
            .attr("fill", (d, i) => color("#000000"))
            .attr("r", 3.5);






        

        svg.append("g")
            .call(legend);

        return svg.node();
    });
    main.variable(observer("data")).define("data", ["values", "keys", "names", "images"], function(values, keys, names, images) {
        return (
            Object.assign(values, {
                keys: keys,
                names: names,
                images: images
            })
        )
    });
    main.variable(observer("values")).define("values", ["clean_data"], function(clean_data) {
        return (
            clean_data.map(d => [d.min_calories, d.max_calories])
        )
    });
    main.variable(observer("keys")).define("keys", function() {
        return (
            ["min_calories", "max_calories"]
        )
    });
    // main.variable(observer("names")).define("names", ["clean_data", "name2postal"], function(clean_data, name2postal) {
    //     return (
    //         clean_data.map(d => name2postal(d.name))
    //     )
    // });


    //change into returning name directly
    main.variable(observer("names")).define("names", ["clean_data"], function(clean_data) {
        return (
            clean_data.map(d => d.name)
            )
    });

    main.variable(observer("images")).define("images", ["clean_data"], function(clean_data) {
        return (
            clean_data.map(d => d.image_src)
            )
    });




    main.variable(observer("clean_data")).define("clean_data", ["raw_data"], function(raw_data) {
        return raw_data.map(d => {
            return { name: d["Beverage"], min_calories: +d["min_calories"], max_calories: +d["max_calories"], image_src: d["Image"] }
        }).sort((a, b) => +a.max_calories - +b.max_calories)
    });
    main.variable(observer("raw_data")).define("raw_data", ["d3"], async function(d3) {
        return (
            // await d3.csv("https://raw.githubusercontent.com/datadesk/census-data-downloader/613e69f6413d917a6db60186e5ddf253e722dcfd/data/processed/acs5_2017_medianage_states.csv")
            await d3.csv('data/starbucks-menu/drink_extreme_value.csv')
        )
    });
    main.variable(observer("x")).define("x", ["d3", "margin", "width"], function(d3, margin, width) {
        return (
            d3.scaleLinear()
            .domain([-10, 520]) //28, 48
            .rangeRound([margin.left, width - margin.right])
        )
    });
    main.variable(observer("y")).define("y", ["d3", "data", "margin", "height"], function(d3, data, margin, height) {
        return (
            d3.scalePoint()
            .domain(data.names)
            .rangeRound([margin.top, height - margin.bottom])
            .padding(1)
        )
    });
    main.variable(observer("color")).define("color", ["d3", "data"], function(d3, data) {
        return (
            d3.scaleOrdinal()
            .unknown("#ccc")
            .domain(data.keys)
            .range(d3.quantize(t => d3.interpolateSpectral(t * 0.2 + 0.6), data.keys.length).reverse()) //(t * 0.8 + 0.1)
        )
    });
    main.variable(observer("xAxis")).define("xAxis", ["margin", "d3", "x", "height"], function(margin, d3, x, height) {
        return (
            g => g
            .attr("transform", `translate(0,${margin.top})`)
            .call(d3.axisTop(x).ticks(null, ".0s"))
            .call(g => g.selectAll(".tick line").clone().attr("stroke-opacity", 0.1).attr("y2", height - margin.bottom))
            .call(g => g.selectAll(".domain").remove())
        )
    });
    main.variable(observer("legend")).define("legend", ["width", "margin", "data", "color"], function(width, margin, data, color) {
        return (
            svg => {
                const g = svg
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 10)
                    .attr("text-anchor", "end")
                    .attr("transform", `translate(${width},${margin.top})`)
                    .selectAll("g")
                    .data(data.keys.slice().reverse())
                    .join("g")
                    .attr("transform", (d, i) => `translate(0,${i * 20})`);

                g.append("rect")
                    .attr("x", -19)
                    .attr("width", 19)
                    .attr("height", 19)
                    .attr("fill", color);

                g.append("text")
                    .attr("x", -24) //-24
                    .attr("y", 9.5)
                    .attr("dy", "0.35em")
                    .text(d => d);
            }
        )
    });
    main.variable(observer("height")).define("height", ["data"], function(data) {
        return (
            data.length * 16
        )
    });
    main.variable(observer("margin")).define("margin", function() {
        return ({ top: 20, right: 50, bottom: 10, left: 10 })
    });
    main.variable(observer("d3")).define("d3", ["require"], function(require) {
        return (
            require("d3@5")
        )
    });
    // main.variable(observer("name2postal")).define("name2postal", function() {
    //     return (
    //         d => {
    //             const lookup = {
    //                 "ALABAMA": "AL",
    //                 "ALASKA": "AK",
    //                 "AMERICAN SAMOA": "AS",
    //                 "ARIZONA": "AZ",
    //                 "ARKANSAS": "AR",
    //                 "CALIFORNIA": "CA",
    //                 "COLORADO": "CO",
    //                 "CONNECTICUT": "CT",
    //                 "DELAWARE": "DE",
    //                 "DISTRICT OF COLUMBIA": "DC",
    //                 "FEDERATED STATES OF MICRONESIA": "FM",
    //                 "FLORIDA": "FL",
    //                 "GEORGIA": "GA",
    //                 "GUAM": "GU",
    //                 "HAWAII": "HI",
    //                 "IDAHO": "ID",
    //                 "ILLINOIS": "IL",
    //                 "INDIANA": "IN",
    //                 "IOWA": "IA",
    //                 "KANSAS": "KS",
    //                 "KENTUCKY": "KY",
    //                 "LOUISIANA": "LA",
    //                 "MAINE": "ME",
    //                 "MARSHALL ISLANDS": "MH",
    //                 "MARYLAND": "MD",
    //                 "MASSACHUSETTS": "MA",
    //                 "MICHIGAN": "MI",
    //                 "MINNESOTA": "MN",
    //                 "MISSISSIPPI": "MS",
    //                 "MISSOURI": "MO",
    //                 "MONTANA": "MT",
    //                 "NEBRASKA": "NE",
    //                 "NEVADA": "NV",
    //                 "NEW HAMPSHIRE": "NH",
    //                 "NEW JERSEY": "NJ",
    //                 "NEW MEXICO": "NM",
    //                 "NEW YORK": "NY",
    //                 "NORTH CAROLINA": "NC",
    //                 "NORTH DAKOTA": "ND",
    //                 "NORTHERN MARIANA ISLANDS": "MP",
    //                 "OHIO": "OH",
    //                 "OKLAHOMA": "OK",
    //                 "OREGON": "OR",
    //                 "PALAU": "PW",
    //                 "PENNSYLVANIA": "PA",
    //                 "PUERTO RICO": "PR",
    //                 "RHODE ISLAND": "RI",
    //                 "SOUTH CAROLINA": "SC",
    //                 "SOUTH DAKOTA": "SD",
    //                 "TENNESSEE": "TN",
    //                 "TEXAS": "TX",
    //                 "UTAH": "UT",
    //                 "VERMONT": "VT",
    //                 "VIRGIN ISLANDS": "VI",
    //                 "VIRGINIA": "VA",
    //                 "WASHINGTON": "WA",
    //                 "WEST VIRGINIA": "WV",
    //                 "WISCONSIN": "WI",
    //                 "WYOMING": "WY"
    //             }
    //             return lookup[d.toUpperCase()]

    //         }
    //     )
    // });
    return main;
}