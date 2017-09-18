module.exports = {
  servers: {
    one:  {
      "host": "ec2-52-206-192-26.compute-1.amazonaws.com",
      "username": "ubuntu",
      "pem": "~/Documents/site-troller.pem",
    }
  },

  app: {
    name: 'site-troller',
    path: "../",

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      ROOT_URL: 'http://localhost',
      MONGO_URL: 'mongodb://localhost/meteor',
    },

    docker: {
      // change to 'kadirahq/meteord' if your app is using Meteor 1.3 or older
      image: 'abernix/meteord:base',
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true,
  },

  mongo: {
    oplog: true,
    port: 27017,
    version: '3.4.1',
    servers: {
      one: {}
    }
  }
};
