import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import NProgress from 'nprogress';
import Router from 'next/router';

Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Layout = ({ children }) => {
	const head = () => (
		<React.Fragment>
			<link
				href='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css'
				rel='stylesheet'
				integrity='sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3'
				crossOrigin='anonymous'
			/>
			{/* <link
				rel="stylesheet"
				href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
				integrity="sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ=="
				crossorigin="anonymous"
			/> */}
			<link rel='stylesheet' href='/static/css/styles.css' />
		</React.Fragment>
	);

	const nav = () => (
		<ul className='nav nav-tabs bg-warning'>
			<li className='nav-item'>
				<Link href='/'>
					<a className='nav-link text-dark'>Home</a>
				</Link>
			</li>
			<li className='nav-item'>
				<Link href='/login'>
					<a className='nav-link text-dark'>Login</a>
				</Link>
			</li>
			<li className='nav-item'>
				<Link href='/register'>
					<a className='nav-link text-dark'>Register</a>
				</Link>
			</li>
		</ul>
	);

	return (
		<React.Fragment>
			{head()} {nav()} <div className='container pt-5 pb-5'>{children}</div>
		</React.Fragment>
	);
};

export default Layout;
