var currentLanguageStorage = {
  'error_404': 'Command not found!',
  'error_500': 'Ooops! Server error!',

  'error_100': 'Request method must be `POST`.',
  'error_101': 'Token in not defined in url!',
  'error_102': 'Token in not valid!',
  'error_103': 'Cannot parse your data!',
  'error_104': 'Unexpected error in sending message!',
  'error_105': 'Necessary field in your data is missing!',
  'error_106': 'SMS center not defined properly for this token!',
}

export default function l10n (key: string) {
  return currentLanguageStorage[key] || key;
}
