const stopsToFetch = [
    morningStop,
    eveningStop
];

let stopsURLParams = '';
stopsToFetch.map((stopToFetch) => {
    stopsURLParams += `&stops=${stopToFetch.routeId}|${stopToFetch.stopId}`;
});

console.log(`http://webservices.nextbus.com/service/publicJSONFeed?command=predictionsForMultiStops&a=sf-muni${stopsURLParams}`);

refreshPredictions(stopsURLParams);
const refreshRateSeconds = 30;
setInterval(refreshPredictions, refreshRateSeconds * 1000);

function refreshPredictions(stopsURLParams) {
    fetch(`http://webservices.nextbus.com/service/publicJSONFeed?command=predictionsForMultiStops&a=sf-muni${stopsURLParams}`)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(JSON.stringify(data));

        const predictionsWrapper = document.querySelector('.predictionsWrapper');
        const predictionNextMinutesLabel =  document.querySelector('.predictionsWrapper .predictions .prediction#next .predictionValue');

        if (
            data &&
            data.predictions &&
            data.predictions.length > 0 &&
            !data.predictions[0].dirTitleBecauseNoPredictions
        ) {
            const predictionNextMinutes = data.predictions[0].direction.prediction[0].minutes;

            predictionNextMinutesLabel.innerHTML = predictionNextMinutes;
            document.querySelector('.predictionsWrapper .stopTitle').innerHTML = data.predictions[0].stopTitle;
    
            if (predictionNextMinutes >= 15) {
                predictionsWrapper.id = 'greaterThan15';
            } else if (predictionNextMinutes >= 10 && predictionNextMinutes < 15) {
                predictionsWrapper.id = 'between10and15';
            } else if (predictionNextMinutes >= 5 && predictionNextMinutes < 10) {
                predictionsWrapper.id = 'between5and10';
            } else if (predictionNextMinutes < 5) {
                predictionsWrapper.id = 'lessThan5';
            }
        } else {
            predictionNextMinutesLabel.innerHTML = 'N/A';
            predictionsWrapper.id = 'lessThan5';
        }
    });
}
