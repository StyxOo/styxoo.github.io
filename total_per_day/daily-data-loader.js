/**
 * This script was created as part of a bachelor thesis.
 * For more information, visit: https://github.com/StyxOo/styxoo.github.io
 * Author: Luis Rothenhäusler
 * Last edit: 29th August 2022
 *
 * This script is responsible for loading the daily data from the CSVs and converting it to a single data array.
 */

/**
 * The name of the JSON file.
 */
const dailyDataFile = '2022-07-23_crossings_daily.json';

/**
 * The following loads the data from the JSON, preprocesses it and returns the resulting data array.
 */
const loadDailyData = (_callback) => {
    /**
     * This section creates the data path from the src string used to load this script.
     * This is done because the working directory and src string are different when accessing this from the showcase or from diagrams directly.
     */
    const thisScriptElement = d3.select('#daily-data-loader');
    let sourcePath = thisScriptElement.attr('src');
    sourcePath = sourcePath.slice(0, sourcePath.length - 20);
    const dataPath = sourcePath + dailyDataFile;

    /**
     * This section is responsible for loading, preprocessing and returning the data.
     */
    d3.json(dataPath).then(data => {
        console.log("Read daily data JSON:");
        console.log(data);
        let newData = [];
        newData.columns = ['date', 'refugees'];

        data.data.timeseries.forEach(entry => {
            newData.push({'date': new Date(entry.data_date), 'refugees': entry.individuals})
        })

        console.log('Loaded daily data:')
        console.log(newData)

        _callback(newData)
    })
}