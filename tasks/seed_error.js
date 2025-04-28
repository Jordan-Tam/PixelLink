/**
 * The purpose of this file is to test if the data functions are throwing the correct errors when given bad input data.
 */

//////////////////////////////////////////////////////////////
// USERS: Create User
//////////////////////////////////////////////////////////////
try {
    await createUser();
} catch (e) {
    console.log(e === "createUser Error: username is undefined.");
}