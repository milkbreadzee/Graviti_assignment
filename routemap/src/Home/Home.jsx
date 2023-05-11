import React, { useRef, useState } from 'react'
import {useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer} from "@react-google-maps/api"
import "./Home.css"
const Home = () => {

    const google = window.google;

    const [directionsRes, setDirectionsRes] = useState(null)
    const [distance, setDistance] = useState('')
    const [time, setTime] = useState('')

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
        const results = await directionService.route({
            origin: originRef.current.value,
            destination: destinationRef.current.value,
            travelMode: google.maps.TravelMode.DRIVING,
        })
        setDirectionsRes(results)
        setDistance(results.routes[0].legs[0].distance.text)
        setTime(results.routes[0].legs[0].duration.text)

    }

    function clearRoute(){
        setDirectionsRes(null)
        setDistance('')
        setTime('')
        originRef.current.value = ''
        destinationRef.current.value = ''
    }

    
  return (
    <div className="home">

        <div className="container">
        <div className="locations">
            <Autocomplete>
            <input type="text"  placeholder='Origin' ref={originRef}/>
            </Autocomplete>
            <Autocomplete>
            <input type="text" placeholder='Destination' ref={destinationRef}/>
            </Autocomplete>

            <button onClick={calculateRoute}>
                Calculate
            </button>
            <button onClick={clearRoute}>
                Clear
            </button>

            <div className="distance">

            </div>
        </div>

        <div className="render-map-box">
            <GoogleMap
                center={center}
                zoom={12}
                mapContainerStyle={{width : '100%',  height: '100%'}}
                options={{
                    streetViewControl:false
                }}
                // onLoad={(map) => setMap(map)}
            >

                <Marker position={center}/>
                {directionsRes && <DirectionsRenderer directions={directionsRes}/>}

            </GoogleMap>
        </div>
        </div>
    </div>
  )
}

export default Home