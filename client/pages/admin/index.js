import Layout from '../../components/Layout';
import axios from 'axios';

const Admin = ({ todos }) => {
	return <Layout>{JSON.stringify(todos)}</Layout>;
};

Admin.getInitialProps = async () => {
	const response = await axios.get(
		`https://jsonplaceholder.typicode.com/todos`,
	);
	return {
		todos: response.data,
	};
};

export default Admin;
