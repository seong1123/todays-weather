import { isEmpty } from 'lodash'

import SunImage from 'Assets/TodaysWeatherImages/sun.png'
import CloudImage from 'Assets/TodaysWeatherImages/cloud.png'

const SelectedWeather = props => {
  return !isEmpty( props.selectedWeather ) ? (
    <>
      <div className='d-flex flex-row flex-nowrap justify-content-between'>
        <div 
          style={{ zIndex: "1", width: "40%" }}
          className='d-flex flex-column flex-wrap'>
          <p>Today's weather</p>
          <p
            className='text-primary' 
            style={{ fontWeight: 'bold', fontSize: "4rem", lineHeight: "2.5rem" }}>
            { parseInt( props.selectedWeather.main.temp ) }&deg;
          </p>
          <p>H: { parseInt( props.selectedWeather.main.temp_max ) }&deg; L: { parseInt( props.selectedWeather.main.temp_min ) }&deg;</p>
          <p
            className='text-secondary' 
            style={{ fontWeight: 'bold' }}>
            { props.selectedWeather.label }
          </p>
        </div>
        <div 
          style={{ zIndex: "0", width: "60%" }}
          className='d-flex flex-column flex-wrap justify-content-end'>
          <img 
            src={ props.selectedWeather.weather?.[ 0 ].main.toLowerCase().indexOf( 'cloud' ) === -1
              ? SunImage
              : CloudImage
            } 
            style={{ 
              position: "absolute",
              top: "-10vh",
              right: "0",
              height: "25vh",
              zIndex: "0"
            }}
          />
          <div id='weather-selected-info-container' className='mb-3' >
            <div className='d-flex flex-column col-12 col-md-4 justify-content-end align-items-end text-end'>
              <span 
                className='text-secondary'
                style={{ marginRight: "1rem" }}>
                { props.selectedWeather.created_at }
              </span>
            </div>
            <div className='d-flex flex-column col-12 col-md-4 justify-content-end align-items-end text-end'>
              <span 
                className='text-secondary'
                style={{ marginRight: "1rem" }}>
                { props.selectedWeather.main.humidity }%
              </span>
            </div>
            <div className='d-flex flex-column col-12 col-md-4 justify-content-end align-items-end text-end'>
              <span 
                className='text-secondary'
                style={{ marginRight: "1rem" }}>
                { props.selectedWeather.weather?.[ 0 ].main }
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <></>
  )
}

export default SelectedWeather