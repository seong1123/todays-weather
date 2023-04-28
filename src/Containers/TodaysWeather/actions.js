import { useState } from 'react'
import { DateTime } from 'luxon'
import { cloneDeep } from 'lodash'
import Geonames from 'geonames.js'

import { Get } from 'Utils/ajax'

const HOC = WrappedComponent => {
  const WithHOC = props => {
    const [ state, setState ] = useState({
      onLoadWeatherHOC: false,
      cities: [],
      countries: [],
      selectedCountry: null,
      selectedCity: null,
      selectedWeather: {},
      weatherHocError: {},
      searchHistories: [] 
    })

    const load = isLoading => setState({ ...state, onLoadWeatherHOC: isLoading })

    const onChangeWeatherHOC = ( key, value ) => setState({ ...state, [ key ]: value })

    const getCountries = ( countriesQuery, callback, state, setCountriesIsLoading ) => Get(
      `https://restcountries.com/v3.1/name/${ countriesQuery }`,
      payload => getCountriesSuccess( payload, callback, state, setCountriesIsLoading ),
      () => getCountriesError( state, callback, setCountriesIsLoading ),
      setCountriesIsLoading
    )
    const getCountriesSuccess = ( payload, callback, state, setCountriesIsLoading ) => {
      const tmpState = cloneDeep( state )
      const tmpCountries = payload.map( country => ({
        latlng: country.latlng,
        label: country.name.official,
        value: country.cca2
      }))

      tmpState.countries = tmpCountries
      tmpState.weatherHocError = {}

      setState( tmpState )
      setCountriesIsLoading( false )
      return callback( tmpCountries )
    }
    const getCountriesError = ( state, callback, setCountriesIsLoading ) => {
      setState({ 
        ...state,
        weatherHocError: {
          ...state.weatherHocError,
          selectedCountry: 'Invalid country'
        }
      })
      setCountriesIsLoading( false )
      return callback( [] )
    }

    const getCities = async( citiesQuery, callback, state, setCitiesIsLoading ) => {
      setCitiesIsLoading( true )
      const geonames = Geonames({
        username: GEONAMES_ORG_USERNAME,
        encoding: 'JSON'
      })
      const geonamesSearchParams = {
        name: encodeURIComponent( citiesQuery ),
        maxRows: 20,
      }

      if( state.selectedCountry ){
        geonamesSearchParams.country = state.selectedCountry.value
      }
      return await geonames.search(
        geonamesSearchParams
      ).then( payload => (
        getCitiesSuccess( payload, state, callback, setCitiesIsLoading )
      )).catch( () => (
        getCitiesError( state, callback, setCitiesIsLoading )
      ))
    }
    const getCitiesSuccess = ( payload, state, callback, setCitiesIsLoading ) => {
      const tmpCities = payload.geonames.map( city => ({
        lat: city.lat,
        lng: city.lng,
        label: `${ city.name }, ${ city.countryName }`,
        value: city.geonameId.toString()
      }))
      const tmpState = cloneDeep( state ) 

      tmpState.cities = tmpCities
      tmpState.weatherHocError = tmpCities.length === 0 
        ? { ...state.weatherHocError, selectedCity: 'City not found' }
        : {}
        
      setState( tmpState )
      setCitiesIsLoading( false )
      return callback( tmpCities )
    }
    const getCitiesError = ( state, callback, setCitiesIsLoading ) => {
      setState({ 
        ...state,
        weatherHocError: {
          ...state.weatherHocError,
          selectedCity: 'Invalid city'
        }
      })
      setCitiesIsLoading( false )
      return callback( [] )
    }

    const getSelectedWeather = ( lat, lon, label ) => Get(
      'https://api.openweathermap.org/data/2.5/weather?' +
      `lat=${ lat }&lon=${ lon }&appid=${ OPENWEATHER_APP_ID }&units=metric`,
      payload => getSelectedWeatherSuccess( payload, label ),
      getSelectedWeatherError,
      load
    )
    const getSelectedWeatherSuccess = ( payload, label ) => {
      const tmpSearchHistories = cloneDeep( state.searchHistories )
      const tmpSelectedWeather = {
        ...payload,
        label: label,
        created_at: DateTime.now().toFormat( 'dd-LL-yyyy HH:mma' ).toLowerCase(),
      }
      tmpSearchHistories.unshift( tmpSelectedWeather )
      setState({ 
        ...state,
        onLoadWeatherHOC: false,
        weatherHocError: {},
        selectedWeather: tmpSelectedWeather,
        searchHistories: tmpSearchHistories
      })
      localStorage.setItem( 'WEATHER_SEARCH_HISTORIES', JSON.stringify( tmpSearchHistories ) )
    }
    const getSelectedWeatherError = () => setState({ 
      ...state,
      onLoadWeatherHOC: false,
      weatherHocError: {
        selectedCity: 'Please try again',
        selectedCountry: 'Please try again'
      }
    })

    const resetWeatherHOC = () => setState({
      ...state,
      onLoadWeatherHOC: false,
      selectedCountry: null,
      selectedCity: null,
      weatherHocError: {}
    })

    return(
      <WrappedComponent
        { ...props }
        { ...state }
        weatherHocState={ state }
        onChangeWeatherHOC={ onChangeWeatherHOC }
        getCountries={ getCountries }
        getCities={ getCities }
        getSelectedWeather={ getSelectedWeather }
        resetWeatherHOC={ resetWeatherHOC }
      />
    )
  }

  return WithHOC
} 

const OPENWEATHER_APP_ID = 'ddf41a196a3fc6ffe2e72cd323398a17'
const GEONAMES_ORG_USERNAME = 'y3ohfs'

export default HOC