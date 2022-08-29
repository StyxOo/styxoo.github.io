/**
 * This script was created as part of a bachelor thesis.
 * For more information, visit: https://github.com/StyxOo/styxoo.github.io
 * Author: Luis Rothenhäusler
 * Last edit: 29th August 2022
 *
 * This script is responsible for handling the country refugee data and data updates in the showcase.
 */

/**
 * A reference to the data table.
 */
const countryTBody = document.getElementById('tBody_per_country');

/**
 * This section creates a new row in the data table using a given country name and refugee count.
 * It is used to fill the table in the beginning, after loading the data, as well as when creating a new table row.
 * Each row consists of an input field for the country, an input field for the number of refugees and a button to remove the row.
 */
let countryCount = 0;

const addCountryRow = (country = `Country name ${countryCount}`, refugees = 0) => {
    countryCount += 1;

    const row = document.createElement('tr');
    row.className = 'countryDataRow';
    const countryCell = document.createElement('td');
    const refugeesCell = document.createElement('td');
    const removeButtonCell = document.createElement('td');

    const countryInput = document.createElement('input');
    countryInput.value = country;

    const refugeesInput = document.createElement('input');
    refugeesInput.type = 'number';
    refugeesInput.onkeyup = () => {
        refugeesInput.value = refugeesInput.value.replace(/\D/,'');
        if (autoUpdateCountry) {
            updateCountryData();
        }
    }
    refugeesInput.value = `${refugees}`;
    refugeesInput.className = 'refugeeInput';

    const removeButton = document.createElement('button');
    removeButton.textContent = "Remove";
    removeButton.onclick= event => {removeCountryRow(event)};

    countryCell.appendChild(countryInput);
    refugeesCell.appendChild(refugeesInput);
    removeButtonCell.appendChild(removeButton);

    row.appendChild(countryCell);
    row.appendChild(refugeesCell);
    row.appendChild(removeButtonCell);
    countryTBody.appendChild(row);

    if (autoUpdateCountry) {
        updateCountryData();
    }
};

/**
 * This creates a new entry in the data table for each data point in the provided data set.
 */
const fillCountryTable = data => {
    data.forEach(d => {
        addCountryRow(d.country, d.refugees);
    });
};

/**
 * Removes a row from the data table, depending on the specific remove buttons click event.
 */
const removeCountryRow = (event) => {
    console.log(event);
    countryTBody.removeChild(event.target.parentElement.parentElement);

    if (autoUpdateCountry) {
        updateCountryData();
    }
};

/**
 * This section controls if the data should be automatically updated.
 * This is controlled by a checkbox at the bottom of the data table.
 */
let autoUpdateCountry = true;
const autoUpdateCountryData = checkbox => {
    autoUpdateCountry = checkbox.checked;
};

/**
 * This function is triggered by the 'Update Data' button at the bottom of the data table or by the auto update.
 * It creates a new data object, mimicking the original data read from the csv.
 * It also invokes the render function, updating the diagrams.
 */
let latestCountryData = undefined;

const updateCountryData = () => {
    console.log("Update data aka create new data element");
    const data = [];
    const tableRows = document.getElementsByClassName('countryDataRow');

    data.columns = ['country', 'refugees'];

    for (let i = 0, row; row = tableRows[i]; i++) {
        const newLine = new Object({'country' : row.cells[0].children[0].value, 'refugees' : +row.cells[1].children[0].value});
        data.push(newLine);
    }

    console.log('Newly updated data set:');
    console.log(data);

    latestCountryData = data;
    renderCountryDiagrams();
};

/**
 * The following allows the single diagrams to register their render functions as callbacks.
 * They will be invoked when the data changes.
 * The section with `window.` exposes the function to be callable by the diagrams using the `parent.` keyword.
 */
const countryDiagramRenderCallbacks = [];

window.registerCountryDiagramRenderCallback = (callback) =>
{
    countryDiagramRenderCallbacks.push(callback);

    /**
     * This will only happen, if the data was already loaded before the callback is getting registered.
     * If the callback is registered before the data is loaded, it will be called through the render call in the data loading.
     */
    if (latestCountryData !== undefined) {
        callback(latestCountryData);
    }
}

/**
 * This function triggers the render callback of each diagram which is registered for data updates with this data service.
 */
const renderCountryDiagrams = () => {
    console.log('Render diagrams through registered callbacks');
    for (const diagramRenderCallback of countryDiagramRenderCallbacks) {
        diagramRenderCallback(latestCountryData);
    }
};

/**
 * The following requests the data to be loaded by the data loader. When the data is returned, the diagrams are rendered.
 */
const loadCountryDataCallback = data => {
    fillCountryTable(data);

    latestCountryData = data;
    renderCountryDiagrams();
};

loadCountryData(loadCountryDataCallback);

