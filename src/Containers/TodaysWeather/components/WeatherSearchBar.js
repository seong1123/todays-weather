import { useState, useEffect, useRef, useCallback } from 'react'
import { MdSearch, MdClose } from 'react-icons/md'
import { isEmpty } from 'lodash'
import { 
  Row, Col, 
  Form, FormGroup, FormText,
  Button, UncontrolledTooltip
} from 'reactstrap'
import AsyncSelect from 'react-select/async'
import debounce from 'debounce-promise'

const WeatherSearchBar = props => {
  const citiesDropdownRef = useRef()
  const countriesDropdownRef = useRef()
  const [ citiesIsLoading, setCitiesIsLoading ] = useState( false )
  const [ countriesIsLoading, setCountriesIsLoading ] = useState( false )

  useEffect( () => {
    if( !isEmpty( props.weatherHocError?.selectedCity ) ) {
      citiesDropdownRef.current.blur()
    }
    if( !isEmpty( props.weatherHocError?.selectedCountry ) ) {
      countriesDropdownRef.current.blur()
    }
  }, [ props.weatherHocError ] )

  useEffect( () => {
    if( !isEmpty( props.selectedWeather ) ) {
      document.getElementById( 'weather-search-histories-container' ).scrollTop = 0
    }
  }, [ props.selectedWeather ] )

  const searchCities = useCallback(
    debounce( 
      (
        countriesQuery, 
        callback, 
        weatherHocState
      ) => props.getCities( countriesQuery, callback, weatherHocState, setCitiesIsLoading ),
      500 
    ), 
    [] 
  )

  const searchCountries = useCallback(
    debounce( 
      ( 
        countriesQuery, 
        callback, 
        weatherHocState
      ) => props.getCountries( countriesQuery, callback, weatherHocState, setCountriesIsLoading ), 
      500 
    ), 
    [] 
  )

  return(
    <Form style={{ marginBottom: !isEmpty( props.selectedWeather ) ? "7vh" : "2rem" }} >
      <Row>
        <Col md={ 5 }>
          <FormGroup>
            <AsyncSelect
              placeholder='City'
              ref={ citiesDropdownRef }
              value={ props.selectedCity } 
              isLoading={ citiesIsLoading }
              defaultOptions={ props.cities }
              isClearable={ !isEmpty( props.selectedCity ) }
              onChange={ e => props.onChangeWeatherHOC( 'selectedCity', e ) }
              noOptionsMessage={ () => 'Enter city name to start the search' }
              loadOptions={ ( citiesQuery, callback ) => searchCities(
                citiesQuery, 
                callback, 
                props.weatherHocState
              )}
              styles={{
                menu: styles => ({ ...styles, zIndex: 9999 }),
                input: styles => ({ ...styles, color: props.isLightThemed ? '#000000' : '#ffffff' }),
                singleValue: styles => ({ ...styles, color: props.isLightThemed ? '#000000' : '#ffffff' }),
                placeholder: styles => ({ ...styles, color: props.isLightThemed ? '#000000' : '#ffffff' }),
                control: styles => ({
                  ...styles,
                  ...( 
                    props.weatherHocError?.selectedCity
                      ? { borderColor: "#dc3545 !important", boxShadow: "none" } 
                      : {} 
                  ),
                  backgroundColor: props.isLightThemed ? 'rgba(255, 255, 255, 0.2)' : 'rgba(26, 26, 26, 0.3)'
                })
              }}
            />
            <FormText color='danger'>{ props.weatherHocError?.selectedCity }</FormText>
          </FormGroup>
        </Col>
        <Col md={ 5 }>
          <FormGroup>
            <AsyncSelect
              placeholder='Country'
              ref={ countriesDropdownRef }
              value={ props.selectedCountry } 
              isLoading={ countriesIsLoading }
              defaultOptions={ props.countries }
              isClearable={ !isEmpty( props.selectedCountry ) }
              onChange={ e => props.onChangeWeatherHOC( 'selectedCountry', e ) }
              noOptionsMessage={ () => 'Enter country name to start the search' }
              loadOptions={ ( countriesQuery, callback ) => searchCountries(
                countriesQuery,
                callback,
                props.weatherHocState
              )}
              styles={{
                menu: styles => ({ ...styles, zIndex: 9999 }),
                input: styles => ({ ...styles, color: props.isLightThemed ? '#000000' : '#ffffff' }),
                singleValue: styles => ({ ...styles, color: props.isLightThemed ? '#000000' : '#ffffff' }),
                placeholder: styles => ({ ...styles, color: props.isLightThemed ? '#000000' : '#ffffff' }),
                control: styles => ({
                  ...styles,
                  ...( 
                    props.weatherHocError?.selectedCountry
                      ? { borderColor: "#dc3545 !important", boxShadow: "none" } 
                      : {} 
                  ),
                  backgroundColor: props.isLightThemed ? 'rgba(255, 255, 255, 0.2)' : 'rgba(26, 26, 26, 0.3)'
                })
              }}
            />
            <FormText color='danger'>{ props.weatherHocError?.selectedCountry }</FormText>
          </FormGroup>
        </Col>
        <Col md={ 2 }>
          <FormGroup className='d-flex flex-row justify-content-end'>
            <Button 
              color='primary'
              id='weather-search-button'
              style={{ height: '38px', marginRight: '0.5rem' }} 
              disabled={ isEmpty( props.selectedCountry ) && isEmpty( props.selectedCity ) }
              onClick={ () => {
                const lat = !isEmpty( props.selectedCity ) 
                  ? props.selectedCity.lat 
                  : props.selectedCountry.latlng[ 0 ] 
                const lon = !isEmpty( props.selectedCity ) 
                  ? props.selectedCity.lng 
                  : props.selectedCountry.latlng[ 1 ] 
                const label = !isEmpty( props.selectedCity ) 
                  ? props.selectedCity.label 
                  : props.selectedCountry.label
                return props.getSelectedWeather( lat, lon, label )
              }}>
              <MdSearch size='1rem' />
            </Button>
            <UncontrolledTooltip target='weather-search-button'>
              Check weather
            </UncontrolledTooltip>
            <Button 
              color='primary'
              id='weather-clear-button'
              style={{ height: '38px' }} 
              onClick={ () => props.resetWeatherHOC() } >
              <MdClose size='1rem' />
              <UncontrolledTooltip target='weather-clear-button'>
                Reset
              </UncontrolledTooltip>
            </Button>
          </FormGroup>
        </Col>
      </Row>
    </Form>   
  )
}

export default WeatherSearchBar