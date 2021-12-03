import Layout from '../../components/Layout';
import axios from 'axios';
import withAdmin from '../withAdmin';

const Admin = ({ user }) => {
	return <Layout>Hello world! {JSON.stringify(user)}</Layout>;
};

export default withAdmin(Admin);
