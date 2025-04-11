import {ObjectId} from 'mongodb';
import {users} from '../config/mongoCollections.js'


/*
    - still testing/editing createUser
        - profile_picture just accepts a string for now
        - username/email taken check
            - check against helper function getAllTaken(Names/Emails)
    - updateUser not started
    - removeUser done but waiting to test
    - getAllUsers/getUserById done but waiting to test
*/

async function createUser (username, email, password, retype, profile_picture, admin) {
    if (username === undefined || typeof username != 'string' || username.trim() === "") throw 'Invalid username.'; 
    for (let i = 0; i < username.length; i++){
        //Allowed characters: A-Z (case insensitive), 0-9, _ , . , -
        if (
        username.charCodeAt(i) !==  95 &&
        username.charCodeAt(i) !== 46 &&
        username.charCodeAt(i) !== 45 &&
        !(username.charCodeAt(i) >= 48 && username.charCodeAt(i) <= 57) &&
        !(username.charCodeAt(i) >= 65 && username.charCodeAt(i) <= 90 ) &&
        !(username.charCodeAt(i) >= 97 && username.charCodeAt(i) <= 122)){
            throw 'Invalid username.';
        } 
    }
    if (username.charCodeAt(0) === 46 || username.charCodeAt(username.length-1) === 46) throw 'Username cannot start or end with \'.\''; //Username cannot start/end with a . (ugly)
    if (username.length < 3 || username.length > 15) throw 'Username must be between 3-15 characters'; 

    if (email === undefined || typeof email != 'string' || email.trim() === "") throw 'Invalid email.'; 
    let atSymbol = -1;
    for (let i = 0; i < email.length; i++){
        if (email.charCodeAt(i) === 64){ //if char is @ break the loop
            atSymbol = i;
            break;
        }
        //Same allowed characters as username
        if ( 
            email.charCodeAt(i) !== 95 &&
            email.charCodeAt(i) !== 46 &&
            email.charCodeAt(i) !== 45 &&
            !(email.charCodeAt(i) >= 48 && email.charCodeAt(i) <= 57) &&
            !(email.charCodeAt(i) >= 65 && email.charCodeAt(i) <= 90 ) &&
            !(email.charCodeAt(i) >= 97 && email.charCodeAt(i) <= 122)){
                console.log(email.charAt(i))
                throw 'Invalid email address.'; 
            }
    }
    if (atSymbol === -1) throw 'Invalid email address.' 
    let period = -1;
    for (let i = atSymbol + 1; i < email.length; i++){
        if (email.charCodeAt(i) === 46){ //if char is . break the loop
            period = i;
            break;
        }
        if ( 
            !(email.charCodeAt(i) >= 65 && email.charCodeAt(i) <= 90 ) &&
            !(email.charCodeAt(i) >= 97 && email.charCodeAt(i) <= 122)){
                throw 'Invalid email address.'; 
            }
    }
    if (period === -1) throw 'Invalid email address.' //If period is never seen on second part of email address
    const validDomain = {'com': 1, 'net': 1, 'gov': 1, 'edu': 1, 'org': 1} //Might need more? Blanking
    if (validDomain[email.slice(period+1, email.length)] !== 1) throw 'Invalid email address.' 
    email = email.toLowerCase();

    if (password === undefined || typeof password != 'string' || password.trim() === "") throw 'Invalid password.';
    if (password.length < 8 || password.length > 20) throw 'Invalid password (8-20 characters).'                        
    const characters = {lower: 0, upper: 0, special: 0, number: 0};                                              
    for (let i = 0; i < password.length; i++){
        if (password.charCodeAt(i) > 48 && password.charCodeAt(i) < 57) characters['number']++;
        else if (password.charCodeAt(i) >= 65 && password.charCodeAt(i) <= 90) characters['upper']++;
        else if (password.charCodeAt(i) >= 97 && password.charCodeAt(i) <= 122) characters['lower']++;
        else characters['special']++;                  
    }                       
    if (characters['lower'] === 0 || characters['upper'] === 0 || characters['special'] === 0 || characters['numbers'] === 0)  //If one isnt seen throw error
        throw 'Invalid password (must include 1 A-Z, 1 a-z, 1 special character, and 1 number.'
    if (password !== retype) throw 'Passwords do not match.'  
    if (profile_picture === undefined || typeof profile_picture != 'string' || profile_picture.trim() === "") throw 'Invalid image URL.'; //Not complete
    if (admin === undefined || typeof admin !== 'boolean') throw 'Invalid admin status (True or False).';
    let newUser = {
        username,
        email,
        password,
        profile_picture, 
        admin,
        friends: [],
        comments: [],
        games: []
    }
    const userCollection = await users();
    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Could not add user';
    const newId = insertInfo.insertedId.toString();
    newUser._id = newId;

    return newUser;
}




const exportedMethods = {
    async removeMovie (id) {

        if (id === undefined) throw 'error: you must provide an id to search for';
        if (typeof id !== 'string') throw 'error: id must be a string';
        if (id.trim().length === 0)
          throw 'error: id cannot be an empty string or just spaces';
        id = id.trim();
        if (!ObjectId.isValid(id)) throw 'error: invalid object ID';
        const userCollection = await users();
        const deletionInfo = await userCollection.findOneAndDelete({
          _id: new ObjectId(id)
        });
        if (!deletionInfo) {
          throw `error: could not delete user with id of ${id}`;
        }
        return `${deletionInfo.username} has been successfully deleted!`;
    
    },
    async getAllUsers () {
        const userCollection = await users();
        let userList = await userCollection.find({}).toArray();
        if (!userList) throw 'Could not get all users';
        userList = userList.map((element) => {
            element._id = element._id.toString();
            return element;
        });
        return userList
    },
    async getUserById (id) {
        if (id === undefined | typeof id !== string) throw 'Invalid ID';
        if (id.trim().length === 0)
          throw 'error: id cannot be an empty string or just spaces';
        id = id.trim();
        if (!ObjectId.isValid(id)) throw 'Invalid user ID';
        const userCollection = await movies();
        const user = await movieCollection.findOne({ _id: new ObjectId(id) });
        if (user === null) throw 'error: no user with that id';
        user._id = user._id.toString();
        return user;
      
    }
};
export default exportedMethods;