import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
	baseUrl: 'https://technotes-api-iwo9.onrender.com/',
	credentials: 'include',
	prepareHeaders: (headers, { getState }) => {
		const token = getState().auth.token

		if (token) {
			headers.set('authorization', `Bearer ${token}`)
		}
		return headers
	}
})

const baseQueryReauth = async (args, api, extraoptions) => {
	// console.log(args) //request url, method, body
	// console.log(api) // signal, dispatch, getState()
	// console.log(extraoptions) //custom like {shout: true}

	let result = await baseQuery(args, api, extraoptions)

	// If you want, handle other status codes, too
	if (result?.error?.status === 403) {
		console.log('Sending refresh token')

		// send refresh token to get new access token
		const refreshResult = await baseQuery('/auth/refresh', api, extraoptions)

		if (refreshResult?.data) {

			// store the new token
			api.dispatch(setCredentials({ ...refreshResult.data }))

			// retry original query with new access token
			result = await baseQuery(args, api, extraoptions)
		} else {

			if (refreshResult?.error.status === 403) {
				refreshResult.error.data.message = "Your login has expired."
			}
			return refreshResult
		}
	}

	return result
}

export const apiSlice = createApi({
	baseQuery: baseQueryReauth,
	tagTypes: ['Note', 'User'],
	endpoints: builder => ({})
})