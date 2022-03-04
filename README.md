# Innlevering, deploy quiz frontend and server to Heroku
<h6 align="center">

[![Build](https://github.com/kristiania-pg6301-2022/pg6301-innlevering-runejac/actions/workflows/test.yml/badge.svg)](https://github.com/kristiania-pg6301-2022/pg6301-innlevering-runejac/actions/workflows/test.yml)
[![Coverage Status](https://coveralls.io/repos/github/kristiania-pg6301-2022/pg6301-innlevering-runejac/badge.svg?branch=main)](https://coveralls.io/github/kristiania-pg6301-2022/pg6301-innlevering-runejac?branch=main)

</h6>


<h6 align="center">

![GitHub repo size](https://img.shields.io/github/repo-size/runejac/web-api-own-account-innlevering-runejac)
![Parcel](https://badges.aleen42.com/src/parcel.svg)
![React](https://badges.aleen42.com/src/react.svg)
![Node](https://badges.aleen42.com/src/node.svg)
![TypeScript](https://badges.aleen42.com/src/typescript.svg)
![ESLint](https://badges.aleen42.com/src/eslint.svg)
![Jest](https://badges.aleen42.com/src/jest_1.svg)

</h6>

<h3 align="center">

https://pg6301-innlevering-runejac.herokuapp.com/

</h3>

* [x] client side
* [x] server side
* [x] Coveralls io
* [x] GET api/question/random
* [x] POST api/question/answer
* [x] GET api/question/score
* [x] deploy til Heroku
* [x] tester for server
* [x] tester for client (ikke helt done)
* [x] github actions (🟢)
* [x] itsDone(ok: Chill)

---

#### Oppsummert:
✔ Få en Parcel til å bygge en React applikasjon <br/>
✔ Få React Router til å navigere rundt i applikasjonen <br/>
✔ Få React til å hente og lagre informasjon til et API <br/>
✔ Få Github Actions til å kjøre Jest-testene og publisere coverage til Coveralls <br/>
✔ Få Heroku til å publisere websidene <br/>

#### Express-serveren skal ha følgende API:
✔ GET /api/question - returnerer et tilfeldig spørsmål med { id, category, 
question, answers } <br/>
✔ POST /api/question - tar inn { id, answer } og returnerer "true" eller "false"
