export const textFieldValidator = (value,length)=>{
    if (value.trim()===''){
        return false;
    }else return value.length >= length
};

export const emailValidator = (value) => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return value.match(emailRegex)
};

export const nicValidator = (value) => {
    const emailRegex = /^([0-9]{9}[V|v]|[0-9]{12})$/;
    return value.match(emailRegex)
};

export const mobileNumberValidator = (value) => {
    const mobileRegex = /^(077)[0-9]{7}$|^(076)[0-9]{7}$|^(075)[0-9]{7}$|^(071)[0-9]{7}$|^(072)[0-9]{7}$|^(070)[0-9]{7}$|^(078)[0-9]{7}$|^(074)[0-9]{7}$/;
    return value.match(mobileRegex)
};
