type ConfigKey =
  | 'authenticationRequired'
  | 'rescWebServiceUrl'
  | 'ssoRedirectUri'
  | 'ssoIdTokenIssuerUrl'
  | 'ssoAuthorizationUrl'
  | 'ssoTokenEndPointUrl'
  | 'ssoIdTokenJwksUrl'
  | 'ssoAccessTokenJwksUrl'
  | 'ssoGrantType'
  | 'ssoResponseType'
  | 'ssoScope'
  | 'ssoClientId'
  | 'ssoCodeChallengeMethod'
  | 'ssoJwtSigningAlgorithm'
  | 'ssoLoginPageMessage'
  | 'defaultPageSize'
  | 'skipRecords'
  | 'limitRecords'
  | 'azureDevOpsVal'
  | 'azureDevOpsLabel'
  | 'bitbucketVal'
  | 'bitbucketLabel'
  | 'githubPublicVal'
  | 'githubPublicLabel'
  | 'notAnalyzedStatusVal'
  | 'notAnalyzedStatusLabel'
  | 'notAccessibleStatusVal'
  | 'notAccessibleStatusLabel'
  | 'clarificationRequiredStatusVal'
  | 'clarificationRequiredStatusLabel'
  | 'outdatedStatusVal'
  | 'outdatedStatusLabel'
  | 'truePostiveStatusVal'
  | 'truePostiveStatusLabel'
  | 'falsePositiveStatusVal'
  | 'falsePositiveStatusLabel';

export default class Config {
  static get CONFIG() {
    return {
      authenticationRequired: '$VITE_AUTHENTICATION_REQUIRED',
      rescWebServiceUrl: '$VITE_RESC_WEB_SERVICE_URL',
      ssoRedirectUri: '$VITE_SSO_REDIRECT_URI',
      ssoIdTokenIssuerUrl: '$VITE_SSO_ID_TOKEN_ISSUER_URL',
      ssoAuthorizationUrl: '$VITE_SSO_AUTHORIZATION_URL',
      ssoTokenEndPointUrl: '$VITE_SSO_TOKEN_ENDPOINT_URL',
      ssoIdTokenJwksUrl: '$VITE_SSO_ID_TOKEN_JWKS_URL',
      ssoAccessTokenJwksUrl: '$VITE_SSO_ACCESS_TOKEN_JWKS_URL',
      ssoGrantType: 'authorization_code',
      ssoResponseType: 'code',
      ssoScope: '$VITE_SSO_SCOPE',
      ssoClientId: '$VITE_SSO_CLIENT_ID',
      ssoCodeChallengeMethod: '$VITE_SSO_CODE_CHALLENGE_METHOD',
      ssoJwtSigningAlgorithm: '$VITE_SSO_JWT_SIGNING_ALOGORITHM',
      ssoLoginPageMessage: '$VITE_SSO_LOGIN_PAGE_MESSAGE',
      defaultPageSize: '100',
      skipRecords: '0',
      limitRecords: '100',
      azureDevOpsVal: 'AZURE_DEVOPS',
      azureDevOpsLabel: 'Azure DevOps',
      bitbucketVal: 'BITBUCKET',
      bitbucketLabel: 'Bitbucket',
      githubPublicVal: 'GITHUB_PUBLIC',
      githubPublicLabel: 'GitHub Public',
      notAnalyzedStatusVal: 'NOT_ANALYZED',
      notAnalyzedStatusLabel: 'Not Analyzed',
      notAccessibleStatusVal: 'NOT_ACCESSIBLE',
      notAccessibleStatusLabel: 'Not Accessible',
      clarificationRequiredStatusVal: 'CLARIFICATION_REQUIRED',
      clarificationRequiredStatusLabel: 'Clarification Required',
      outdatedStatusVal: 'OUTDATED',
      outdatedStatusLabel: 'Outdated',
      truePostiveStatusVal: 'TRUE_POSITIVE',
      truePostiveStatusLabel: 'True Positive',
      falsePositiveStatusVal: 'FALSE_POSITIVE',
      falsePositiveStatusLabel: 'False Positive',
    };
  }

  static value(name: ConfigKey): string {
    if (!(name in this.CONFIG)) {
      throw new Error(`Configuration: There is no key named "${name}"`);
    }

    const value = this.CONFIG[name];

    if (!value) {
      throw new Error(`Configuration: Value for "${name}" is not defined`);
    }

    if (value.startsWith('$VITE_')) {
      // value was not replaced, it seems we are in development.
      // Remove $ and get current value from import.meta.env
      const envName = value.substring(1);
      const envValue = import.meta.env[envName] as string;
      if (envValue) {
        return envValue;
      } else {
        throw new Error(`Configuration: Environment variable "${envName}" is not defined`);
      }
    } else {
      // value was already replaced, it seems we are in production.
      return value;
    }
  }
}

export const MAX_COMMENT_LENGTH = 255;
export const PAGE_SIZE_20 = 20;
export const PAGE_SIZE_50 = 50;
export const PAGE_SIZE_100 = 100;
export const PAGE_SIZE_500 = 500;
export const PAGE_SIZE_1000 = 1000;

export const PAGE_SIZES = [
  PAGE_SIZE_20,
  PAGE_SIZE_50,
  PAGE_SIZE_100,
  PAGE_SIZE_500,
  PAGE_SIZE_1000,
];
