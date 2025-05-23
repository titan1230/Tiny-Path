export default function defaultDict(defaultFactory: any) {
  return new Proxy({}, {
    get: (target: any, name: any) => {
      if (!(name in target)) {
        target[name] = typeof defaultFactory === 'function' ? defaultFactory(name) : defaultFactory;
      }
      return target[name];
    }
  });
}