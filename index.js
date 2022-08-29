/**
 * This script was created as part of a bachelor thesis.
 * For more information, visit: https://github.com/StyxOo/styxoo.github.io
 * Author: Luis Rothenhäusler
 * Last edit: 29th August 2022
 *
 * This script contains the behavior for the main showcase.
 */

/**
 * This section is responsible for showing and hiding the data tables.
 */
const countryDataTable = document.getElementById('countryDataTable')
const dailyDataTable = document.getElementById('dailyDataTable')

const triggerDailyData = checkbox => {
    dailyDataTable.hidden = !checkbox.checked
}

const triggerCountryData = checkbox => {
    countryDataTable.hidden = !checkbox.checked
}


/**
 * This section allows each of the iframes containing a diagram to be clicked and redirected to that diagrams html page.
 */
window.onload = function() {
    const barChartFrame = document.getElementById("barChartFrame");
    barChartFrame.contentWindow.document.onclick = () => location.href = './total_per_country/bar-chart/diagram.html';

    const donutChartFrame = document.getElementById("donutChartFrame");
    donutChartFrame.contentWindow.document.onclick = () => location.href = './total_per_country/donut-chart/diagram.html';

    const treeMapFrame = document.getElementById("treeMapFrame");
    treeMapFrame.contentWindow.document.onclick = () => location.href = './total_per_country/tree-map/diagram.html';

    const sankeyFrame = document.getElementById("sankeyFrame");
    sankeyFrame.contentWindow.document.onclick = () => location.href = './total_per_country/sankey/diagram.html';

    const circleGraphFrame = document.getElementById("circleGraphFrame");
    circleGraphFrame.contentWindow.document.onclick = () => location.href = './total_per_day/circle/diagram.html';

    const areaGraphFrame = document.getElementById("areaGraphFrame");
    areaGraphFrame.contentWindow.document.onclick = () => location.href = './total_per_day/area/diagram.html';
};