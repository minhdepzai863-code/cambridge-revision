export async function submitAccount(form, showMessage){
 const submit=form.querySelector('button[type="submit"]'),error=form.querySelector('.account-error');
 if(submit.disabled)return;
 submit.disabled=true;
 error.hidden=true;
 const data=new FormData(form),email=String(data.get('email')||'').trim(),password=data.get('password');
 try{
  const {signIn,signUp,requestPasswordReset,resetPassword}=await import('./store.mjs');
  switch(form.dataset.screen){
   case '/login':
    await signIn(email,password);
    location.replace('/dashboard');
    break;
   case '/signup':
    if(await signUp(email,password))location.replace('/dashboard');
    else {
     showMessage('Check your email for an account confirmation link. After confirming, return to your workspace.');
    }
    break;
   case '/forgot-password':
    await requestPasswordReset(email);
    showMessage('If an account matches that address, a password recovery link will arrive shortly.');
    break;
   case '/reset-password':
    if(password!==data.get('confirmation'))throw new Error('The passwords do not match.');
    await resetPassword(password);
    history.replaceState(null,'','/login');
    showMessage('Password updated. Log in with your new password.');
    break;
  }
 }catch(e){
  error.textContent=e.message||'The account request failed. Please try again.';
  error.hidden=false;
 }finally{submit.disabled=false;}
}
