export const Get = ( url, response, error, load ) => {
  load( true )
  return fetch( 
    url
  ).then( data => {
    return data.json()
  }).then( async res => {
    await response( res )
  }).catch( err => {
    error( err )
  })
}