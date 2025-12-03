class VexoAnalytics {
  constructor() {
    this.events = [];
  }

  track(event, properties = {}) {
    const data = {event, properties, timestamp: new Date().toISOString()};
    this.events.push(data);
    if (__DEV__) console.log('[Vexo Analytics]', data);
  }
}

const vexo = new VexoAnalytics();

export const track = (event, properties) => vexo.track(event, properties);
export default vexo;
