export default async function weatherData(cityname = "Chennai", API_KEY = "B2M6EBFN46CV7DJFLK2Y9JJVV") {
    try {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityname}?unitGroup=metric&key=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`Error fetching weather: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);
        return {
            address: data.address,
            currentConditions: data.currentConditions, 
            days: data.days, 
            description: data.description,
            latitude: data.latitude,
            longitude: data.longitude,        
        };
    }
    catch (error) {
        console.error(error);
        return null;
    }
}