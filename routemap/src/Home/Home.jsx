import React, { useRef, useState } from 'react'
import {useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer, DirectionsService, MarkerF} from "@react-google-maps/api"
import {AiOutlinePlusCircle} from "react-icons/ai"
import {FaDotCircle} from "react-icons/fa"
import "./Home.css"
import button from "../assets/location-pin.png"
import originIcon from "../assets/OriginIcon.png"
import destinationIcon from "../assets/DestinationIcon.png"
import stopIcon from "../assets/StopIcon.png"

const Home = () => {


    const google = window.google;

    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [loading, setLoading] = useState(false);
    const [directionsRes, setDirectionsRes] = useState(null)
    const [distance, setDistance] = useState('')
    const [time, setTime] = useState('')
    const [routes, setRoutes] = useState([])
    const [waypoints, setWaypoints] = useState([]);

    const [originloc, setOriginLoc] = useState({ lat: 0, lng: 0 });
    const [destinationloc, setDestinationLoc] = useState({ lat: 0, lng: 0 });


    const originRef = useRef()
    const destinationRef = useRef()
    const waypointRef = useRef()

    

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

   async function calculateRoute() {
        if (originRef.current.value === '' || destinationRef.current.value === '') {
            return;
        }
        setLoading(true); // Set loading to true when calculating route
        const directionService = new google.maps.DirectionsService();
        const routeOptions = {
            origin: originRef.current.value,
            destination: destinationRef.current.value,
            waypoints:  [...waypoints.map(waypoint => ({ location: waypoint.location }))],
            travelMode: google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true // request multiple routes
        };
        const results = await new Promise((resolve, reject) => {
            directionService.route(routeOptions, (response, status) => {
            if (status === 'OK') {
                resolve(response);
            } else {
                reject(status);
                window.alert('Directions request failed due to ' + status);
            }
            });
        });
        // console.log(results)
        setOrigin(originRef.current.value);
        setDestination(destinationRef.current.value);
        setLoading(false);
        setDirectionsRes(results);
        setDistance(results.routes[0].legs[0].distance.text);
        setTime(results.routes[0].legs[0].duration.text);
        setRoutes(results.routes);

        const originLatLng = results.routes[0].legs[0].start_location;
        const destinationLatLng = results.routes[0].legs[0].end_location;

        console.log('Origin Latitude:', originLatLng.lat());
        console.log('Origin Longitude:', originLatLng.lng());

        console.log('Destination Latitude:', destinationLatLng.lat());
        console.log('Destination Longitude:', destinationLatLng.lng());

        setOriginLoc(results.routes[0].legs[0].start_location)
        setDestinationLoc(results.routes[0].legs[0].end_location)

        // const waypoints = results.routes[0].legs[0].steps.map((step) => ({
        //     lat: step.end_location.lat(),
        //     lng: step.end_location.lng(),
        //   }));
        
        // waypoints.forEach((waypoint) => {
        // const { lat, lng } = waypoint;
        // console.log('Waypoint Latitude:', lat);
        // console.log('Waypoint Longitude:', lng);
        // });
    }

    const handleAddWaypoint = () => {
        const newWaypoint = { location: waypointRef.current.value };
        setWaypoints(prevWaypoints => [...prevWaypoints, newWaypoint]);
        waypointRef.current.value = ''; 
      };


   
    function clearRoute(){
        setDirectionsRes([]);
        setDistance('')
        setTime('')
        originRef.current.value = ''
        destinationRef.current.value = ''
    }


    const originMarkerIcon = {
        url: '../assets/button.png',
        scaledSize: new window.google.maps.Size(30, 30),
        origin: new google.maps.Point(0, 0),
        anchor: google.maps.Point(15, 15),
        };
    

    
    
    


    
  return (
    <div className="home">

        <div className="container">
            <p className='heading'>Let's calculate distance from Google maps</p>

        <div className="content-container">


        <div className="locations">

            <div className="location-container">

                <div className="location-inputs">
                <div className="origin">
                    <label htmlFor="1">Origin</label>
                    <div className="input-container">
                <Autocomplete>
                <input type="text" placeholder='Origin' id='1' ref={originRef} />
                </Autocomplete>
                </div>
                </div>
               

                <div className="waypoints">
                    <label htmlFor="2">Stop</label>
                    <div className='waypoint-input-container'>
                    <Autocomplete>
                    <input type="text" placeholder='Waypoints' id='2' ref={waypointRef} />
                    </Autocomplete>
                    <button className='waypoint-btn' onClick={handleAddWaypoint}><AiOutlinePlusCircle /> Add another stop</button>
                    </div>
                </div>

                <div className='display-waypoints'>
                {waypoints.map((waypoint, index) => (
                    <div key={index}>{waypoint.location}</div>
                ))}
                </div>

                <div className="destination">
                    <label htmlFor="3">Destination</label>
                <Autocomplete>
                <input type="text" placeholder='Destination' id='3' ref={destinationRef} />
                </Autocomplete>
                </div>
               

                </div>

                <div className="location-buttons">
                    
                <button className = "calc-btn" onClick={calculateRoute}>
                    Calculate
                </button>
                {/* <button onClick={clearRoute}>
                    Clear
                </button> */}

                </div>

            </div>


            <div className="distance">

                <div className="distance-number">
                    <p>Distance</p>
                    <p className='distance-style-number'>{distance}</p>
                </div>

                <div className='distance-text'>
                    {!loading ? (
                        <p>The distance between {origin} and {destination}<br /> via the seleted route is {distance} kms.</p>
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
                    fullscreenControl: false,
                    disableDefaultUI: true,                    
                }}
            >

                <MarkerF position={center} clickable={false} icon={{
                    url:button,
                    scaledSize: new window.google.maps.Size(30, 30),
                }}/>

                <MarkerF position={originloc} clickable={false}  icon={{
                    url:originIcon,
                    scaledSize: new window.google.maps.Size(20, 20),
                }}
                zIndex={10}
                onDrag={true}
                onZindexChanged={()=>{}}
                />

                <MarkerF position={destinationloc} clickable={false}  icon={{
                    url:destinationIcon,
                    scaledSize: new window.google.maps.Size(20, 20),
                }}
                zIndex={10}
                onDrag={true}
                onZindexChanged={()=>{}}
                />

                {/* <MarkerF position={} clickable={false}  icon={{
                    url:stopIcon,
                    scaledSize: new window.google.maps.Size(20, 20),
                }}
                zIndex={10}
                onDrag={true}
                onZindexChanged={()=>{}}
                /> */}


                {directionsRes && <DirectionsRenderer directions={directionsRes}/>}     
            </GoogleMap>
        </div>
        </div>
        </div>
    </div>
  )
}

export default Home