//this function will validate a password. In case of success it will return an object = {isSuccess:true}
//otherwise it will return an object = {isSuccess: false, errorMessage: "message"}
function validatePassword(password)
{ 
    let returnObject = {isSuccess: false};
    //checks if the profilepicture is longer than eight characters
    if(password.length<12)
    {
        returnObject.errorMessage = 'Password must be at least 12 characters long';
    }
    //checks if the password contains at least one letter
    else if(password.search(/[a-z]/i)<0)
    {
        returnObject.errorMessage = 'Password must contain at least one letter';
    }
    //checks if the password contains at least one number
    else if(password.search(/[0-9]/)<0)
    {
        returnObject.errorMessage = 'Password must contain at least one number';
    }
    //checks if the password conains at least one special character
    else if(password.search(/[^A-Za-z0-9]/)<0)
    {
        returnObject.errorMessage = 'Password must contain at least one special character';
    }
    else
    {
        returnObject.isSuccess = true;
    }
    return returnObject;
}

function generateQRCodeUrl(key,algorithm,digits,period)
{
    return `https://chart.googleapis.com/chart?chs=166x166&chld=L|0$&cht=qr&chl=otpauth://totp/DemoWebsite?secret=${key}&issuer=DemoWebsite&algorithm=${algorithm}&digits=${digits}&period=${period}`
}

function createRandomBase32String(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

module.exports = {
    validate: validatePassword,
    createRandomBase32String: createRandomBase32String,
    generateQRCodeUrl: generateQRCodeUrl,
};