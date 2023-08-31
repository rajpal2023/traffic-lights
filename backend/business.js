class Business {
  constructor() {
    console.log('Initializing BussinessClass.');
  }

  setRed(ctx, event) {
    console.log('LOGIC: running Red Bussiness');
  }
  setGreen(ctx, event) {
    console.log(event);
    console.log('LOGIC: running Green Bussiness');
  }
  setYellow(ctx, event) {
    console.log('LOGIC: running Yellow Bussiness');
  }
}
module.exports = Business;
