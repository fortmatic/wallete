let handleLoginWithMagicLink = (e) => {
  fmPhantom.loginWithMagicLink({email: getInputValue(e, 'email')}).then((user) => {
    document.getElementById('status').innerHTML = 'Log in successful!'
  }).catch((err) => (document.getElementById('status').innerHTML = err));
  document.getElementById('status').innerHTML = 'Magic Link Sent, Please Check your email'
};

let handleIsLoggedIn = async () => {
  alert(await fmPhantom.user.isLoggedIn());
};

let handleLogout = async () => {
  await fmPhantom.user.logout();
  document.getElementById('status').innerHTML = 'Login Status'
};

let handleGetMetadata = async () => {
  const metadata = await fmPhantom.user.getMetadata();
  alert(JSON.stringify(metadata));
};

