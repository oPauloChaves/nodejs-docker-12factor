module.exports = {
  logging: {
    ops: {
      interval: 1000,
    },
    reporters: {
      consoleReporter: [
        {
          module: "good-squeeze",
          name: "Squeeze",
          args: [{ log: "*", response: "*" }],
        },
        {
          module: "good-console",
        },
        "stdout",
      ],
    },
  },
}
