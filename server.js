const express = require("express");

const db = require("./data/dbConfig.js");

const server = express();

function getAllAccounts() {
  return db("accounts");
}

function getAccountById(id) {
  return db("accounts").where({ id });
}

function createNewAccount({ name, budget }) {
  return db("accounts").insert({ name, budget });
}

function updateAccountById(id, { name, budget }) {
  return db("accounts")
    .where({ id })
    .update({ name, budget });
}

function deleteAccountById(id) {
  return db("accounts")
    .where({ id })
    .del();
}

server.use(express.json());

server.get("/accounts", async (req, res) => {
  const accounts = await getAllAccounts();
  res.status(201).json(accounts);
});

server.get("/accounts/:id", async (req, res, next) => {
  try {
    const account = await getAccountById(req.params.id);
    res.status(201).json(account[0]);
  } catch (error) {
    next(new Error("Couldn't update existing account"));
  }
});

server.post("/accounts", async (req, res, next) => {
  try {
    const arrayOfIds = await createNewAccount(req.body);
    const arrayOfAccounts = await getAccountById(arrayOfIds[0]);
    res.status(201).json(arrayOfAccounts[0]);
  } catch (error) {
    next(new Error("Couldn't create new account"));
  }
});

server.put("/accounts/:id", async (req, res, next) => {
  try {
    const { name, budget } = req.body;
    const result = await updateAccountById(req.params.id, { name, budget });
    res.status(201).json(result);
  } catch (error) {
    next(new Error("Couldn't update account"));
  }
});

server.delete("/accounts/:id", async (req, res, next) => {
  try {
    const account = await deleteAccountById(req.params.id);
    res.status(201).json(account);
  } catch (error) {
    next(new Error("Couldn't delete account"));
  }
});

module.exports = server;
