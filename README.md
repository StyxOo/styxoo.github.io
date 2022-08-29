# Introduction
This project was created as part of the bachelor thesis about "[d3js](https://d3js.org/) and its potential in data visualization".
It was created by Luis Rothenhäusler between the 7th of July 2022 and the 1st of September 2022. 
The full thesis can be found in the thesis.pdf.

## What is this about?
As the thesis tries to evaluate the potential of the d3js library, a showcase was created to get a deeper understanding about the d3js library.
The showcase contains several diagrams about the current refugee situation caused by the armed conflict in the Ukraine.
At the time of completing this thesis, the conflict was still ongoing.
All data used to create the diagrams in the showcase is taken from the [UNHCR](https://www.unhcr.org/).

### Where can I see this showcase?
A live version of the showcase can be found [here](https://styxoo.github.io). Otherwise, You can also host the showcase yourself.

#### But how?
As this showcase requires to be run on a server to work. The easiest way to achieve this is using Python.
Therefore, you need download or clone this repository first. Afterwards you need to navigate to directory in your favorite command line tool.
Here you only need to run a single command. When using Python 3, the command is `python -m http.server`.
Depending on the configuration of your local PATH variable, `python` might need to be replaced with `python3`.
this command will create a local server instance at http://0.0.0.0:8000. Accessing this page brings you directly to the showcase. And that is already all.

### Ok, cool. But what can I see here?
The showcase is split into two sections. The first section contains diagrams showing the number of refugees by the neighbor country they crossed into.
The second section contains diagrams about the cumulative number of refugees on a daily basis.
As d3js allows diagrams to react to changes in the data, each section provides an option to show and modify the used data.
Feel free to change the data to your hearts content. The changes are not saved in the data files and therefore not permanent.  
Each diagram is also implemented to work independently of the showcase. A diagram can be accessed directly by clicking on it.

#### I found a diagram I like. Can I learn more about it?
Sure. Just check the `total_per_country` and `total_per_day` subdirectories of the repository. 
There you can find the implementation of each of the diagrams. Feel free to use them for inspiration or guidline.
If you want to learn more about how the diagrams work, don't forget to check out the thesis itself. Enjoy :relaxed: