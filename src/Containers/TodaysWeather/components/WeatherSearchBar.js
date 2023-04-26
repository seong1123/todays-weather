import { useState, useEffect, useRef, useCallback } from 'react'
import { MdSearch, MdClose } from 'react-icons/md'
import { isEmpty, debounce } from 'lodash'
import { 
  Row, Col, 
  Form, FormGroup, FormText,
  Button
} from 'reactstrap'
import ReactSelect from 'react-select'

const WeatherSearchBar = props => {
  const citiesDropdownRef = useRef()
  const countriesDropdownRef = useRef()
  const [ citiesQuery, setCitiesQuery ] = useState( '' )
  const [ countriesQuery, setCountriesQuery ] = useState( '' )

  useEffect( () => {
    if( !isEmpty( citiesQuery ) && citiesQuery.indexOf( ' ') === -1 ) {
      searchCities( citiesQuery, props.weatherHocState )
    }
  }, [ citiesQuery ] )
  
  useEffect( () => {
    if( !isEmpty( countriesQuery ) ) {
      searchCountries( countriesQuery, props.weatherHocState )
    }
  }, [ countriesQuery ] )

  useEffect( () => {
    if( !isEmpty( props.weatherHocError?.selectedCity ) ) {
      citiesDropdownRef.current.blur()
    }
    if( !isEmpty( props.weatherHocError?.selectedCountry ) ) {
      countriesDropdownRef.current.blur()
    }
  }, [ props.weatherHocError ] )

  const searchCities = useCallback(
    debounce( 
      ( citiesQuery, weatherHocState ) => props.getCities( citiesQuery, weatherHocState ), 
      500 
    ), 
    [] 
  )

  const searchCountries = useCallback(
    debounce( 
      ( countriesQuery, weatherHocState ) => props.getCountries( countriesQuery, weatherHocState ), 
      500 
    ), 
    [] 
  )

  return(
    <Form style={{ marginBottom: !isEmpty( props.selectedWeather ) ? "15vh" : "2rem" }} >
      <Row>
        <Col md={ 5 }>
          <FormGroup>
            <ReactSelect
              placeholder='City'
              ref={ citiesDropdownRef }
              options={ props.cities }
              value={ props.selectedCity } 
              isClearable={ !isEmpty( props.selectedCity ) }
              onInputChange={ e => setCitiesQuery( e ) }
              onChange={ e => props.onChangeWeatherHOC( 'selectedCity', e ) }
              noOptionsMessage={ () => 'Enter city name to start the search' }
              styles={{
                menu: styles => ({ ...styles, zIndex: 9999 }),
                singleValue: styles => ({ ...styles, color: props.isLightThemed ? '#000000' : '#ffffff' }),
                input: styles => ({ ...styles, color: props.isLightThemed ? '#000000' : '#ffffff' }),
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
            <ReactSelect
              placeholder='Country'
              ref={ countriesDropdownRef }
              options={ props.countries }
              value={ props.selectedCountry } 
              isClearable={ !isEmpty( props.selectedCountry ) }
              onInputChange={ e => setCountriesQuery( e ) }
              noOptionsMessage={ () => 'Enter country name to start the search' }
              onChange={ e => props.onChangeWeatherHOC( 'selectedCountry', e ) }
              styles={{
                menu: styles => ({ ...styles, zIndex: 9999 }),
                singleValue: styles => ({ ...styles, color: props.isLightThemed ? '#000000' : '#ffffff' }),
                input: styles => ({ ...styles, color: props.isLightThemed ? '#000000' : '#ffffff' }),
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
            <Button 
              color='primary'
              style={{ height: '38px' }} 
              onClick={ () => props.resetWeatherHOC() } >
              <MdClose size='1rem' />
            </Button>
          </FormGroup>
        </Col>
      </Row>
    </Form>   
  )
}

export default WeatherSearchBar