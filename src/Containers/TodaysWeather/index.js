import { useState, useEffect } from 'react'
import { Container, Card, CardBody } from 'reactstrap'
import { DateTime } from 'luxon'
import { isEmpty } from 'lodash'

import LightBackgroundImg from 'Assets/TodaysWeatherImages/bg-light.png'
import DarkBackgroundImg from 'Assets/TodaysWeatherImages/bg-dark.png'
import LoadingOverlay from 'Components/LoadingOverlay'
import WeatherHOC from './actions'
import WeatherSearchBar from './components/WeatherSearchBar'
import SelectedWeather from './components/SelectedWeather'
import WeatherSearchHistories from './components/WeatherSearchHistories'

import 'bootstrap/dist/css/bootstrap.min.css'
import './index.scss'

const TodaysWeather = props => {
  const [ isLightThemed, setIsLightThemed ] = useState( false )

  useEffect( () => {
    const root = document.documentElement
    const tmpIsLightThemed = DateTime.now().toFormat( 'a' ) === 'AM' 

    root.style.setProperty( '--color-primary', tmpIsLightThemed ? '#6C40B5' : '#28124D' )
    root.style.setProperty( '--color-weather-text', tmpIsLightThemed ? '#000000' : '#ffffff' )
    root.style.setProperty( '--color-weather-text-primary', tmpIsLightThemed ? '#6c40b5' : '#ffffff' )
    root.style.setProperty( '--color-weather-text-secondary', tmpIsLightThemed ? '#666666' : '#ffffff' )
    root.style.setProperty( '--color-weather-text-tertiary', tmpIsLightThemed ? '#000000' : 'rgba(255, 255, 255, 0.4)' )
    root.style.setProperty( '--color-weather-card-background', tmpIsLightThemed ? 'rgba(255, 255, 255, 0.2)' : 'rgba(26, 26, 26, 0.3)' )
    setIsLightThemed( tmpIsLightThemed )

    let tmpSearchHistories = localStorage.getItem( 'WEATHER_SEARCH_HISTORIES' )
    if( !isEmpty( tmpSearchHistories ) ){
      props.onChangeWeatherHOC( 'searchHistories', JSON.parse( tmpSearchHistories ) )
    }
  }, [] )

  return(
    <div
      style={{
        overflow: "scroll",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundImage: `url(${ isLightThemed ? LightBackgroundImg : DarkBackgroundImg })`
      }}>
      <Container 
        className='weather-container py-5' 
        style={{ maxWidth: "768px",height: "100vh" }} >
        <WeatherSearchBar 
          { ...props }
          isLightThemed={ isLightThemed } 
        />
        <Card style={{ border: isLightThemed ? "1px solid rgba(255, 255, 255, 0.5)" : "none" }} >
          <CardBody>
            <SelectedWeather { ...props } />
            <WeatherSearchHistories 
              { ...props } 
              isLightThemed={ isLightThemed }
            />
          </CardBody>
        </Card>
        { props.onLoadWeatherHOC && <LoadingOverlay/> }
      </Container>
    </div>
  )
}

export default WeatherHOC( TodaysWeather )