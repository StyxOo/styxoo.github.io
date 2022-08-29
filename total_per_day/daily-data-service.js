/**
 * This script was created as part of a bachelor thesis.
 * For more information, visit: https://github.com/StyxOo/styxoo.github.io
 * Author: Luis Rothenhäusler
 * Last edit: 29th August 2022
 *
 * This script is responsible for handling the daily refugee data and data updates in the showcase.
 */

/**
 * References to the data table, as well as the date slider.
 */
const dailyTBody = document.getElementById('tBody-daily');
const sliderStartLabel = document.getElementById('startDate');
const sliderCurrentLabel = document.getElementById('currentDate');
const sliderEndLabel = document.getElementById('endDate');

/**
 * This creates a new entry in the data table for each data point in the provided data set.
 */
const fillDailyTable = data => {
    data.forEach(d => {
        addDay(d.date, false, d.refugees);
    });
};

/**
 * A linear lerp function between two values, a and b, depending on the time t.
 */
const lerp = (a, b, t) => {
    return (1 - t) * a + t * b;
};

/**
 * Updates the labels for the start, end and current date of the slider.
 */
const updateSliderLimits = () => {
    const startDate = new Date(latestDailyData[0].date);
    const endDate = new Date(latestDailyData[latestDailyData.length-1].date);

    sliderStartLabel.textContent = dateToDisplay(startDate);

    const startMillis = startDate.valueOf();
    const endMillis = endDate.valueOf();
    const currentMillis = lerp(startMillis, endMillis, timeValue());

    sliderCurrentLabel.textContent = dateToDisplay(new Date(currentMillis));
    sliderEndLabel.textContent = dateToDisplay(endDate);
};

/**
 * Removes the first entry from the data table.
 */
const removeFirstDay = () => {
    dailyTBody.removeChild(dailyTBody.firstChild);

    if (autoUpdateDaily) {
        updateDailyData();
    }
};

/**
 * Removes the last day from the data table.
 */
const removeLastDay = () => {
    dailyTBody.removeChild(dailyTBody.lastChild);

    if (autoUpdateDaily) {
        updateDailyData();
    }
};


/**
 * Converts a date object into a string of style DD-MM-YYYY. The string is returned.
 */
const dateToDisplay = date => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    let dayString = day;
    if (day < 10) {
        dayString = '0' + dayString;
    }

    let monthString = month;
    if (month < 10) {
        monthString = '0' + monthString;
    }

    return [dayString, monthString, year].join('-');
}

/**
 * Converts a date from a string to a date object.
 */
const displayToDate = display => {
    const values = display.split('-');
    return new Date(+values[2], +values[1] - 1, +values[0]);
}

/**
 * This section controls if the data should be automatically updated.
 * This is controlled by a checkbox at the bottom of the data table.
 */
let autoUpdateDaily = true;
const autoUpdateDailyData = checkbox => {
    autoUpdateDaily = checkbox.checked;
}

/**
 * This adds a new earliest day to the data array.
 */
const addDayBefore = () => {
    const currentNewestDate = displayToDate(dailyTBody.firstChild.firstChild.firstChild.value);
    let dayBefore = new Date(currentNewestDate.getTime());
    dayBefore.setDate(currentNewestDate.getDate() - 1);
    addDay(dayBefore, true);

    if (autoUpdateDaily)
    {
        updateDailyData();
    }
};

/**
 * This adds a new latest day to the data array
 */
const addDayAfter = () => {
    const currentLatestDate = displayToDate(dailyTBody.lastChild.firstChild.firstChild.value);
    let dayAfter = new Date(currentLatestDate.getTime());
    dayAfter.setDate(currentLatestDate.getDate() + 1);
    addDay(dayAfter, false);

    if (autoUpdateDaily)
    {
        updateDailyData();
    }
};

/**
 * This section creates a new row in the data table using a given date and refugee count.
 * It is used to fill the table in the beginning, after loading the data, as well as when creating a new table row.
 * Each row consists of a readonly input field for the date and an input field for the number of refugees.
 */
const addDay = (date, addToBeginning, refugees = 0) => {
    const row = document.createElement('tr');
    row.className = 'dailyDataRow';
    const dateCell = document.createElement('td');
    const refugeesCell = document.createElement('td');

    const dateInput = document.createElement('input');
    dateInput.className = 'dateInput';
    dateInput.value = dateToDisplay(date);
    dateInput.setAttribute('readonly', '');

    const refugeesInput = document.createElement('input');
    refugeesInput.className = 'refugeeInput';
    refugeesInput.type = 'number';
    refugeesInput.onkeyup = () => {
        refugeesInput.value=refugeesInput.value.replace(/\D/,'');

        if (autoUpdateDaily)
        {
            updateDailyData();
        }
    }
    refugeesInput.value = refugees;

    dateCell.appendChild(dateInput);
    refugeesCell.appendChild(refugeesInput);

    row.appendChild(dateCell);
    row.appendChild(refugeesCell);

    if (addToBeginning) {
        dailyTBody.prepend(row);
    } else {
        dailyTBody.appendChild(row);
    }
};


/**
 * This function is triggered by the 'Update Data' button at the bottom of the data table and by the auto update.
 * It creates a new data object, mimicking the original data read from the csv.
 * It also invokes the render function, updating the diagrams.
 */
let latestDailyData = undefined;
const updateDailyData = () => {
    console.log("Update data aka create new data element");
    const data = [];
    const tableRows = document.getElementsByClassName('dailyDataRow');

    data.columns = ['date', 'refugees'];

    for (let i = 0, row; row = tableRows[i]; i++) {
        const newLine = new Object({'date' : displayToDate(row.cells[0].children[0].value), 'refugees' : +row.cells[1].children[0].value});
        data.push(newLine);
    }

    console.log('Newly updated data set:');
    console.log(data);

    latestDailyData = data;
    updateSliderLimits();
    renderDailyDiagrams();
}

const timeSlider = document.getElementById('timeSlider');
timeSlider.addEventListener('change', (e) => {
    updateSliderLimits();
    renderDailyDiagrams();
});

const timeValue = () => {
    return timeSlider.value / 100;
};

/**
 * The following allows the single diagrams to register their render functions as callbacks.
 * They will be invoked when the data changes.
 * The section with `window.` exposes the function to be callable by the diagrams using the `parent.` keyword.
 */
const dailyDiagramRenderCallbacks = [];

window.registerDailyDiagramRenderCallback = (callback) => {
    dailyDiagramRenderCallbacks.push(callback);

    /**
     * This will only happen, if the data was already loaded before the callback is getting registered.
     * If the callback is registered before the data is loaded, it will be called through the render call in the data loading.
     */
    if (latestDailyData !== undefined) {
        callback(latestDailyData);
    }
};

/**
 * This function triggers the render callback of each diagram which is registered for data updates with this data service.
 */
const renderDailyDiagrams = () => {
    console.log('Render diagrams through registered callbacks');
    for (const diagramRenderCallback of dailyDiagramRenderCallbacks) {
        diagramRenderCallback(latestDailyData, timeValue());
    }
};

/**
 * The following requests the data to be loaded by the data loader. When the data is returned, the diagrams are rendered.
 */
const loadDailyDataCallback = data => {
    fillDailyTable(data);

    latestDailyData = data;
    updateSliderLimits();
    renderDailyDiagrams();
};

loadDailyData(loadDailyDataCallback);

