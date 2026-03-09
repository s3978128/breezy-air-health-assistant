// Return true / false

function validateEmail(emailInput: string) {
  /* link: https://stackoverflow.com/questions/19605773/html5-email-validation
  The input type=email page of the www.w3.org site notes that an email address is any string which matches the following regular expression:
  */
  const regex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  if (regex.test(emailInput)) return true
  return false
}

function validatePassword(passwordInput: string) {
  /* link: https://stackoverflow-com.translate.goog/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a?_x_tr_sl=en&_x_tr_tl=vi&_x_tr_hl=vi&_x_tr_pto=tc
    ^                 # start-of-string
    (?=.*[0-9])       # at least one digit                  (?=.*\d)
    (?=.*[a-z])       # at least one lower case letter      {1,} match one or more   
    (?=.*?[A-Z])       # at least one upper case letter     (? match as many characters as possible.)
    (?=.*\W)(?!.* )   # at least one special character      (?=.*[$@$!%*?&+~|{}:;<>/])
    (?=\S+$)          # no whitespace                       (?!.*\s)
    {8,16}            # at least 8 and maximum is 16 of length
    $                 # end-of-string
    */
  const regex = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,16}$/
  if (regex.test(passwordInput)) return true
  return false
}

function validatePasswordConfirmation(confirmPasswordInput: string, passwordInput: string) {
  return passwordInput === confirmPasswordInput
}

function validateUuidCode(code: string) {
  const regex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89aAbB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
  if (regex.test(code)) return true
  return false
}

export { validateEmail, validatePassword, validatePasswordConfirmation, validateUuidCode }
