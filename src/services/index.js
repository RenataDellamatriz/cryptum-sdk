const AxiosApi = require('../../axios')
const {
  UnauthorizedException,
  GenericException,
  NotCanMountException,
  NotImplementedException,
  InvalidTypeException,
} = require('../../errors')

/**
 * Method to get an specific api method how get, post, put and delete
 *
 * All methods present in axios are compatibles with this method
 * @param {Object} setup an object with this data: { requests, key, config }, requests an list with requests,
 * an example is { key: { method: 'post' } }, key an string key to get specific request, and config is an object
 * with this data: { enviroment: 'production'/'development' }
 *
 * @returns an method to make an request using axios
 */
const getApiMethod = ({ requests, key, config }) => {
  const axios = new AxiosApi(config)
  const api = axios.getInstance()

  const value = requests[key]
  const method = api[value.method.toLowerCase()]
  return method
}

/**
 * Method to handle errors and throw an error by response
 * @param {*} error
 */
const handleRequestError = error => {
  if (error instanceof NotCanMountException) throw error
  if (error instanceof NotImplementedException) throw error
  if (error instanceof InvalidTypeException) throw error

  if (!error.response) return error
  if (!error || !error.response.data.error)
    throw new Error('An error not mapped has occurred')

  if (error.response.status == 401) throw new UnauthorizedException()

  const mappedError = error.response.data.error
  throw new GenericException(mappedError.code, mappedError.type)
}

const mountTokenHeaders = userCryptum => ({
  Authorization: `Bearer ${userCryptum.token}`,
})

module.exports = { getApiMethod, handleRequestError, mountTokenHeaders }
