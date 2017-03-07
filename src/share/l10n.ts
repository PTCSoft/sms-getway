var currentLanguageStorage = {
  'error_404': 'Command not found!',
  'error_500': 'Ooops! Server error!',

  'error_100': 'Request method must be `POST`.',
  'error_101': 'Token in not defined in url!',
  'error_102': 'Token is not valid!',
  'error_103': 'Cannot parse your data!',
  'error_105': 'Necessary field in your data is missing!',
  'error_104': 'Error in sending message!'
}

export default function l10n (key: string) {
  return currentLanguageStorage[key] || key;
}
