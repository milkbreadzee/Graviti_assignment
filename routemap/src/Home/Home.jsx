import React, { useRef, useState } from 'react'
import {useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer} from "@react-google-maps/api"
import "./Home.css"
const Home = () => {

    const google = window.google;

    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [loading, setLoading] = useState(false);
    const [directionsRes, setDirectionsRes] = useState([])
    const [distance, setDistance] = useState('')
    const [time, setTime] = useState('')
    const [selectedRoute, setSelectedRoute] = useState(null);

    const originRef = useRef()
    const destinationRef = useRef()

    const {isLoaded} = useJsApiLoader({
            googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
            libraries: [
                'places'
            ],
        })

    const center = {lat: 28.6567, lng: 77.2415}
    
    if(!isLoaded) {
        return(
            <p>Loading ...</p>
        )
    }

    async function calculateRoute(){
        if(originRef.current.value === '' || destinationRef.current.value === ''){
            return
        }
        const directionService = new google.maps.DirectionsService()
        const routeOptions = {
            origin: originRef.current.value,
            destination: destinationRef.current.value,
            travelMode: google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true, // request multiple routes
        };
        const results = await new Promise((resolve, reject) => {
            directionService.route(routeOptions, (response, status) => {
                if (status === "OK") {
                    resolve(response);
                } else {
                    reject(status);
                }
            });
        });

        setOrigin(results.origin);
        setDestination(results.destination);
        setLoading(false);
        setDirectionsRes(results)
        setDistance(results.routes[0].legs[0].distance.text)
        setTime(results.routes[0].legs[0].duration.text)
        setSelectedRoute(0);

    }

    function selectRoute(index) {
        setSelectedRoute(index);
    }

    function renderDirectionsRenderer(routes) {
        if (!routes) {
            return null;
          }
        
        return routes.map((route, index) => {
            console.log(route)
          const isSelected = selectedRoute === index;
          const color = isSelected ? "blue" : "grey";
          return (
            <DirectionsRenderer
              key={index}
              directions={route}
              options={{polylineOptions: {strokeColor: color}}}
              onClick={() => selectRoute(index)}
            />
          );
        });
      }

    function clearRoute(){
        setDirectionsRes([]);
        setDistance('')
        setTime('')
        originRef.current.value = ''
        destinationRef.current.value = ''
    }

    console.log(directionsRes.routes)
    
  return (
    <div className="home">

        <div className="container">
            <p className='heading'>Let's calculate distance from Google maps</p>

        <div className="content-container">


        <div className="locations">

            <div className="location-container">

                <div className="location-inputs">
                <Autocomplete>
                <input type="text" placeholder='Origin' ref={originRef}/>
                </Autocomplete>
                <Autocomplete>
                <input type="text" placeholder='Destination' ref={destinationRef}/>
                </Autocomplete>

                </div>

                <div className="location-buttons">
                    
                <button onClick={calculateRoute}>
                    Calculate
                </button>
                <button onClick={clearRoute}>
                    Clear
                </button>

                </div>

            </div>


            <div className="distance">

                <div className="distance-number">
                    <p>Distance</p>
                    <p>{distance}</p>
                </div>

                <div className='distance-text'>
                    {!loading ? (
                        <p>The distance between {origin} and {destination} via the seleted route is {distance} kms.</p>
                    ) : (
                        <p>Please select a route.</p>
                    )}
                    {loading && <div className="loading">Loading...</div>}
                </div>

            </div>
        </div>

        <div className="render-map-box">
            <GoogleMap
                center={center}
                zoom={12}
                mapContainerStyle={{width : '100%',  height: '100%'}}
                options={{
                    streetViewControl:false,
                    mapTypeControl:false,
                    fullscreenControl: false
                    
                }}
                // onLoad={(map) => setMap(map)}
            >

                <Marker position={center}/>
                {directionsRes && <DirectionsRenderer directions={directionsRes}/>}
                {/* {renderDirectionsRenderer(directionsRes.routes)} */}
                 
            </GoogleMap>
        </div>
        </div>
        </div>
    </div>
  )
}

export default Home