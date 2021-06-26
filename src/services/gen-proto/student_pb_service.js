// package: student
// file: student.proto

var student_pb = require("./student_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var StudentApp = (function () {
  function StudentApp() {}
  StudentApp.serviceName = "student.StudentApp";
  return StudentApp;
}());

StudentApp.UpPredictResult = {
  methodName: "UpPredictResult",
  service: StudentApp,
  requestStream: false,
  responseStream: false,
  requestType: student_pb.ModelPredict,
  responseType: student_pb.CommonGetResponse
};

StudentApp.GetExams = {
  methodName: "GetExams",
  service: StudentApp,
  requestStream: false,
  responseStream: false,
  requestType: student_pb.CommonGetRequest,
  responseType: student_pb.ExamResponse
};

StudentApp.GetPredicts = {
  methodName: "GetPredicts",
  service: StudentApp,
  requestStream: false,
  responseStream: false,
  requestType: student_pb.GetPredictRequest,
  responseType: student_pb.GetPredictResponse
};

StudentApp.StreamVideo = {
  methodName: "StreamVideo",
  service: StudentApp,
  requestStream: true,
  responseStream: true,
  requestType: student_pb.StreamVideoRequest,
  responseType: student_pb.CommonGetResponse
};

StudentApp.GetUserDetail = {
  methodName: "GetUserDetail",
  service: StudentApp,
  requestStream: false,
  responseStream: false,
  requestType: student_pb.CommonGetRequest,
  responseType: student_pb.CommonGetResponse
};

StudentApp.PutUserDetail = {
  methodName: "PutUserDetail",
  service: StudentApp,
  requestStream: false,
  responseStream: false,
  requestType: student_pb.CommonGetRequest,
  responseType: student_pb.CommonGetResponse
};

exports.StudentApp = StudentApp;

function StudentAppClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

StudentAppClient.prototype.upPredictResult = function upPredictResult(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(StudentApp.UpPredictResult, {
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

StudentAppClient.prototype.getExams = function getExams(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(StudentApp.GetExams, {
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

StudentAppClient.prototype.getPredicts = function getPredicts(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(StudentApp.GetPredicts, {
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

StudentAppClient.prototype.streamVideo = function streamVideo(metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.client(StudentApp.StreamVideo, {
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport
  });
  client.onEnd(function (status, statusMessage, trailers) {
    listeners.status.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners.end.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners = null;
  });
  client.onMessage(function (message) {
    listeners.data.forEach(function (handler) {
      handler(message);
    })
  });
  client.start(metadata);
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    write: function (requestMessage) {
      client.send(requestMessage);
      return this;
    },
    end: function () {
      client.finishSend();
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

StudentAppClient.prototype.getUserDetail = function getUserDetail(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(StudentApp.GetUserDetail, {
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

StudentAppClient.prototype.putUserDetail = function putUserDetail(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(StudentApp.PutUserDetail, {
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

exports.StudentAppClient = StudentAppClient;

