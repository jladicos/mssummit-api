const ws = require("ws");
const enigma = require("enigma.js");
const schema = require("enigma.js/schemas/12.170.2.json");

// Open session to an app
const session = enigma.create({
  url: "ws://localhost:19076/app/help",
  schema,
  createSocket: url => {
    return new ws(url);
  }
});

const global = session.open();
const app = global.then(h => h.openDoc("Helpdesk Management"));

// An object with too much data for 1 fetch
const object = app.then(h =>
  h.createSessionObject({
    qInfo: {
      qType: "object"
    },
    qHyperCubeDef: {
      qDimensions: [
        {
          qDef: {
            qFieldDefs: ["=valueloop(1,100000)"]
          }
        }
      ],
      qMeasures: [
        {
          qDef: {
            qDef: "=rand()"
          }
        }
      ],
      qInitialDataFetch: []
    }
  })
);

const layout = object.then(h => h.getLayout());

const maxCellsPerPage = 10000;

// Fetch each section of data sequentially and concatenate
const sequentiallyRequestedData = layout
  .then(layout => {
    // Calculate how many records we need to pull per page, etc.
    const totalCells =
      layout.qHyperCube.qSize.qcx * layout.qHyperCube.qSize.qcy; // 200,000
    const maxRowsPerPage = Math.floor(
      maxCellsPerPage / layout.qHyperCube.qSize.qcx
    ); // 5,000
    const numberOfPages = Math.ceil(
      layout.qHyperCube.qSize.qcy / maxRowsPerPage
    ); // 40

    // Create an array of the pages that will be fetched
    const pageRequests = [];
    for (var i = 0; i < numberOfPages; i++) {
      const pageDef = {
        qTop: i * maxRowsPerPage,
        qLeft: 0,
        qWidth: layout.qHyperCube.qSize.qcx,
        qHeight: maxRowsPerPage
      };
      pageRequests.push(pageDef);
    }

    // Execute the fetches 1 by 1 and concatenate the results
    const result = pageRequests.reduce((latestResultsPromise, def) => {
      return latestResultsPromise.then(newData => {
        return object
          .then(h => h.getHyperCubeData("/qHyperCubeDef", [def]))
          .then(pages => {
            return [...newData, ...pages[0].qMatrix];
          });
      });
    }, Promise.resolve([]));

    return result;
  })
  // Log the results
  .then(console.log);
