import { useState } from 'react'
import { DateTime } from 'luxon'
import { cloneDeep } from 'lodash'
import Geonames from 'geonames.js'

import { Get } from 'Utils/axios'

const HOC = WrappedComponent => {
  const WithHOC = props => {
    const [ state, setState ] = useState({
      onLoadWeatherHOC: false,
      countries: [],
      cities: [],
      selectedCountry: null,
      selectedCity: null,
      selectedWeather: {},
      weatherHocError: {},
      searchHistories: [] 
    })

    const load = isLoading => setState({ ...state, onLoadWeatherHOC: isLoading })

    const onChangeWeatherHOC = ( key, value ) => setState({ ...state, [ key ]: value })

    const getCountries = ( name, state ) => Get(
      `https://restcountries.com/v3.1/name/${ name }`,
      payload => getCountriesSuccess( payload, state ),
      () => getCountriesError( state ),
      load
    )
    const getCountriesSuccess = ( payload, state ) => setState({ 
      ...state,
      onLoadWeatherHOC: false,
      weatherHocError: {},
      countries: payload.map( country => ({
        latlng: country.latlng,
        label: country.name.official,
        value: country.cca2
      }))
    })
    const getCountriesError = state => setState({ 
      ...state,
      onLoadWeatherHOC: false,
      weatherHocError: {
        ...state.weatherHocError,
        selectedCountry: 'Invalid country'
      }
    })

    const getCities = async( citiesQuery, state ) => {
      setState({
        ...state,
        onLoadWeatherHOC: true
      })

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
        getCitiesSuccess( payload, state )
      )).catch( () => (
        getCitiesError( state )
      ))
    }
    const getCitiesSuccess = ( payload, state ) => setState({ 
      ...state,
      onLoadWeatherHOC: false,
      weatherHocError: {},
      cities: payload.geonames.map( city => ({
        lat: city.lat,
        lng: city.lng,
        label: `${ city.name }, ${ city.countryName }`,
        value: city.geonameId
      }))
    })
    const getCitiesError = state => setState({ 
      ...state,
      onLoadWeatherHOC: false,
      weatherHocError: {
        ...state.weatherHocError,
        selectedCity: 'Invalid city'
      }
    })

    const getSelectedWeather = ( lat, lon, label ) => Get(
      ` https://cors-anywhere.herokuapp.com/` + 
      `https://api.openweathermap.org/data/2.5/weather?` +
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
      countries: [],
      cities: [],
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