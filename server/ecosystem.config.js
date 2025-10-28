module.exports = {
  apps: [
    {
      name: "eduverse-lms",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
