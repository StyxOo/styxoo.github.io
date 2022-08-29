/**
 * This script was created as part of a bachelor thesis.
 * For more information, visit: https://github.com/StyxOo/styxoo.github.io
 * Author: Luis Rothenhäusler
 * Last edit: 29th August 2022
 *
 * This file contains the JavaScript implementation of the legend.
 */

/**
 * In this first section, some data independent constants are defined.
 */
// This creates a reference to the SVG container on the HTML page. This will contain the whole diagram.
const svg = d3.select('#mainFrame')
    .attr('height', innerHeight)
    .attr('width', innerWidth);

// The margin definition for the diagram. The content is padded from the sides using the margins.
const margin = {
    top: 10,
    right: 20,
    bottom: -10,
    left: 20
};

// The contentWidth stores the available coordinate space for the content of the legend.
const contentHeight = innerHeight - margin.top - margin.bottom;

/**
 * This section defines the hierarchy of the diagram.
 * This makes later selections and debugging in the browser inspector easier.
 */
const diagramGroup = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

const legendParentGroup = diagramGroup.append('g')
    .attr('id', 'legend');

/**
 * This section defines the color scale used to color elements according to their country.
 * It can be defined here, as it is independent of the data
 */
const colors = d3.scaleOrdinal(d3.schemeDark2);

/**
 * The render function is defined here.
 * It is called to initially draw the legend, as well every time the data changes and the diagram should update.
 */
const render = data => {
    console.log('Rendering legend');

    /**
     * The following defines the transition which is used for all animations.
     */
    const t = svg.transition()
        .duration(1500);

    /**
     * Here all the required scales, which are dependent on the data, are defined.
     */
        // The legend scale is used to convert the country to the applicable y-coordinate.
    const legendScale = d3.scaleBand()
        .domain(data.map(d => d.country))
        .range([0, contentHeight])
        .padding(0.3);

    /**
     * This is where the actual content of the legend is drawn.
     * Therefore, a data-join is created and the behavior of the general update pattern is specified.
     */
    legendParentGroup.selectAll('g .entry').data(data, d => {return d.country})
        .join(
            // This describes the behavior of the enter sub-selection of the general update pattern.
            enter => {
                const entry = enter.append('g')
                    .attr('class', 'entry')
                    .attr('transform', `translate(0, ${contentHeight})`)
                    .call(enter => enter.transition(t)
                        .attr('transform', d => {
                            return `translate(0, ${legendScale(d.country)})`
                        }));

                // A circle is added for each entry. It shows the applicable color.
                entry.append('circle')
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .attr('r', 0)
                    .attr('fill', d => colors(d))
                    .call(
                        enter => enter.transition(t)
                        .attr('r', legendScale.bandwidth()/2));

                // A text label is added. It holds the applicable countries name.
                entry.append('text')
                    .text(d => d.country)
                    .attr('x', legendScale.bandwidth() * 1.3)
                    .attr('dy', '0.32em');
            },
            // This describes the behavior of the update sub-selection of the general update pattern.
            update => {
                update.call(update => update.transition(t)
                        .attr('transform', d => {
                            return `translate(0, ${legendScale(d.country)})`;
                        }));

                update.select('text').call(
                    update => update.transition(t)
                        .attr('x', legendScale.bandwidth() * 1.3));

                update.select('circle').call(
                    update => update.transition(t)
                        .attr('r', legendScale.bandwidth() / 2));
            }
        );
};


/**
 * This section tries to subscribe to the country-data-service for data updates.
 * The diagram will not work without the country-data-service.
 */
try {
    parent.registerCountryDiagramRenderCallback(render);
    console.log('Could successfully subscribe to the country-data-service for data updates.');
} catch (e) {
    console.log('Could not subscribe to the country-data-service for data updates. ' +
        'Data is loaded directly.');

    loadCountryData(render)
}
