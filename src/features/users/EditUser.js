import { useParams } from 'react-router-dom'
import EditUserForm from './EditUserForm'
import { PulseLoader } from 'react-spinners'
import { useGetUsersQuery } from './usersApiSlice'
import useTitle from '../../hooks/useTitle'

const EditUser = () => {
	useTitle('Edit User')
    const { id } = useParams()

    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[id]
        }),
    })

    if (!user) return <PulseLoader color='#FFF'/>
    
    const content =  <EditUserForm user={user} />

    return content
}
export default EditUser