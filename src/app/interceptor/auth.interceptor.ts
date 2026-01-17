import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = 'https://crypto-back-ptdf.onrender.com/api/v1/';
  // const baseUrl = 'https://crypto-back-ptdf.onrender.com/';

  var requestUrl = req.url;
  if (!req.url.startsWith('http')) {
    requestUrl = `${baseUrl}${req.url}`;
  }
  
  const modifiedReq = req.clone({
    url: requestUrl,
    setHeaders: {
      'Content-Type': 'application/json'
      //Authorization: `Bearer my-fake-token-123`
    }
  });

  return next(modifiedReq);
};
