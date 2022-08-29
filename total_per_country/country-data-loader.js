/**
 * This script was created as part of a bachelor thesis.
 * For more information, visit: https://github.com/StyxOo/styxoo.github.io
 * Author: Luis Rothenhäusler
 * Last edit: 29th August 2022
 *
 * This script is responsible for loading the country data from the CSVs and converting it to a single data array.
 */

/**
 * The names of the two data CSV files.
 */
const featuredCountriesFile = '2022-08-18_featured-in-refugee-response-plan.csv';
const otherNeighboursFile = '2022-08-18_other-neighbouring-countries.csv';

/**
 * The following loads the data from the two CSVs and creates a single data array from them.
 */
const loadCountryData = (_callback) => {
    /**
     * This section creates the data paths from the src string used to load this script.
     * This is done because the working directory and src string are different when accessing this from the showcase or from diagrams directly.
     */
    const thisScriptElement = d3.select('#country-data-loader');
    let sourcePath = thisScriptElement.attr('src');
    sourcePath = sourcePath.slice(0, sourcePath.length - 22);
    const featuredCountriesPath = sourcePath + featuredCountriesFile;
    const otherNeighboursPath = sourcePath + otherNeighboursFile;

    /**
     * This defines the resulting data array.
     */
    let loadedParts = 0;
    const data = [];
    data.columns = ['country', 'refugees'];

    /**
     * This adds a part to the resulting data array. When both parts are present, the callback is triggered on completeness.
     */
    const addDataPart = dataPart => {
        dataPart.forEach(entry => {
            data.push(entry);
        });

        loadedParts++;
        if (loadedParts >= 2) {
            data.sort((a, b) => b.refugees - a.refugees);

            console.log("All neighbor country data loaded. Full data is:");
            console.log(data);

            _callback(data);
        }
    };

    /**
     * This preprocesses a data part.
     */
    const loadDataPart = data => {
        console.log(data);
        let strippedData = [];
        for (let i = 0; i < data.length; i++) {
            strippedData.push({'country': data[i]["Country"], 'refugees': +data[i]["Border crossings from Ukraine*"]});
        }
        console.log(strippedData);
        addDataPart(strippedData);
    };

    /**
     * This loads the featured countries' data.
     */
    d3.csv(featuredCountriesPath).then(data => {
        console.log('Loaded featured countries data:');
        loadDataPart(data);
    });

    /**
     * This loads the other neighboring countries' data.
     */
    d3.csv(otherNeighboursPath).then(data => {
        console.log('Loaded other neighbour countries data:');
        loadDataPart(data);
    });
};