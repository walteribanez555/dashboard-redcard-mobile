

export function responseModalFormMapper ( resp : any ) {
  let collectedData : any;
  const forms = resp.form;
  forms.forEach( (form : any) => {
      const fields = form.dynamicFields;
      //Get the data.title and the value of the field and make a json with the title as attt and the value as value
      fields.forEach( (field: any) => {
        collectedData = {
          ...collectedData,
          [field.data.title]: field.fieldFormControl.value
        }
      });

  });

  return collectedData;

}
