const express = require("express");
const jwt = require('jsonwebtoken');
const cors = require('cors');

const { readDataFromFile, writeDataToFile, getNextUserId, getNextMessageId } = require("./data-manager.js");

const JWT_SECRET_KEY = 'contact-form-manager-server-secret-key';

const app = express();
app.use(cors());
const port = 5165;

app.get("/", (req, res) => {
  res.status(200).send("Hello, World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// sample GET request handler (you can ignore this endpoint)
app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'Anonymous';
  res.status(200).send(`Hello, ${name}!`);
});

// sample POST request handler (you can ignore this endpoint)
app.post('/api/message', express.json(), (req, res) => {
  const message = req.body.message || 'No message provided';
  res.status(200).send(`Your message: ${message}`);
});

async function checkTokenAndRole(req, res, roleList){
  const {token} = req.headers;
  if(!token){
    res.status(401).send({error: 'User is not authenticated'});
    return false;
  }
  try{
    const jwtTokenPayload = jwt.verify(token, JWT_SECRET_KEY);
    const blacklistedTokens = await readDataFromFile("data/blacklisted-tokens.json");
    if(blacklistedTokens.includes(token)){
      res.status(401).send({error: 'User is not authenticated'});
      return false;
    }
    const currentUsers = await readDataFromFile("data/users.json");
    const existingUser = currentUsers.find(user => user.id === jwtTokenPayload.userId);
    if(!existingUser){
      res.status(401).send({error: 'User is not authenticated'});
      return false;
    }
    if(roleList && roleList.length > 0 && !roleList.includes(existingUser.role)){
      res.status(403).send({error: 'User is not authorized'});
      return false;
    }
  }
  catch(err){
    res.status(401).send({error: 'User is not authenticated'});
    return false;
  }
  return true;
}

// POST login user
app.post('/api/user/login', express.json(), async (req, res) => {
  const {username, password} = req.body;
  if(!username){
    res.status(400).send({error: 'Username is required'});
    return;
  }
  if(!password){
    res.status(400).send({error: 'Password is required'});
    return;
  }
  const currentUsers = await readDataFromFile("data/users.json");
  const existingUser = currentUsers.find(user => user.username === username);
  if(!existingUser){
    res.status(400).send({error: 'Username does not exist'});
    return;
  }
  if(existingUser.password !== password){
    res.status(400).send({error: 'Password is incorrect'});
    return;
  }
  const jwtTokenPayload = {
    userId: existingUser.id,
    username: existingUser.username,
  };
  const jwtToken = jwt.sign(jwtTokenPayload, JWT_SECRET_KEY, { expiresIn: '10m' });
  res.status(200).send({data: {user: existingUser, token: jwtToken}});
});

// POST check if user is logged in
app.post('/api/user/check-login', express.json(), async (req, res) => {
  const {token} = req.headers;
  if(!token){
    res.status(401).send({error: 'Token is required'});
    return;
  }
  try{
    const jwtTokenPayload = jwt.verify(token, JWT_SECRET_KEY);
    const blacklistedTokens = await readDataFromFile("data/blacklisted-tokens.json");
    if(blacklistedTokens.includes(token)){
      res.status(401).send({error: 'Token is invalid'});
      return;
    }
    const currentUsers = await readDataFromFile("data/users.json");
    const existingUser = currentUsers.find(user => user.id === jwtTokenPayload.userId);
    if(!existingUser){
      res.status(400).send({error: 'User does not exist'});
      return;
    }
    res.status(200).send({data: {user: existingUser}});
  } catch(err){
    res.status(401).send({error: 'Token is invalid'});
    return;
  }
});

app.post('/api/user/logout', express.json(), async (req, res) => {
  const {token} = req.headers;
  if(!token){
    res.status(401).send({error: 'Token is required'});
    return;
  }
  const blacklistedTokens = await readDataFromFile("data/blacklisted-tokens.json");
  if(!blacklistedTokens.includes(token)){
    blacklistedTokens.push(token);
  }
  writeDataToFile("data/blacklisted-tokens.json", blacklistedTokens);
  res.status(200).send({data: {message: 'Logged out successfully'}});
});

// GET countries
app.get('/api/countries', async (req, res) => {
  const countries = await readDataFromFile("data/countries.json");
  res.status(200).send({data: {countries}});
});

// POST add new message
app.post('/api/message/add', express.json(), async (req, res) => {
  const {name, message, gender, country} = req.body;
  if(!name){
    res.status(400).send({error: 'Name is required'});
    return;
  }
  if(!message){
    res.status(400).send({error: 'Message is required'});
    return;
  }
  if(!gender){
    res.status(400).send({error: 'Gender is required'});
    return;
  }
  if(!country){
    res.status(400).send({error: 'Country is required'});
    return;
  }
  const currentMessages = await readDataFromFile("data/messages.json");
  const newMessageId = await getNextMessageId();
  const newMessage = {id: newMessageId};
  newMessage.name = "" + name;
  newMessage.message = "" + message;
  newMessage.gender = "" + gender;
  newMessage.country = "" + country;
  newMessage.creationDate = new Date().toISOString();
  newMessage.read = "false";
  currentMessages.push(newMessage);
  writeDataToFile("data/messages.json", currentMessages);
  res.status(200).send({data: {message: newMessage}});
});

// GET messages
app.get('/api/messages', async (req, res) => {
  const authCheck = await checkTokenAndRole(req, res, ["admin", "reader"]);
  if(!authCheck){
    return;
  }
  const messages = await readDataFromFile("data/messages.json");
  res.status(200).send({data: {messages}});
});

// GET message by id
app.get('/api/message/:id', async (req, res) => {
  const authCheck = await checkTokenAndRole(req, res, ["admin", "reader"]);
  if(!authCheck){
    return;
  }
  const {id} = req.params;
  const messages = await readDataFromFile("data/messages.json");
  const message = messages.find(message => message.id === id);
  if(!message){
    res.status(404).send({error: 'Message not found'});
    return;
  }
  res.status(200).send({data: {message}});
});

// POST read message by id
app.post('/api/message/read/:id', express.json(), async (req, res) => {
  const authCheck = await checkTokenAndRole(req, res, ["admin", "reader"]);
  if(!authCheck){
    return;
  }
  const {id} = req.params;
  const messages = await readDataFromFile("data/messages.json");
  const message = messages.find(message => message.id === id);
  if(!message){
    res.status(404).send({error: 'Message not found'});
    return;
  }
  message.read = "true";
  writeDataToFile("data/messages.json", messages);
  res.status(200).send({data: {message}});
});

// POST delete message by id
app.post('/api/message/delete/:id', express.json(), async (req, res) => {
  const authCheck = await checkTokenAndRole(req, res, ["admin"]);
  if(!authCheck){
    return;
  }
  const {id} = req.params;
  const messages = await readDataFromFile("data/messages.json");
  const messageIndex = messages.findIndex(message => message.id === id);
  if(messageIndex < 0){
    res.status(404).send({error: 'Message not found'});
    return;
  }
  messages.splice(messageIndex, 1);
  writeDataToFile("data/messages.json", messages);
  res.status(200).send({data: {message: {id}}});
});

// POST add new user with reader role
app.post('/api/user/add-reader', express.json(), async (req, res) => {
  const authCheck = await checkTokenAndRole(req, res, ["admin"]);
  if(!authCheck){
    return;
  }
  const {username, password, base64Photo} = req.body;
  if(!username){
    res.status(400).send({error: 'Username is required'});
    return;
  }
  if(!password){
    res.status(400).send({error: 'Password is required'});
    return;
  }
  if(!base64Photo){
    res.status(400).send({error: 'Photo is required'});
    return;
  }
  const currentUsers = await readDataFromFile("data/users.json");
  const existingUser = currentUsers.find(user => user.username === username);
  if(existingUser){
    res.status(400).send({error: 'Username already exists'});
    return;
  }
  const newUserId = await getNextUserId();
  const newUser = {id: newUserId};
  newUser.username = "" + username;
  newUser.password = "" + password;
  newUser.base64Photo = "" + base64Photo;
  newUser.role = "reader";
  currentUsers.push(newUser);
  writeDataToFile("data/users.json", currentUsers);
  res.status(200).send({data: {user: newUser}});
});

// GET users
app.get('/api/users', async (req, res) => {
  const authCheck = await checkTokenAndRole(req, res, ["admin"]);
  if(!authCheck){
    return;
  }
  const users = await readDataFromFile("data/users.json");
  res.status(200).send({data: {users}});
});

// GET user by id
app.get('/api/user/:id', async (req, res) => {
  const authCheck = await checkTokenAndRole(req, res, ["admin"]);
  if(!authCheck){
    return;
  }
  const {id} = req.params;
  const users = await readDataFromFile("data/users.json");
  const user = users.find(user => user.id === id);
  if(!user){
    res.status(404).send({error: 'User not found'});
    return;
  }
  res.status(200).send({data: {user}});
});

// POST update user by id
app.post('/api/user/update/:id', express.json(), async (req, res) => {
  const authCheck = await checkTokenAndRole(req, res, ["admin"]);
  if(!authCheck){
    return;
  }
  const {id} = req.params;
  const {username, password, base64Photo} = req.body;
  if(!username){
    res.status(400).send({error: 'Username is required'});
    return;
  }
  if(!password){
    res.status(400).send({error: 'Password is required'});
    return;
  }
  if(!base64Photo){
    res.status(400).send({error: 'Photo is required'});
    return;
  }
  const users = await readDataFromFile("data/users.json");
  const user = users.find(user => user.id === id);
  if(!user){
    res.status(404).send({error: 'User not found'});
    return;
  }
  user.username = "" + username;
  user.password = "" + password;
  user.base64Photo = "" + base64Photo;
  writeDataToFile("data/users.json", users);
  res.status(200).send({data: {user}});
});
