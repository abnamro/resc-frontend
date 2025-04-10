#!/bin/sh

# Replace env vars in JavaScript files
echo "Replacing env vars in JS"
FILES=`find /app -type f \( -iname "*.js*" -not -iname "*.spec.js" \) `
for file in $FILES
do
  echo "Processing $file ...";

  # Use the existing JS file as template
  if [ ! -f $file.tmpl.js ]; then
    cp $file $file.tmpl.js
  fi
  
  ENVVARS=$(echo \
    '$VITE_SSO_LOGIN_PAGE_MESSAGE' \
    '$VITE_SSO_SCOPE' \
    '$VITE_SSO_CLIENT_ID' \
    '$VITE_SSO_JWT_SIGNING_ALOGORITHM' \
    '$VITE_SSO_CODE_CHALLENGE_METHOD' \
    '$VITE_AUTHENTICATION_REQUIRED' \
    '$VITE_RESC_WEB_SERVICE_URL' \
    '$VITE_SSO_REDIRECT_URI' \
    '$VITE_SSO_ID_TOKEN_ISSUER_URL' \
    '$VITE_SSO_AUTHORIZATION_URL' \
    '$VITE_SSO_TOKEN_ENDPOINT_URL' \
    '$VITE_SSO_ID_TOKEN_JWKS_URL' \
    '$VITE_SSO_ACCESS_TOKEN_JWKS_URL' \
  )
  envsubst "${ENVVARS// /,}" < $file.tmpl.js > $file
done

# if $VITE_SSO_ID_TOKEN_ISSUER_URL is set
# replace "connect-src 'self';" with "connect-src 'self' $VITE_SSO_ID_TOKEN_ISSUER_URL;" in /etc/nginx/nginx.conf
if [[ ! -z $VITE_SSO_ID_TOKEN_ISSUER_URL ]]; then
    findstring="connect-src 'self';"
    replacestring="connect-src 'self' $VITE_SSO_ID_TOKEN_ISSUER_URL;"
    echo "Content-Security-Policy Replacing $findstring with $replacestring"
    sed -i -e "s#$findstring#$replacestring#g" /etc/nginx/nginx.conf
fi

/docker-entrypoint.sh "$@"
nginx -g 'daemon off;'