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
    const mobileRegex = /^(9477)[0-9]{7}$|^(9476)[0-9]{7}$|^(9475)[0-9]{7}$|^(9471)[0-9]{7}$|^(9472)[0-9]{7}$|^(9470)[0-9]{7}$|^(9478)[0-9]{7}$|^(9474)[0-9]{7}$/;
    return value.match(mobileRegex)
};
