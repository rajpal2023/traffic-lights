const express = require('express');
const { interpret } = require('xstate');
const bodyParser = require('body-parser');

var cors = require('cors');

const fetchMachine = require('./machine');

const machineService = interpret(fetchMachine).onTransition((state) => {
  const isForcefully = state?.event?.payload?.forcefully === true;
  console.log(
    `>> LOG: Event Recieved: ${state._event.name} ${
      isForcefully ? 'FORCE' : ''
    }\t\tBefore: ${state.history?.value}\t\tAfter: ${state.value}\t\tChanged: ${
      state.changed ? 'YES' : 'NO'
    }`,
  );
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
});
machineService.start();

const app = express();
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('hi');
});

app.post('/lights', async (req, res) => {
  const body = req.body;
  // console.log(body);
  machineService.send(body);
  // if (type === 'START') {
  //   // console.log(data);
  // }
  // console.log(machineService);
  const changed = machineService._state.changed;
  res.send({
    currentState: machineService._state.value,
    changed,
    message: `${machineService._state.event?.type} is ${
      changed ? '' : '--NOT--'
    } ACCEPTED.`,
  });
});

app.listen(3000, () => {
  console.log('App is listening at http://localhost:3000/');
});
