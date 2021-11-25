export function onValidate(arrayErrors, form) {
  let errors = [];

  for(let errorKey in arrayErrors) {
    if(Array.isArray(arrayErrors[errorKey])) {
      // eslint-disable-next-line no-prototype-builtins
      if(form.hasOwnProperty(errorKey)) {
        arrayErrors[errorKey].forEach(err => {
          errors.push({name: errorKey, message: err})
        })
      }
    }
  }

  return errors;
}

export function checkErr(prop, errors) {
  let msg = '';
  errors.forEach(err => {
    if(err.name === prop) {
        msg = err.message;
    }
  })
  return msg;
}
