// package: signUpIn
// file: signUpIn.proto

var signUpIn_pb = require("./signUpIn_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var SignUpIn = (function () {
  function SignUpIn() {}
  SignUpIn.serviceName = "signUpIn.SignUpIn";
  return SignUpIn;
}());

SignUpIn.SignUp = {
  methodName: "SignUp",
  service: SignUpIn,
  requestStream: false,
  responseStream: false,
  requestType: signUpIn_pb.SignUpRequest,
  responseType: signUpIn_pb.SignUpInResponse
};

SignUpIn.SignIn = {
  methodName: "SignIn",
  service: SignUpIn,
  requestStream: false,
  responseStream: false,
  requestType: signUpIn_pb.SignInRequest,
  responseType: signUpIn_pb.SignUpInResponse
};

SignUpIn.SignOut = {
  methodName: "SignOut",
  service: SignUpIn,
  requestStream: false,
  responseStream: false,
  requestType: signUpIn_pb.SignOutRequest,
  responseType: signUpIn_pb.CommonGetResponse
};

SignUpIn.RefreshToken = {
  methodName: "RefreshToken",
  service: SignUpIn,
  requestStream: false,
  responseStream: false,
  requestType: signUpIn_pb.CommonGetRequest,
  responseType: signUpIn_pb.SignUpInResponse
};

exports.SignUpIn = SignUpIn;

function SignUpInClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

SignUpInClient.prototype.signUp = function signUp(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(SignUpIn.SignUp, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

SignUpInClient.prototype.signIn = function signIn(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(SignUpIn.SignIn, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

SignUpInClient.prototype.signOut = function signOut(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(SignUpIn.SignOut, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

SignUpInClient.prototype.refreshToken = function refreshToken(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(SignUpIn.RefreshToken, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.SignUpInClient = SignUpInClient;

