// calling in jsonwebtoken a npm that securely transmits our json data.
const jwt = require('jsonwebtoken');
// used to verify jwt tokens that come through. Jwt are signed with a secret encoded to allow for security. 
const secret = '%N8xuH(P~<m,UG.>=4EJ[p['
// setting the expiration time for jwt created. 
const expiration = '2h';

// giving node.js authority to export modules found within the brackets so we can use them in other areas of our application
module.exports = {
    // creating a function called authMiddleware and giving the function a passable value
    authMiddleware: function ({req}) {
        // setting a temporary definition for token that will come from the information passed through when the boolean value 
        // of one of these 3 options coming back as true 
        let token = req.body.token || req.query.token || req.headers.authorization

        // if req.headers.authroization is true return token plus smethods below
        if (req.headers.authroization) {
            // split divides the token string into an ordered list of substrings, puts these substrings into an array, and return array
            // pop removes last element of the array and returns that element
            // trim removes the whitespace fro both ends of string
            token = token.split(' ').pop().trim();
        }

        // if token isn't defined return true and enter into the if statment
        if (!token){
            // responded with the full req body
            return req; 
        }

        // Try to execute the function but if it doesn't work properly then to execute catch function
        try {
            // setting our data variable to anything the verify method responds with
            // const {data} is creating a constant variable that we can redefine somewhere else. 
            // jwt.verify method is used to check if token is valid by comparing token and running it through our secret/age timeout
            const { data } = jwt.verify(token, secret, {maxAge: expiration} )
            // if data becomes defined then req.user will be reassigned as data
            req.user = data;
            // if code in try block throws execption then javascript executes catch block 
        } catch {
            // if sent to catch block, console will display 'invalid token' message
            console.log('Invlaid Token');
        }

        // After completing try catch statement return req body
        return req; 

    },

    // creating a function labeled signtoken that we search for specific res named email, username, and _id
    signToken: function({email, username, _id}){
        // creating a constant named payload that has a reassignable defentions from email, username, and _id
        const payload = { email, username, _id};
        // we return validated jsonwebtoken as a string by combining our payload, securing the process with our secret, 
        // giving the token a time span for when the token will expire. 
        // reassigning data the contents of our payload information
        return jwt.sign({ data: payload}, secret, { expiresIn: expiration});
    },

}; 