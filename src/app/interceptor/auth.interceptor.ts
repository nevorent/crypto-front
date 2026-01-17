import { HttpInterceptorFn, HttpParams } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = 'https://crypto-back-ptdf.onrender.com/api/v1/';
  // const baseUrl = 'https://crypto-back-ptdf.onrender.com/';

  var requestUrl = req.url;
  if (!req.url.startsWith('http')) {
    requestUrl = `${baseUrl}${req.url}`;
  }

  var newHeaders = req.headers;

  if (!req.headers.has('Content-Type') && !(req.body instanceof HttpParams)) {
    newHeaders = newHeaders.set('Content-Type', 'application/json');
  }

  const token = getCookie('access_token');
  const tokenType = getCookie('token_type') || 'Bearer';

  if (token) {
    newHeaders = newHeaders.set('Authorization', `${tokenType} ${token}`);
  }
  
  const modifiedReq = req.clone({
    url: requestUrl,
    headers: newHeaders
  });

  return next(modifiedReq);
};

function getCookie(name: string): string | null {
  const matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : null;
}
