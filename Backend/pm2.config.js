module.exports = {
  apps: [
    {
      name: "webshop",
      script: "build/index.js", 
      instances: 1,
      exec_mode: "fork",
      watch: true,
    },
  ],
};
