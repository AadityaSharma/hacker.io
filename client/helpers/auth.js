import cookie from 'js-cookie';
import Router from 'next/router';

// set in cookie
export const setCookie = (key, value) => {
	// this is similar to writing if(window)
	if (process.browser) {
		cookie.set(key, value, { expires: 1 });
	}
};

// remove from cookie
export const removeCookie = (key) => {
	// this is similar to writing if(window)
	if (process.browser) {
		cookie.remove(key);
	}
};

// get from cookie such as stored token
// will be useful when we need to make request to server with auth token
export const getCookie = (key) => {
	if (process.browser) {
		return cookie.get(key);
	}
};

// set in localstorage
export const setLocalStorage = (key, value) => {
	if (process.browser) {
		localStorage.setItem(key, JSON.stringify(value));
	}
};

// remove from localstorage
export const removeLocalStorage = (key) => {
	if (process.browser) {
		localStorage.removeItem(key);
	}
};

// authenticate user by passing  data to cookie and localstorage during signin
export const authenticate = (response, next) => {
	setCookie('token', response.data.token);
	setLocalStorage('user', response.data.user);
	next();
};

// access user info from localstorage
export const isAuth = () => {
	if (process.browser) {
		const cookieChecked = getCookie('token');
		if (cookieChecked) {
			if (localStorage.getItem('user')) {
				return JSON.parse(localStorage.getItem('user'));
			}
		}
		return false;
	}
};

// logout the user
export const logout = () => {
	removeLocalStorage('user');
	removeCookie('token');
	Router.push('/login');
};
