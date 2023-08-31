const { createMachine } = require('xstate');
const Business = require('./business');

const fetchMachine = createMachine(
  {
    id: 'traffic-lights',
    predictableActionArguments: true,
    // Initial state
    initial: 'idle',

    // States
    states: {
      idle: {
        on: {
          START: {
            target: 'red',
            actions: [
              (context, event) => {
                console.log(event);
              },
            ],
          },
        },
      },
      red: {
        on: {
          GREEN: {
            target: 'green',
            actions: [
              (ctx, event) => {
                console.log('Calling function setGreen.');
                const business = new Business();
                business.setGreen(ctx, event);
              },
            ],
          },
          YELLOW: {
            target: 'yellow',
            cond: (ctx, event) => {
              const isValid = event?.payload?.forcefully === true;
              console.log(isValid ? `CONDITION is OK.` : 'CONDITION FAILED');
              return isValid;
            },
            actions: ['yellowHandler'],
          },
          RESET: { target: 'idle' },
        },
      },
      green: {
        on: {
          YELLOW: {
            target: 'yellow',
            actions: ['yellowHandler'],
          },
          RESET: { target: 'idle' },
        },
      },
      yellow: {
        on: {
          RESTART: {
            target: 'red',
            actions: [
              (ctx, event) => {
                console.log('Calling function setRed.');
                const business = new Business();
                business.setRed(ctx, event);
              },
            ],
          },
          RESET: { target: 'idle' },
        },
      },
    },
  },
  {
    actions: {
      yellowHandler: (ctx, event) => {
        console.log('Calling function setYellow.');
        const business = new Business();
        business.setYellow(ctx, event);
      },
    },
  },
);

module.exports = fetchMachine;
