import jwtDecode from 'jwt-decode';

class Auth {
  constructor() {
    this.flush();
  }

  flush() {
    this.isLoggedIn = false;
    this.jwtToken = null;
    this.saveToken = null;
    this.claim = null;
  }

  logout() {
    this.flush();
    localStorage.removeItem('JWT');
  }

  storeToken() {
    localStorage.setItem('JWT', this.jwtToken);
  }

  restoreAuth() {
    if (localStorage.getItem('JWT') === null) return false;
    const token = localStorage.getItem('JWT');

    this.isLoggedIn = true;
    this.jwtToken = token;
    this.saveToken = true;
    this.claim = jwtDecode(token).user;
    return true;
  }

  async attemptAuth(cookieToken) {
    this.flush();

    this.isLoggedIn = true;
    this.claim = jwtDecode(cookieToken).user;
    this.jwtToken = cookieToken;
  }

}

export default new Auth();
