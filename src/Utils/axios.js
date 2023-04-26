import Axios from 'axios'

export const Get = ( url, response, error, load ) => {
  load( true )
  return Axios.get( 
    url,
    { headers: { 'Access-Control-Allow-Origin': window.location.origin } }
  ).then( async res => {
    await response( res.data )
  }).catch( err => {
    error( err )
  })
}