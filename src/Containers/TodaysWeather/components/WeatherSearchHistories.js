import { 
  Card, CardBody, 
  Button, UncontrolledTooltip 
} from 'reactstrap'
import { MdSearch } from 'react-icons/md'
import { FaTrash } from 'react-icons/fa'
import { cloneDeep } from 'lodash'

const WeatherSearchHistories = props => {
  return(
    <Card>
      <CardBody>
        <p className='mb-3'>Search History</p>
        <div 
          id='weather-search-histories-container'
          style={{ 
            maxHeight: "50vh",
            overflow: "scroll",
            scrollBehavior: "smooth" 
          }} >
          {
            props.searchHistories.length > 0 ? (
              props.searchHistories.map( ( weatherHistory, index ) => (
                <Card key={ index } className='mb-3' >
                  <CardBody>
                    <div className='d-flex flex-row flex-nowrap' >
                      <div 
                        style={{ width: "70%" }}
                        className='d-flex flex-row flex-wrap align-items-center' >
                        <span style={{ display: "flex", flex: "1" }}>{ weatherHistory.label }</span>
                        <span 
                          className='text-tertiary'
                          style={{ width: "40%", fontSize: "80%" }}>
                          { weatherHistory.created_at }
                        </span>
                      </div>
                      <div 
                        style={{ width: "30%" }}
                        className='d-flex flex-row flex-nowrap justify-content-end align-items-center' >
                        <Button 
                          style={{ marginRight: "0.5rem" }} 
                          id={ `weather-search-again-button-${ index }` }
                          className={ `rounded-button ${ props.isLightThemed ? 'white' : 'transparent' }-background` }
                          onClick={ () => props.getSelectedWeather( 
                            weatherHistory.coord.lat, 
                            weatherHistory.coord.lon, 
                            weatherHistory.label 
                          )}>
                          <MdSearch size='1rem' />
                        </Button>
                        <UncontrolledTooltip target={ `weather-search-again-button-${ index }` }>
                          Check weather
                        </UncontrolledTooltip>
                        <Button 
                          id={ `weather-delete-button-${ index }` }
                          className={ `rounded-button ${ props.isLightThemed ? 'white' : 'transparent' }-background` }
                          onClick={ () => {
                            const tmpSearchHistories = cloneDeep( props.searchHistories )
                            tmpSearchHistories.splice( index, 1 )
                            props.onChangeWeatherHOC( 'searchHistories', tmpSearchHistories )
                            localStorage.setItem( 'WEATHER_SEARCH_HISTORIES', JSON.stringify( tmpSearchHistories ) )
                          }} >
                          <FaTrash size='1rem' />
                          <UncontrolledTooltip target={ `weather-delete-button-${ index }` }>
                            Remove search history
                          </UncontrolledTooltip>
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))  
            ) : (
              <p className='text-center'>No Record</p>
            )
          }
        </div>
      </CardBody>
    </Card>
  )
}

export default WeatherSearchHistories