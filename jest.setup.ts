Object.defineProperty(globalThis, 'crypto', {
  value: {
    getRandomValues: (bytes: Uint8Array) => {
      for (let index = 0; index < bytes.length; index += 1) {
        bytes[index] = (index * 17 + 31) % 256;
      }

      return bytes;
    },
  },
});
