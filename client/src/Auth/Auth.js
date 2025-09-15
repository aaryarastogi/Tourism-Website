export const deleteExpiredToken=()=>{ 
    const token = localStorage.getItem('token'); 
    if (token) { 
      const { exp } = JSON.parse(atob(token.split('.')[1])); 
      const expirationTime = new Date(exp * 1000); 
      if (expirationTime < new Date()) { 
        localStorage.removeItem('token'); 
      } 
    } 
  } 