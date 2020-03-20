// https://observablehq.com/@pridemusvaire/world-history-timeline@822
import define1 from "./e93997d5089d7165@2227.js";

export default function define(runtime, observer) {
    const main = runtime.module();

    // new autoselect from category 1
    main.variable(observer("viewof as")).define("viewof as", ["autoSelect", "dataByCalories"], function(autoSelect, dataByCalories) {
        return (
            autoSelect({
                title: 'Search from Category 1',
                options: dataByCalories.map(d => d.key),
                placeholder: "Type..."
            })
        )
    });
    main.variable(observer("as")).define("as", ["Generators", "viewof as"], (G, _) => G.input(_));

    // compute filteredData first and use its length to calculate height
    main.variable(observer("filteredData")).define("filteredData", ["data", "as"], function(data, as) {
        return (
            as === '' ? data.sort((a, b) => a.end - b.end) : data.filter(d => d.Category1 === as)
        )
    });

    // sorting
    main.variable(observer("viewof sorting")).define("viewof sorting", ["select"], function(select) {
        return (
            select({ title: 'Sorted by', options: ["category", "calories"], value: "calories" })
        )
    });
    main.variable(observer("sorting")).define("sorting", ["Generators", "viewof sorting"], (G, _) => G.input(_));

    // define chart
    main.variable(observer("chart")).define("chart", ["sorting", "as", "dataByCategory", "dataByOutside", "data", "filteredData", "d3", "color", "DOM", "width", "height", "margin", "createTooltip", "y", "getRect", "getTooltipContent", "axisTop", "axisBottom"], function(sorting, as, dataByCategory, dataByOutside, data, filteredData, d3, color, DOM, width, height, margin, createTooltip, y, getRect, getTooltipContent, axisTop, axisBottom) {

        // if (sorting !== "calories") {
        //     filteredData = [].concat.apply([], dataByCategory.map(d => d.values));
        // } else {
        //     filteredData = data.sort((a, b) => a.end - b.end);
        // }

        let otherData = as === '' ? [] : data.filter(d => d.Category1 != as);

        filteredData.forEach(d => d.color = d3.color(color(d.Category2)))

        let parent = this;
        let tooltip;
        let svg;

        if (!parent) {
            parent = document.createElement("div");

            tooltip = d3.select(document.createElement("div")).attr("id", "#m_tooltip").call(createTooltip);
            svg = d3.select(DOM.svg(width, height)).attr("id", "extreme-calories-svg");

            const g = svg.append("g").attr("transform", (d, i) => `translate(${margin.left} ${margin.top})`);

            const groups = g
                .selectAll("g")
                .data(filteredData)
                .enter()
                .append("g")
                .attr("class", "civ")

            // original position, used for starting point of the transition when reset
            // 这个 transition 怎么搞还可以再想想~
            filteredData.forEach((d, i) => d.origPos = y(i));

            groups.attr("transform", (d, i) => `translate(0 ${y(i)})`)

            groups
                .each(getRect)
                .on("mouseover", function(d) {
                    d3.select(this).select("rect").attr("fill", d.color.darker())

                    tooltip
                        .style("opacity", 1)
                        .html(getTooltipContent(d))
                })
                .on("mouseleave", function(d) {
                    d3.select(this).select("rect").attr("fill", d.color)
                    tooltip.style("opacity", 0)
                })

            svg.on("mousemove", function(d) {

                // let [x, y] = d3.mouse(this);
                let x = d3.event.pageX;
                let y = d3.event.pageY;

                line.attr("transform", `translate(${x} 0)`);
                y -= 90;   //y += 20
                if (x > width / 2) x -= 100;

                tooltip
                    .style("left", x + "px")
                    .style("top", y + "px")
            })

            parent.appendChild(tooltip.node());
            parent.appendChild(svg.node());
            parent.groups = groups;

        } else {
            tooltip = d3.select("#m_tooltip");
            svg = d3.select('#extreme-calories-svg')
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", `0 0 ${width} ${height}`);

            const civs = d3.selectAll(".civ")

            civs.data(filteredData, d => d.Name)
                .style("opacity", 1)
                .transition()
                // .delay((d,i)=>i*10)
                .ease(d3.easeCubic)
                .attr("transform", (d, i) => `translate(0 ${y(i)})`)

            // hack: make other data invisible
            civs.data(otherData, d => d.Name)
                .style("opacity", 0)
                .attr("transform", d => `translate(0 ${d.origPos})`)
        }

        // reset axis based on new height

        svg.selectAll(".extreme-value-axis").remove();

        const line = svg.append("line")
            .attr("class", "extreme-value-axis")
            .attr("y1", margin.top - 10)
            .attr("y2", height - margin.bottom)
            .attr("stroke", "rgba(0,0,0,0.2)")
            .style("pointer-events", "none");

        svg
            .append("g")
            .attr("class", "extreme-value-axis")
            .attr("transform", (d, i) => `translate(${margin.left} ${margin.top-10})`)
            .call(axisTop)

        svg
            .append("g")
            .attr("class", "extreme-value-axis")
            .attr("transform", (d, i) => `translate(${margin.left} ${height-margin.bottom})`)
            .call(axisBottom)

        return parent

    });
    main.variable(observer("getTooltipContent")).define("getTooltipContent", ["formatCalories"], function(formatCalories) {
        return (
            function(d) {
                return `<b>${d.Name}</b>
<br/>
<b style="color:${d.color.darker()}">${d.Category2}</b>
<br/>
${formatCalories(d.start)} - ${formatCalories(d.end)}
`
            }
        )
    });

    main.variable(observer("singleHeight")).define("singleHeight", function() {
        return (
            20 // dyhamically set height
        )
    });
    main.variable(observer("height")).define("height", ["filteredData", "singleHeight"], function(filteredData, singleHeight) {
        return (
            filteredData.length * singleHeight //original setting for 34 drinks: 700
        )
    });
    main.variable(observer("y")).define("y", ["d3", "filteredData", "height", "margin"], function(d3, filteredData, height, margin) {
        return (
            d3.scaleBand()
            .domain(d3.range(filteredData.length))
            .range([0, height - margin.bottom - margin.top])
            .padding(0.2)
        )
    });
    main.variable(observer("x")).define("x", ["d3", "data", "width", "margin"], function(d3, data, width, margin) {
        return (
            d3.scaleLinear()
            .domain([d3.min(data, d => d.start), d3.max(data, d => d.end)])
            .range([0, width - margin.left - margin.right])
        )

        // console.log("width: " + width - margin.left - margin.right)
    });
    main.variable(observer("margin")).define("margin", function() {
        return ({ top: 30, right: 30, bottom: 30, left: 30 })
    });
    main.variable(observer("createTooltip")).define("createTooltip", function() {
        return (
            function(el) {
                el
                    .style("position", "absolute")
                    .style("pointer-events", "none")
                    .style("top", 0)
                    .style("opacity", 0)
                    .style("background", "white")
                    .style("border-radius", "5px")
                    .style("box-shadow", "0 0 10px rgba(0,0,0,.25)")
                    .style("padding", "10px")
                    .style("line-height", "1.3")
                    .style("font-size", "11px")
                    // .style("font", "11px sans-serif")
            }
        )

        // console.log("tooltip created!!");
    });
    main.variable(observer("getRect")).define("getRect", ["d3", "x", "width", "y"], function(d3, x, width, y) {
        return (
            function(d) {
                const el = d3.select(this);
                const sx = x(d.start);
                const w = x(d.end) - x(d.start);
                const isLabelRight = (sx > width / 2 ? sx + w < width : sx - w > 0);

                el.style("cursor", "pointer")

                el
                    .append("rect")
                    .attr("x", sx - y.bandwidth()/2)
                    .attr("height", y.bandwidth()/2)  //y.bandwidth()
                    .attr("width", w + y.bandwidth() /2)
                    .attr("fill", d.color)
                    .attr("rx", 4);

                el
                    .append("text")
                    .text(d.Name)
                    .attr("x", isLabelRight ? sx - 5 : sx + w + 5)
                    .attr("y", 0)
                    .attr("font-size", "11px")
                    .attr("font-weight", "regular")
                    .attr("fill", "black")
                    .style("text-anchor", isLabelRight ? "end" : "start")
                    .style("dominant-baseline", "hanging");
            }
        )
    });
    main.variable(observer("dataByCalories")).define("dataByCalories", ["d3", "data"], function(d3, data) {
        return (
            d3.nest().key(d => d.Category1).entries(data)
        )
    });
    main.variable(observer("dataByCategory")).define("dataByCategory", ["d3", "data"], function(d3, data) {
        return (
            d3.nest().key(d => d.Category2).entries(data)
        )
    });

    // read by main category
    main.variable(observer("dataByOutside")).define("dataByOutside", ["d3", "data"], function(d3, data) {
        return (
            // d3.nest().key(d => d.region).entries(data)
            data.filter(d => d.Category1 === "Cold Coffees")
        )
    });

    main.variable(observer("axisBottom")).define("axisBottom", ["d3", "x", "formatCalories"], function(d3, x, formatCalories) {
        return (
            d3.axisBottom(x)
            .tickPadding(1)
            .tickFormat(formatCalories)
        )
    });
    main.variable(observer("axisTop")).define("axisTop", ["d3", "x", "formatCalories"], function(d3, x, formatCalories) {
        return (
            d3.axisTop(x)
            .tickPadding(1)
            .tickFormat(formatCalories)
        )
    });
    main.variable(observer("formatCalories")).define("formatCalories", function() {
        return (
            d => {
                // console.log(d);
                // return ''
                return d
            }
        )
    });
    main.variable(observer("d3")).define("d3", ["require"], function(require) {
        return (
            require("d3@5")
        )
    });
    main.variable(observer("csv")).define("csv", ["d3"], function(d3) {
        return (
            d3.csv("./data/starbucks-menu/drink_manual_extreme_value.csv")
        )
    });
    main.variable(observer("data")).define("data", ["csv"], function(csv) {
        return (
            csv.map(d => {
                return {
                    ...d,
                    start: +d.start,
                    end: +d.end
                }
            }).sort((a, b) => a.start - b.start)
        )
    });
    main.variable(observer("regions")).define("regions", ["d3", "data"], function(d3, data) {
        return (
            d3.nest().key(d => d.Category2).entries(data).map(d => d.key)
        )
    });
    main.variable(observer("timelines")).define("timelines", ["dataByCalories"], function(dataByCalories) {
        return (
            dataByCalories.map(d => d.key)
        )
    });
    main.variable(observer("color")).define("color", ["d3", "regions"], function(d3, regions) {
        return (
            d3.scaleOrdinal(["#006241", "#1e3932", "#00754a", "#d4e9e2", "#9d5116", "#a17700", "#ebcabc"]).domain(regions)  // , "#d3705a", "#c0d48b"
        )
    });
    const child1 = runtime.module(define1);
    const child2 = runtime.module(define1);
    main.import("checkbox", child1);
    main.import("select", child1);
    main.import("text", child2);
    main.import("autoSelect", child2);
    main.variable(observer()).define(["html"], function(html) {
        return (
            html `CSS<style> svg{font: 11px sans-serif;}</style>`
        )
    });
    return main;
}
