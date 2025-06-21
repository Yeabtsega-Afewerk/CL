// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('Class');

// Create a new document in the collection.
db.getCollection('users').insertOne({
    username: "Haile",
    password: "$2a$12$TTMXJP0HrHOlKRiasACgv.U.pkvsg.TaTdTeLV5zhKOsi9Css3koW",
    role: "superadmin"
});
